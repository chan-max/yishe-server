import { Injectable } from '@nestjs/common';
import { CreateEnwordDto } from './dto/create-enword.dto';
import { UpdateEnwordDto } from './dto/update-enword.dto';

import { EnWords } from './entities/enword.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicService } from 'src/common/basicService';


@Injectable()
export class EnWordsService extends BasicService {

  constructor(
    @InjectRepository(EnWords)
    private enwordRepository,
  ) {
    super()
  }
  create(createEnwordDto: CreateEnwordDto) {
    return 'This action adds a new enword';
  }

  findAll() {
    return `This action returns all enword`;
  }

  findOne(id: number) {
    return this.enwordRepository.findOne(id);
  }

  update(id: number, updateEnwordDto: UpdateEnwordDto) {
    return `This action updates a #${id} enword`;
  }

  remove(id: number) {
    return `This action removes a #${id} enword`;
  }


  async getPage(post) {

    const where = null
    const queryBuilderName = 'EnWords'

    function queryBuilderHook(qb) {
      qb.orderBy('EnWords.word', 'ASC')
      // 模糊查询
    }


    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.enwordRepository
    })
  }
}
