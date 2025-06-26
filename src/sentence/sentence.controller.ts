import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SentenceService } from './sentence.service';

@Controller('sentences')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  @Post()
  create(@Body() createSentenceDto) {
    return this.sentenceService.create(createSentenceDto);
  }

  @Get()
  findAll() {
    return this.sentenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sentenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSentenceDto) {
    return this.sentenceService.update(+id, updateSentenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentenceService.remove(+id);
  }

} 