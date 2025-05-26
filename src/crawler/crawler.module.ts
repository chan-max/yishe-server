import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { ExampleCrawlerTask } from './tasks/example.task';

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService, ExampleCrawlerTask],
  exports: [CrawlerService],
})
export class CrawlerModule {} 