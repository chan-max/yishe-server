/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-02 17:58:18
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-15 21:54:19
 * @FilePath: /design-server/src/custom_model/custom_model.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { InjectRepository, } from '@nestjs/typeorm';
import { CustomModel } from './entities/custom_model.entity';
import { BasicService } from 'src/common/basicService';
import { User } from 'src/user/entities/user.entity';
import { Draft } from 'src/draft/entities/draft.entity';
import { CosService } from 'src/common/cos.service';
import { In } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { AiService } from '../ai/ai.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class CustomModelService extends BasicService {

  constructor(
    @InjectRepository(CustomModel)
    private customModelRepository,
    @InjectRepository(User)
    private userRepository,
    @InjectRepository(Draft)
    private draftRepository,
    private cosService: CosService,
    private aiService: AiService,
    private productService: ProductService, // 新增注入
  ) {
    super()
  }

  async create(post) {
    console.log('Received post data:', JSON.stringify(post, null, 2));
    
    // 确保其他字段的类型正确
    if (post.customPrice) post.customPrice = Number(post.customPrice);
    if (post.price) post.price = Number(post.price);
    if (post.isPublic !== undefined) post.isPublic = Boolean(post.isPublic);
    if (post.customizable !== undefined) post.customizable = Boolean(post.customizable);
    
    try {
      const result = await this.customModelRepository.save(post);
      console.log('Save result:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all `;
  }

  async findOne(id) {
    console.log(id)
    let res = await this.customModelRepository.findOne({ where: { id: (id) }, relations: ['uploader'] });
    return res
  }

  async update(post) {
    const item = await this.customModelRepository.findOne(post.id);
    // 如果缩略图有变化，且原来有缩略图，先删除旧的
    if (post.thumbnail && item.thumbnail && post.thumbnail !== item.thumbnail) {
      await this.cosService.deleteFile(item.thumbnail);
    }
    Object.assign(item, post);
    return this.customModelRepository.save(item);
  }

  async remove(ids: string | string[]) {
    // 确保 ids 是数组
    const idArray = Array.isArray(ids) ? ids : [ids];
    
    // 查找所有要删除的自定义模型
    const customModels = await this.customModelRepository.find({ where: { id: In(idArray) } });
    if (!customModels.length) {
      throw new Error('未找到要删除的自定义模型');
    }

    // 删除 COS 上的文件
    for (const customModel of customModels) {
        if (customModel.thumbnail) {
        try {
          await this.cosService.deleteFile(customModel.thumbnail);
      } catch (error) {
        console.error('删除 COS 文件失败:', error);
        // 这里我们不抛出错误，因为文件删除失败不应该影响数据库删除
      }
    }
    }

    // 处理关联的草稿文件
    const drafts = await this.draftRepository.find({ where: { customModelId: In(idArray) } });
    if (drafts.length > 0) {
      console.log(`找到 ${drafts.length} 个关联的草稿文件，准备删除`);
      
      // 删除关联草稿的COS文件
      for (const draft of drafts) {
        if (draft.url) {
          try {
            await this.cosService.deleteFile(draft.url);
            console.log(`成功删除草稿COS文件: ${draft.url}`);
          } catch (error) {
            console.error('删除草稿COS文件失败:', error);
            // 这里我们不抛出错误，因为文件删除失败不应该影响数据库删除
          }
        }
      }
      
      // 删除关联的草稿记录
      const deleteResult = await this.draftRepository.delete({ customModelId: In(idArray) });
      console.log(`成功删除 ${deleteResult.affected} 个关联草稿记录`);
    }

    // 删除数据库记录
    return this.customModelRepository.delete(idArray);
  }

  async getPage(post, userInfo) {
    // 查询个人上传
    if (post.myUploads && !userInfo) {
      throw new UnauthorizedException('请登录');
    }

    const where = null
    const queryBuilderName = 'customModel'

    function queryBuilderHook(qb) {
      qb
        .leftJoinAndSelect('CustomModel.uploader', 'user')
        .select([
          "CustomModel.id",
          "CustomModel.name",
          "CustomModel.createTime",
          "CustomModel.updateTime",
          "CustomModel.thumbnail",
          "CustomModel.description",
          "CustomModel.keywords",
          "CustomModel.meta",
          "CustomModel.isTemplate",
          "user.name",
          "user.account",
          "user.email",
          "user.avatar",
          "user.isAdmin",
        ])

      if (post.myUploads) {
        qb.where('CustomModel.uploaderId = :uploaderId', { uploaderId: userInfo.id })
      }

      // 搜索 关键字 匹配 
      if (post.match) {
        let match = Array.isArray(post.match) ? post.match : [post.match]
        match.forEach(matcher => {
          if (!match) {
            return
          }

          qb.where('CustomModel.name LIKE :searchTerm', { searchTerm: `%${matcher}%` })
            .orWhere('CustomModel.description LIKE :searchTerm', { searchTerm: `%${matcher}%` })
            .orWhere('CustomModel.keywords LIKE :searchTerm', { searchTerm: `%${matcher}%` });
        });
      }

      // 是否可定制
      if (post.customizable) {
        qb.where('CustomModel.customizable = :customizable', { customizable: post.customizable == '1' })
      }

      // 是否为母版过滤
      if (post.isTemplate !== undefined && post.isTemplate !== null && post.isTemplate !== '') {
        qb.andWhere('CustomModel.isTemplate = :isTemplate', { isTemplate: !!post.isTemplate });
      }

      qb.orderBy('CustomModel.createTime', post.createTimeOrderBy || 'DESC')

      if (post.priceOrderBy) {
        qb.orderBy('CustomModel.price', post.priceOrderBy)
      }

      // 指定基础模型
      if (post.baseModelId) {
        qb.where(`json_valid(CustomModel.meta)`).andWhere(`json_search(CustomModel.meta, "one",:value)`, { value: `%${post.baseModelId}%` })
      }
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.customModelRepository
    })
  }

  async aiGenerateInfo(id: string, prompt?: string) {
    const model = await this.customModelRepository.findOne({ id });
    if (!model) throw new Error('未找到设计模型');
    if (!model.thumbnail) throw new Error('模型无缩略图');

    let imageUrl = model.thumbnail;
    // 直接用图片地址，不处理svg
    let finalPrompt = '';
    const basePrompt = "内容尽量使用中文，除英文词之外，只返回 JSON，不要其他解释，也不要用```json或```包裹。请以如下 JSON 格式返回：{name:'模型名称', description:'模型描述', keywords:'关键字'}。";
    finalPrompt = prompt
      ? `${prompt}\n${basePrompt}`
      : `请分析这张图片内容，并${basePrompt}`;

    const params = {
      model: 'qwen-vl-max',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: finalPrompt }
          ]
        }
      ]
    };
    const res = await this.aiService.qwenChat(params);
    let text = res.choices?.[0]?.message?.content || JSON.stringify(res);
    // 尝试提取JSON
    let info;
    try {
      const match = text.match(/{[\s\S]*}/);
      if (match) {
        info = JSON.parse(match[0]);
      } else {
        info = {};
      }
    } catch (e) {
      info = {};
    }
    // 更新模型信息
    model.name = info.name || model.name;
    model.description = info.description || model.description;
    model.keywords = info.keywords || model.keywords;
    await this.customModelRepository.save(model);
    return {
      name: model.name,
      description: model.description,
      keywords: model.keywords,
      raw: text
    };
  }

  /**
   * 基于 customModel thumbnail 生成商品风格的 name/description/keywords
   */
  private async aiGenerateProductInfoForCustomModel(model: CustomModel) {
    if (!model.thumbnail) throw new Error('模型无缩略图');
    const imageUrl = model.thumbnail;
    // 校验图片格式
    if (!/^https?:\/\//.test(imageUrl)) {
      throw new Error('图片地址不是公网直链，AI无法访问');
    }
    if (imageUrl.endsWith('.svg') || imageUrl.endsWith('.webp')) {
      throw new Error('AI生成暂不支持SVG/WEBP格式图片，请上传JPG/PNG缩略图');
    }
    const prompt = '请用适合商品销售的风格，生成商品名称、商品描述和商品关键词，内容应突出卖点、吸引用户购买，风格可以参考电商平台商品介绍。请以如下 JSON 格式返回：{name:"商品名称", description:"商品描述", keywords:"商品关键词"}。只返回 JSON，不要其他解释，也不要用```json或```包裹。';
    const params = {
      model: 'qwen-vl-max',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: prompt }
          ]
        }
      ]
    };
    const res = await this.aiService.qwenChat(params);


    let text = res.choices?.[0]?.message?.content || JSON.stringify(res);
    let info;
    try {
      const match = text.match(/{[\s\S]*}/);
      if (match) {
        info = JSON.parse(match[0]);
      } else {
        info = {};
      }
    } catch (e) {
      info = {};
    }
    return {
      name: info.name || model.name,
      description: info.description || model.description,
      keywords: info.keywords || model.keywords,
      raw: text
    };
  }

  async customModelToProduct(customModelId: string) {
    // 查询设计模型
    const model = await this.customModelRepository.findOne({ where: { id: customModelId } });
    if (!model) throw new Error('未找到设计模型');
    // AI生成商品介绍风格内容
    const aiInfo = await this.aiGenerateProductInfoForCustomModel(model);
    // 将AI生成的信息同步存回 custom_model
    // model.name = aiInfo.name || model.name;
    // model.description = aiInfo.description || model.description;
    // model.keywords = aiInfo.keywords || model.keywords;
    // await this.customModelRepository.save(model);
    // 构造产品参数
    const params = {
      code: '',
      name: aiInfo.name || model.name || '未命名产品',
      description: aiInfo.description || model.description || '',
      type: '自定义模型',
      images: [],
      price: 0,
      stock: 0,
      customModelId: model.id,
      keywords: aiInfo.keywords || model.keywords || '',
      isActive: true,
      isPublish: false,
      isLimitedEdition: 0
      // meta 字段已移除
    };
    // 创建产品
    return await this.productService.create(params);
  }
}