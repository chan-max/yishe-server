import { Injectable, } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository, } from '@nestjs/typeorm';
import {File} from './entities/file.entity'
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { BasicService } from 'src/common/basicService';


@Injectable()
export class FileService extends BasicService {

  constructor(
    @InjectRepository(File)
    private fileRepository,
  ) {
    super()
  }

  async create(post) {
    return await this.fileRepository.save(post)
  }

  findAll() {
    return `This action returns all productModel`;
  }

  async findOne(post) {
    return await this.fileRepository.findOne(post)
  }

  update(id: number,post) {
    return `This action updates a #${id} productModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} productModel`;
  }

  // async getPage({
  //   post
  // }) {
  //   const page = (post.currentPage - 1) * post.pageSize;
  //   const limit = page + post.pageSize;
  //   const pagination = new Pagination(
  //     { current: post.currentPage, size: post.pageSize },
  //   );
  //   const db = this.fileRepository.createQueryBuilder()
  //     .skip(page)
  //     .take(limit)
  //     .where(createQueryCondition(post, []))
  //     .orderBy('create_time', 'DESC');

  //   const result = pagination.findByPage(db);
  //   return result;
  // }

  async getPage({
    post,
    where
  }:any) {

    if(post.type){
      where = post.type.split(',').map((t) => {
        return {
          type:t
        }
      })
    }

    return await this.getPageFn({
      post,
      where,
      repo:this.fileRepository
    })
  }
}
