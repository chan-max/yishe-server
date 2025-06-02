import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentenceService } from './sentence.service';
import { SentenceController } from './sentence.controller';
import { Sentence } from './entities/sentence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sentence])],
  controllers: [SentenceController],
  providers: [SentenceService],
  exports: [SentenceService],
})
export class SentenceModule {} 