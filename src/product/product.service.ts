/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 12:42:39
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-17 22:42:58
 * @FilePath: /design-server/src/product/product.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { BasicService } from 'src/common/basicService';
import { In } from 'typeorm';
import { CosService } from '../common/cos.service';

@Injectable()
export class ProductService extends BasicService {
  constructor(
    @InjectRepository(Product)
    private productRepository,
    private cosService: CosService,
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

    // 只更新允许的字段
    const allowedFields = [
      'code',
      'name',
      'description',
      'type',
      'images',
      'price',
      'salePrice',
      'stock',
      'specifications',
      'tags',
      'isActive',
      'isPublish',
      'isLimitedEdition'
    ];

    // 只复制允许的字段
    allowedFields.forEach(field => {
      if (post[field] !== undefined) {
        item[field] = post[field];
      }
    });

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
    // 收集所有图片 URL
    const allImages = products
      .map(product => Array.isArray(product.images) ? product.images : [])
      .flat();
    // 删除 COS 文件
    if (allImages.length > 0) {
      try {
        await Promise.all(
          allImages.map(url => this.cosService.deleteFile(url))
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
          'Product.price',
          'Product.salePrice',
          'Product.stock',
          'Product.specifications',
          'Product.tags',
          'Product.isActive',
          'Product.isPublish',
          'Product.isLimitedEdition',
          'Product.createTime',
          'Product.updateTime',
        ])
        .orderBy('Product.createTime', 'DESC');

      if (post.type) {
        qb.andWhere('Product.type = :type', { type: post.type });
      }

      if (post.isPublish !== undefined) {
        qb.andWhere('Product.isPublish = :isPublish', { isPublish: post.isPublish });
      }

      if (post.search) {
        qb.where('Product.name LIKE :searchTerm', { searchTerm: `%${post.search}%` })
          .orWhere('Product.description LIKE :searchTerm', { searchTerm: `%${post.search}%` })
          .orWhere('Product.tags LIKE :searchTerm', { searchTerm: `%${post.search}%` })
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
} 