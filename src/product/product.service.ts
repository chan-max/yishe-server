/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 12:42:39
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-03 06:39:59
 * @FilePath: /design-server/src/product/product.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { BasicService } from 'src/common/basicService';
import { In } from 'typeorm';
import { CosService } from '../common/cos.service';
import { AiService } from '../ai/ai.service';


@Injectable()
export class ProductService extends BasicService {
  constructor(
    @InjectRepository(Product)
    private productRepository,
    private cosService: CosService,
    private aiService: AiService,
  ) {
    super();
  }
  
  async create(post) {
    return await this.productRepository.save(post);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: string) {
    return await this.productRepository.findOne({ id });
  }

  async update(post) {
    const item = await this.productRepository.findOne(post.id);
    if (!item) {
      throw new Error('商品不存在');
    }

    // 处理图片更新
    if (post.images !== undefined) {
      const oldImages = item.images || [];
      const newImages = post.images || [];
      
      // 找出被删除的图片
      const deletedImages = oldImages.filter(url => !newImages.includes(url));
      
      // 删除不再使用的 COS 文件
      if (deletedImages.length > 0) {
        try {
          await Promise.all(
            deletedImages.map(url => this.cosService.deleteFile(url))
          );
        } catch (error) {
          console.error('删除 COS 文件失败:', error);
          // 这里我们不抛出错误，因为文件删除失败不应该影响商品更新
        }
      }
    }
    // 处理视频更新
    if (post.videos !== undefined) {
      const oldVideos = item.videos || [];
      const newVideos = post.videos || [];
      // 找出被删除的视频
      const deletedVideos = oldVideos.filter(url => !newVideos.includes(url));
      // 删除不再使用的 COS 文件
      if (deletedVideos.length > 0) {
        try {
          await Promise.all(
            deletedVideos.map(url => this.cosService.deleteFile(url))
          );
        } catch (error) {
          console.error('删除 COS 视频文件失败:', error);
          // 这里我们不抛出错误，因为文件删除失败不应该影响商品更新
        }
      }
    }

    // 只更新允许的字段
    const allowedFields = [
      'code',
      'name',
      'description',
      'type',
      'images',
      'videos',
      'price',
      'salePrice',
      'stock',
      'specifications',
      'tags',
      'keywords',
      'isActive',
      'isPublish',
      'isLimitedEdition',
      'customModelId'
    ];

    // 只复制允许的字段
    allowedFields.forEach(field => {
      if (post[field] !== undefined) {
        item[field] = post[field];
      }
    });


    console.log(post.videos)
    return this.productRepository.save(item);
  }

  async remove(id: string) {
    return this.productRepository.delete(id);
  }

  async removeMany(ids: string[]) {
    if (!ids || ids.length === 0) {
      return;
    }
    // 先查出所有要删除的商品
    const products = await this.productRepository.find({ where: { id: In(ids) } });
    // 收集所有图片和视频 URL
    const allImages = products
      .map(product => Array.isArray(product.images) ? product.images : [])
      .flat();
    const allVideos = products
      .map(product => Array.isArray(product.videos) ? product.videos : [])
      .flat();
    // 删除 COS 文件
    const allFiles = [...allImages, ...allVideos];
    if (allFiles.length > 0) {
      try {
        await Promise.all(
          allFiles.map(url => this.cosService.deleteFile(url))
        );
      } catch (error) {
        console.error('批量删除 COS 文件失败:', error);
        // 文件删除失败不影响数据库删除
      }
    }
    // 删除数据库记录
    return this.productRepository.delete({ id: In(ids) });
  }

  async getPage(post) {
    const where = null;
    const queryBuilderName = 'Product';

    function queryBuilderHook(qb) {
      qb
        .select([
          'Product.id',
          'Product.code',
          'Product.name',
          'Product.description',
          'Product.type',
          'Product.images',
          'Product.videos',
          'Product.price',
          'Product.salePrice',
          'Product.stock',
          'Product.specifications',
          'Product.tags',
          'Product.keywords',
          'Product.isActive',
          'Product.isPublish',
          'Product.isLimitedEdition',
          'Product.createTime',
          'Product.updateTime',
          'Product.customModelId',
        ])
        .leftJoinAndSelect('Product.customModel', 'customModel')
        .orderBy('Product.createTime', 'DESC');

      if (post.type) {
        qb.andWhere('Product.type = :type', { type: post.type });
      }

      if (post.isPublish !== undefined) {
        qb.andWhere('Product.isPublish = :isPublish', { isPublish: post.isPublish });
      }

      if (post.customModelId) {
        qb.andWhere('Product.customModelId = :customModelId', { customModelId: post.customModelId });
      }

      if (post.search) {
        qb.where('Product.name LIKE :searchTerm', { searchTerm: `%${post.search}%` })
          .orWhere('Product.description LIKE :searchTerm', { searchTerm: `%${post.search}%` })
          .orWhere('Product.tags LIKE :searchTerm', { searchTerm: `%${post.search}%` })
          .orWhere('Product.keywords LIKE :searchTerm', { searchTerm: `%${post.search}%` })
          .orWhere('Product.code LIKE :searchTerm', { searchTerm: `%${post.search}%` });
      }
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.productRepository,
    });
  }

  /**
   * AI生成商品信息（名称、描述、关键字）
   * @param id 商品id
   * @param prompt 可选，用户自定义提示词
   */
  async aiGenerateInfo(id: string, prompt?: string) {
    const product = await this.productRepository.findOne({ id });
    if (!product) throw new Error('未找到商品');
    const images = product.images || [];
    if (!images.length) throw new Error('商品无图片');
    let imageUrl = images[0];
    // 移除SVG相关逻辑，直接处理图片
    let finalPrompt = '';
    if (prompt) {
      finalPrompt = `${prompt}\n请以如下 JSON 格式返回：{name:'商品名称', description:'商品描述', keywords:'商品关键字'}。只返回 JSON，不要其他解释，也不要用\`\`\`json或\`\`\`包裹。`;
    } else {
      finalPrompt = "请分析这张商品图片内容，并以如下 JSON 格式返回：{name:'商品名称', description:'商品描述', keywords:'商品关键字'}。只返回 JSON，不要其他解释，也不要用```json或```包裹。";
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
    // 更新商品信息
    product.name = info.name || product.name;
    product.description = info.description || product.description;
    product.keywords = info.keywords || product.keywords;
    await this.productRepository.save(product);
    return {
      name: product.name,
      description: product.description,
      keywords: product.keywords,
      raw: text
    };
  }
} 