import { Injectable, } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository, } from '@nestjs/typeorm';
import { File } from './entities/file.entity'
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

  update(id: number, post) {
    return `This action updates a #${id} productModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} productModel`;
  }

  async getPage({
    post,
    userInfo
  }: any) {

    const where = null
    const queryBuilderName = 'File'

    function queryBuilderHook(qb) {
      qb
        .leftJoinAndSelect('File.uploader', 'user')
        .select([
          "File.id",
          "File.name",
          "File.createTime",
          "File.thumbnail",
          "File.description",
          "File.isPublic",
          "File.keywords",
          "File.meta",
          "File.url",
          "File.type",
          "user.name",
          "user.account",
          "user.email",
          "user.email",
        ])
        .orderBy('File.createTime', 'DESC')

      if (post.myUploads) {
        qb.where('File.uploaderId = :uploaderId', { uploaderId: userInfo.id })
      }

      if (post.type) {
        qb.andWhere('File.type IN (:...types)', { types: post.type.split(',') })
      }
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.fileRepository
    })
  }
}
