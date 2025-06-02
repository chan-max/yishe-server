import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SentenceService } from './sentence.service';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';

@Controller('sentences')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  @Post()
  create(@Body() createSentenceDto: CreateSentenceDto) {
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
  update(@Param('id') id: string, @Body() updateSentenceDto: UpdateSentenceDto) {
    return this.sentenceService.update(+id, updateSentenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentenceService.remove(+id);
  }

  @Put(':id/favorite')
  toggleFavorite(@Param('id') id: string) {
    return this.sentenceService.toggleFavorite(+id);
  }
} 