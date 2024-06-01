import { Injectable } from '@nestjs/common';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { InjectRepository, } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';
import { BasicService } from 'src/common/basicService';

@Injectable()
export class StickerService extends BasicService {

  constructor(
    @InjectRepository(Sticker)
    private stickerRepository,
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

  async getPage({
    post,
    where
  }:any) {
    return await this.getPageFn({
      post,
      where,
      repo:this.stickerRepository
    })
  }
}
