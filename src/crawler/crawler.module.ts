import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { ExampleCrawlerTask } from './tasks/example.task';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerMaterial } from './entities/crawler-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CrawlerMaterial])],
  controllers: [CrawlerController],
  providers: [CrawlerService, ExampleCrawlerTask],
  exports: [CrawlerService],
})
export class CrawlerModule {} 