/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-25 09:01:10
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-25 09:04:20
 * @FilePath: /design-server/src/font-template/font-template.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FontTemplateService } from './font-template.service';
import { CreateFontTemplateDto } from './dto/create-font-template.dto';

@Controller('font-template')
export class FontTemplateController {
  constructor(private readonly fontTemplateService: FontTemplateService) {}

  @Post()
  async create(@Body() createFontTemplateDto: CreateFontTemplateDto) {
    return await this.fontTemplateService.create(createFontTemplateDto);
  }

  @Get()
  async findAll(@Query('query') query?: string) {
    if (query) {
      return await this.fontTemplateService.searchFonts(query);
    }
    return await this.fontTemplateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.fontTemplateService.findOne(+id);
  }

  @Get('family/:fontFamily')
  async findByFontFamily(@Param('fontFamily') fontFamily: string) {
    return await this.fontTemplateService.findByFontFamily(fontFamily);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFontTemplateDto: Partial<CreateFontTemplateDto>,
  ) {
    return await this.fontTemplateService.update(+id, updateFontTemplateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.fontTemplateService.remove(+id);
  }
} 