import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { InjectRepository, } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';
import { BasicService } from 'src/common/basicService';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StickerService extends BasicService {

  constructor(
    @InjectRepository(Sticker)
    private stickerRepository,
    // private jwtService: JwtService,
  ) {
    super()
  }

  /* 创建 */
  async create(post) {
    return await this.stickerRepository.save(post)
  }

  findAll() {
    return `This action returns all sticker`;
  }

  async findOne(id: number) {
    return await this.stickerRepository.findOne({ id });
  }

  async update(id: number, post: UpdateStickerDto) {
    return await this.stickerRepository.update(id, post);
  }

  async remove(id) {
    return this.stickerRepository.delete(id)
  }

  async getPage(post, userInfo) {

    if (post.myUploads && !userInfo) {
      throw new UnauthorizedException('请登录');
    }

    const where = null
    const queryBuilderName = 'Sticker'


    function queryBuilderHook(qb) {
      qb
        .leftJoinAndSelect('Sticker.uploader', 'user')
        .select([
          "Sticker.id",
          "Sticker.name",
          "Sticker.createTime",
          "Sticker.updateTime",
          "Sticker.thumbnail",
          "Sticker.description",
          "Sticker.isPublic",
          "Sticker.keywords",
          "Sticker.meta",
          "Sticker.type",

          "Sticker.url",
          "user.name",
          "user.account",
          "user.email",
          "user.email",
        ]).orderBy('Sticker.createTime', 'DESC')

      // if (post.type) {
      //   qb.where('Sticker.type IN (:...types)', { types: post.type.split(',') })
      // }

      if (post.myUploads) {
        qb.where('Sticker.uploaderId = :uploaderId', { uploaderId: userInfo.id })
      }

      if (post.type) {
        qb.andWhere('Sticker.type IN (:...types)', { types: post.type.split(',') })
      }

    }



    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.stickerRepository
    })
  }
}
