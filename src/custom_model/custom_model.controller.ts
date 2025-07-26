import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { CustomModelService } from './custom_model.service';
import { OptionalAuthGuard } from 'src/common/authGuard'
import {
  ApiBearerAuth, 
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('custom-model')
export class CustomModelController {
  constructor(private readonly customModelService: CustomModelService) { }

  @Post('create')
  create(@Body() post) {
    return this.customModelService.create(post);
  }

  @Post('page')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  getPage(@Body() params, @Request() req) {
    return this.customModelService.getPage(params, req.user);
  }



  @Post('')
  find(@Body() body) {
    return this.customModelService.findOne(body.id);
  }


  @Post('update')
  update(@Body() post) {
    return this.customModelService.update(post);
  }

  @Post('delete')
  remove(@Body() body: { ids: string | string[] }) {
    return this.customModelService.remove(body.ids);
  }

  @Post('ai-generate-info')
  async aiGenerateInfo(@Body() body) {
    const { id, prompt } = body;
    return await this.customModelService.aiGenerateInfo(id, prompt);
  }

  @Post('to-product')
  @ApiOperation({ summary: '将设计模型转为产品' })
  async toProduct(@Body() body) {
    const { id } = body;
    return await this.customModelService.customModelToProduct(id);
  }

  @Get('batch-generate-phash')
  @ApiOperation({ summary: '批量生成缩略图感知哈希' })
  @ApiQuery({ name: 'batchSize', required: false, description: '批次大小', type: Number })
  async batchGeneratePhash(@Query('batchSize') batchSize?: number) {
    const size = batchSize || 100;
    return await this.customModelService.batchGeneratePhashForAllCustomModels(size);
  }
}