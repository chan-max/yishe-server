import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { EnWordsService } from './enword.service';
import { EnWords } from './entities/enword.entity';
import { BasicService } from 'src/common/basicService';

@Controller('en-words')
export class EnWordsController extends BasicService {
  constructor(private readonly enWordsService: EnWordsService) {
    super()
  }

  // 获取所有单词，支持分页


  // 根据主键获取单个单词
  @Get(':word') // 添加路径参数占位符
  async getWordById(@Param('word') word: any) {
    return this.enWordsService.findOne(word);
  }

  @Post('page')
  async getPage(@Body() post,) {
    return this.enWordsService.getPage(post);
  }

}
