/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 06:51:48
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-26 05:47:46
 * @FilePath: /design-server/src/crawler/crawler.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  /**
   * 开始爬取指定网站
   * @param url 目标网站URL
   * @param depth 爬取深度
   */
  @Post('start')
  async startCrawling(
    @Body('url') url: string,
    @Body('depth') depth: number = 1,
  ) {
    return this.crawlerService.startCrawling(url, depth);
  }

  /**
   * 获取爬虫任务状态
   * @param taskId 任务ID
   */
  @Get('status/:taskId')
  async getTaskStatus(@Param('taskId') taskId: string) {
    return this.crawlerService.getTaskStatus(taskId);
  }

  /**
   * 停止爬虫任务
   * @param taskId 任务ID
   */
  @Post('stop/:taskId')
  async stopTask(@Param('taskId') taskId: string) {
    return this.crawlerService.stopTask(taskId);
  }

  /**
   * 获取爬取结果
   * @param taskId 任务ID
   * @param page 页码
   * @param pageSize 每页数量
   */
  @Get('results/:taskId')
  async getResults(
    @Param('taskId') taskId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.crawlerService.getResults(taskId, page, pageSize);
  }

  /**
   * 获取爬虫任务列表
   * @param status 任务状态过滤
   */
  @Get('tasks')
  async getTaskList(@Query('status') status?: string) {
    return this.crawlerService.getTaskList(status);
  }

  @Post('image')
  async crawlImage(@Body('url') url: string) {
    return this.crawlerService.crawlImage(url);
  }

  @Post('webpage')
  async crawlWebpage(@Body('url') url: string) {
    return this.crawlerService.crawlWebpage(url);
  }

  @Post('batch')
  async batchCrawl(@Body('urls') urls: string[]) {
    return this.crawlerService.batchCrawl(urls);
  }
} 