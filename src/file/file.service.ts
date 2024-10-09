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

  async update(post) {

    const item = await this.fileRepository.findOne(post.id);

    Object.assign(item, post);

    return this.fileRepository.save(item);

    // return await this.stickerRepository.update(post.id, post);
  }


  async remove(id) {
    return this.fileRepository.delete(id)
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
          "File.updateTime",
          "File.thumbnail",
          "File.description",
          "File.isPublic",
          "File.keywords",
          "File.meta",
          "File.url",
          "File.type",
          "File.size",
          "user.name",
          "user.account",
          "user.email",
          "user.email",
          "user.isAdmin",
        ])
        .orderBy('File.createTime', 'DESC')

      if (post.myUploads) {
        qb.where('File.uploaderId = :uploaderId', { uploaderId: userInfo.id })
      }

      if (post.type) {
        qb.andWhere('File.type IN (:...types)', { types: post.type.split(',') })
      }

      // 通过 match 模糊匹配
      if (post.match) {
        qb.where('File.name LIKE :types', { types: `%${post.match}%` })
        // qb.orWhere('File.description LIKE :types', { types: post.match })
      }

      // 模糊查询
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
