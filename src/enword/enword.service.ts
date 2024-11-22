import { Injectable } from '@nestjs/common';
import { CreateEnwordDto } from './dto/create-enword.dto';
import { UpdateEnwordDto } from './dto/update-enword.dto';

import { EnWords } from './entities/enword.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class EnWordsService {

  constructor(
    @InjectRepository(EnWords)
    private enwordRepository,
  ) {
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
}
