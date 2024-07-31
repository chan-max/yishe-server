import { Injectable } from '@nestjs/common';
import { CreateProductModelDto } from './dto/create-product_model.dto';
import { UpdateProductModelDto } from './dto/update-product_model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from './entities/product_model.entity';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
@Injectable()
export class ProductModelService {

  constructor(
    @InjectRepository(ProductModel)
    private productModelRepository,
  ) { }

  async create(createProductModelDto: CreateProductModelDto) {
    return await this.productModelRepository.save(createProductModelDto)
  }

  findAll() {
    return `This action returns all productModel`;
  }

  async findOne(id: number) {
    return await this.productModelRepository.findOne({ id });
  }

  update(id: number, data) {
    return this.productModelRepository.update(id, data)
  }

  async remove(ids: number) {
    return await this.productModelRepository.delete(ids);
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
}
