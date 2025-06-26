import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { SentenceService } from './sentence.service';

@Controller('sentences')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  @Post()
  create(@Body() createSentenceDto) {
    return this.sentenceService.create(createSentenceDto.content, createSentenceDto.description);
  }

  @Get()
  findAll(@Query() query) {
    const { currentPage = 1, pageSize = 20 } = query;
    return this.sentenceService.findAll(+currentPage, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sentenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSentenceDto) {
    return this.sentenceService.update(+id, updateSentenceDto.content, updateSentenceDto.description);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentenceService.remove(+id);
  }

} 