import { Injectable } from '@nestjs/common';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { InjectRepository, } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';

@Injectable()
export class StickerService {

  constructor(
    @InjectRepository(Sticker)
    private stickerRepository,
  ) {}

  create(createStickerDto: CreateStickerDto) {
    return 'This action adds a new sticker';
  }


  findAll() {
    return `This action returns all sticker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sticker`;
  }

  update(id: number, updateStickerDto: UpdateStickerDto) {
    return `This action updates a #${id} sticker`;
  }

  remove(id: number) {
    return `This action removes a #${id} sticker`;
  }

  async getPage(query) {
    const page = (query.currentPage - 1) * query.pageSize;
    const limit = page + query.pageSize;
    const pagination = new Pagination(
      { current: query.currentPage, size: query.pageSize },
      File,
    );
    const db = this.stickerRepository.createQueryBuilder('role')
      .skip(page)
      .take(limit)
      .where(createQueryCondition(query, ['name']))
      .orderBy('create_time', 'DESC');

    const result = await pagination.findByPage(db);
    
    return result;
  }
}
