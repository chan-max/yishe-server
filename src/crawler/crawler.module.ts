import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { ExampleCrawlerTask } from './tasks/example.task';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerMaterial } from './entities/crawler-material.entity';
import { CommonModule } from '../common/common.module';
import { StickerModule } from '../sticker/sticker.module';

@Module({
  imports: [TypeOrmModule.forFeature([CrawlerMaterial]), CommonModule, StickerModule],
  controllers: [CrawlerController],
  providers: [CrawlerService, ExampleCrawlerTask],
  exports: [CrawlerService],
})
export class CrawlerModule {} 