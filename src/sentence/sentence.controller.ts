import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { SentenceService } from './sentence.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageSentenceDto } from './dto/page-sentence.dto';

@ApiTags('句子管理')
@Controller('sentences')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  @Post()
  create(@Body() createSentenceDto) {
    return this.sentenceService.create(createSentenceDto.content, createSentenceDto.description);
  }

  @Post('page')
  getPage(@Body() query: PageSentenceDto) {
    return this.sentenceService.getPage(query);
  }

  @Post('ai-generate')
  @ApiOperation({ summary: 'AI生成句子' })
  async aiGenerate(@Body() body: { prompt: string }) {
    return this.sentenceService.aiGenerateSentence(body.prompt);
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