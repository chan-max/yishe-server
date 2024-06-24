import { Injectable } from '@nestjs/common';
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
export class StickerService extends BasicService{

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
    return await this.stickerRepository.findOne({id});
  }

  async update(id: number, post: UpdateStickerDto) {
    return  await this.stickerRepository.update(id, post);
  }

  remove(id: number) {
    return `This action removes a #${id} sticker`;
  }

  async getPage(post) {
    const where = null
    const queryBuilderName = 'Sticker'

    function queryBuilderHook(qb){
      qb
      .leftJoinAndMapOne('Sticker.uploader',User, 'user', 'Sticker.uploader_id=user.id')
      .orderBy('Sticker.createTime', 'DESC')
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo:this.stickerRepository
    })
  }
}
