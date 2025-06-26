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

  create(content: string) {
    const sentence = this.sentenceRepository.create({ content });
    return this.sentenceRepository.save(sentence);
  }

  findAll() {
    return this.sentenceRepository.find();
  }

  findOne(id: number) {
    return this.sentenceRepository.findOne({ where: { id } });
  }

  async update(id: number, content: string) {
    await this.sentenceRepository.update(id, { content });
    return this.findOne(id);
  }

  async remove(id: number) {
    const sentence = await this.findOne(id);
    return this.sentenceRepository.remove(sentence);
  }
} 