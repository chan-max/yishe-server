import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DreamService } from './dream.service';
import { Dream } from './entities/dream.entity';

@Controller('dream')
export class DreamController {
  constructor(private readonly dreamService: DreamService) { }



  @Get(':id') // 添加路径参数占位符
  async getDreamById(@Param('id') id: any) {
    return this.dreamService.findOne(id);
  }

  @Post('page')
  async getPage(@Body() post,) {
    return this.dreamService.getPage(post);
  }
}
