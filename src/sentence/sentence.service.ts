import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sentence } from './entities/sentence.entity';

@Injectable()
export class SentenceService {
  constructor(
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
  ) {}

  create(content: string, description?: string) {
    const sentence = this.sentenceRepository.create({ content, description });
    return this.sentenceRepository.save(sentence);
  }

  async findAll(currentPage: number = 1, pageSize: number = 20) {
    const skip = (currentPage - 1) * pageSize;
    const [list, total] = await this.sentenceRepository.findAndCount({
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' }
    });
    
    return {
      list,
      total,
      currentPage,
      pageSize
    };
  }

  findOne(id: number) {
    return this.sentenceRepository.findOne({ where: { id } });
  }

  async update(id: number, content: string, description?: string) {
    await this.sentenceRepository.update(id, { content, description });
    return this.findOne(id);
  }

  async remove(id: number) {
    const sentence = await this.findOne(id);
    return this.sentenceRepository.remove(sentence);
  }
} 