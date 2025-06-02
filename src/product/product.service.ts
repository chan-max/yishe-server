/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 12:42:39
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-02 12:36:19
 * @FilePath: /design-server/src/product/product.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { BasicService } from 'src/common/basicService';

@Injectable()
export class ProductService extends BasicService {
  constructor(
    @InjectRepository(Product)
    private productRepository,
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
    Object.assign(item, post);
    return this.productRepository.save(item);
  }

  async remove(id: string) {
    return this.productRepository.delete(id);
  }

  async getPage(post) {
    const where = null;
    const queryBuilderName = 'Product';

    function queryBuilderHook(qb) {
      qb
        .select([
          'Product.id',
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
          'Product.createTime',
          'Product.updateTime',
        ])
        .orderBy('Product.createTime', 'DESC');

      if (post.type) {
        qb.andWhere('Product.type = :type', { type: post.type });
      }

      if (post.search) {
        qb.where('Product.name LIKE :searchTerm', { searchTerm: `%${post.search}%` })
          .orWhere('Product.description LIKE :searchTerm', { searchTerm: `%${post.search}%` })
          .orWhere('Product.tags LIKE :searchTerm', { searchTerm: `%${post.search}%` });
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