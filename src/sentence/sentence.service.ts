import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sentence } from './entities/sentence.entity';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';

@Injectable()
export class SentenceService {
  constructor(
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
  ) {}

  create(createSentenceDto: CreateSentenceDto) {
    const sentence = this.sentenceRepository.create(createSentenceDto);
    return this.sentenceRepository.save(sentence);
  }

  findAll() {
    return this.sentenceRepository.find();
  }

  findOne(id: number) {
    return this.sentenceRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSentenceDto: UpdateSentenceDto) {
    await this.sentenceRepository.update(id, updateSentenceDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const sentence = await this.findOne(id);
    return this.sentenceRepository.remove(sentence);
  }

  async toggleFavorite(id: number) {
    const sentence = await this.findOne(id);
    sentence.isFavorite = !sentence.isFavorite;
    return this.sentenceRepository.save(sentence);
  }
} 