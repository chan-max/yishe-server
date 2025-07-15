import { Injectable } from '@nestjs/common';
import { CreateProductModelDto } from './dto/create-product_model.dto';
import { UpdateProductModelDto } from './dto/update-product_model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from './entities/product_model.entity';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { CosService } from 'src/common/cos.service';
import { AiService } from '../ai/ai.service';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductModelService {

  constructor(
    @InjectRepository(ProductModel)
    private productModelRepository,
    private cosService: CosService,
    private aiService: AiService,
  ) {
    // 设置 CosService 到 ProductModel 实体
    ProductModel.setCosService(cosService);
  }

  async create(createProductModelDto: CreateProductModelDto) {
    return await this.productModelRepository.save(createProductModelDto)
  }

  findAll() {
    return `This action returns all productModel`;
  }

  async findOne(id) {
    let res = await this.productModelRepository.findOne({ id });
    return res
  }

  async update(post) {
    const item = await this.productModelRepository.findOne(post.id);
    Object.assign(item, post);
    return this.productModelRepository.save(item);
  }

  async remove(id: number) {
    const model = await this.productModelRepository.findOne({ id });
    if (model) {
      try {
        // 删除模型文件
        if (model.url) {
          await this.cosService.deleteFile(model.url);
        }
        // 删除缩略图
        if (model.thumbnail) {
          await this.cosService.deleteFile(model.thumbnail);
        }
      } catch (error) {
        console.error('删除 COS 文件失败:', error);
        // 这里我们不抛出错误，因为文件删除失败不应该影响模型删除
      }
    }
    return this.productModelRepository.delete(id);
  }

  async getPage({
    post
  }) {
    const page = (post.currentPage - 1) * post.pageSize;
    const limit = post.pageSize;
    const pagination = new Pagination(
      { current: post.currentPage, size: post.pageSize },
    );
    const db = this.productModelRepository.createQueryBuilder()
      .skip(page)
      .take(limit)
      .where(createQueryCondition(post, []))
      .orderBy('create_time', 'DESC');

    const result = pagination.findByPage(db);
    return result;
  }

  /**
   * AI生成商品模型信息（名称、描述、关键字）
   * @param id 商品模型id
   * @param prompt 可选，用户自定义提示词
   */
  async aiGenerateInfo(id: string, prompt?: string) {
    const model = await this.productModelRepository.findOne({ id });
    if (!model) throw new Error('未找到商品模型');
    const imageUrl = model.thumbnail;
    if (!imageUrl) throw new Error('商品模型无缩略图');

    // 拼接结构和格式要求
    let finalPrompt = '';
    if (prompt) {
      finalPrompt = `请分析这张商品内容 ,提示词为${prompt}\n请以如下 JSON 格式返回：{name:'模型名称', description:'模型描述', keywords:'模型关键字'}。只返回 JSON，不要其他解释，也不要用\`\`\`json或\`\`\`包裹。`;
    } else {
      finalPrompt = "请分析这张商品内容，并以如下 JSON 格式返回：{name:'模型名称', description:'模型描述', keywords:'模型关键字'}。只返回 JSON，不要其他解释，也不要用```json或```包裹。";
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
    // 无论有无变化都写入数据库
    model.name = info.name || '';
    model.description = info.description || '';
    model.keywords = info.keywords || '';
    await this.productModelRepository.save(model);
    return {
      name: model.name,
      description: model.description,
      keywords: model.keywords,
      raw: text
    };
  }
}
