import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dream } from './entities/dream.entity';
import { BasicService } from 'src/common/basicService';

@Injectable()
export class DreamService extends BasicService {
  constructor(
    @InjectRepository(Dream)
    private dreamRepository: Repository<Dream>,
  ) {
    super();
  }

  findAll() {
    return `This action returns all enword`;
  }

  async findOne(id: number) {
    const dream = await this.dreamRepository.findOne({ where: { id } });
    return dream || {}; // 返回找到的记录，或者返回 null
  }

  update(id: number, updateEnwordDto) {
    return `This action updates a #${id} enword`;
  }

  remove(id: number) {
    return `This action removes a #${id} enword`;
  }

  async getPage(post) {
    const where = null;
    const queryBuilderName = 'Dream';

    function queryBuilderHook(qb) { }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.dreamRepository,
    });
  }
}
