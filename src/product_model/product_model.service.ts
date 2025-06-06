import { Injectable } from '@nestjs/common';
import { CreateProductModelDto } from './dto/create-product_model.dto';
import { UpdateProductModelDto } from './dto/update-product_model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from './entities/product_model.entity';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { CosService } from 'src/common/cos.service';

@Injectable()
export class ProductModelService {

  constructor(
    @InjectRepository(ProductModel)
    private productModelRepository,
    private cosService: CosService,
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
}
