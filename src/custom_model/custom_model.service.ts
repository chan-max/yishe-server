/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-02 17:58:18
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-08 20:18:09
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
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { AiService } from '../ai/ai.service';

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
    let tempPngPath = '';
    let cosPngKey = '';
    let isSvg = imageUrl.endsWith('.svg') || imageUrl.includes('.svg?');
    try {
      if (isSvg) {
        // 1. 下载svg到本地
        const svgRes = await fetch(imageUrl);
        const svgBuffer = await svgRes.arrayBuffer();
        const svgData = Buffer.from(svgBuffer);
        // 2. 转为png
        const fileName = `ai_tmp_${Date.now()}.png`;
        tempPngPath = path.join('/tmp', fileName);
        await sharp(svgData).png().toFile(tempPngPath);
        // 3. 上传到cos
        const fileBuffer = fs.readFileSync(tempPngPath);
        const cosRes = await this.cosService.uploadBuffer(fileBuffer, fileName);
        imageUrl = cosRes.url;
        cosPngKey = cosRes.key;
      }
      // 4. 拼接结构和格式要求
      let finalPrompt = '';
      if (prompt) {
        finalPrompt = `${prompt}\n请以如下 JSON 格式返回：{name:'模型名称', description:'模型描述', keywords:'关键字'}。内容尽量使用中文，除英文词之外，只返回 JSON，不要其他解释，也不要用\`\`\`json或\`\`\`包裹。`;
      } else {
        finalPrompt = "请分析这张图片内容，并以如下 JSON 格式返回：{name:'模型名称', description:'模型描述', keywords:'关键字'}。只返回 JSON，不要其他解释，也不要用```json或```包裹。";
      }
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
    } finally {
      // 5. 删除临时png（cos和本地）
      if (isSvg && cosPngKey) {
        await this.cosService.deleteFile(cosPngKey);
      }
      if (isSvg && tempPngPath && fs.existsSync(tempPngPath)) {
        fs.unlinkSync(tempPngPath);
      }
    }
  }
}