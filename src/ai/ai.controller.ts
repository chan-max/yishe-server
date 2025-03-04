import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { chatWithDeepSeek } from './request/deepseek';
import { RedisInstance } from 'src/cache/redis';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }


  /**
   * @define 根据用户输入的记录生成对应的数据结构
   * */
  @Get('getRecordStruct')
  async getRecordStruct(@Req() req,@Query('prompt') prompt: string) {
    if(!prompt){
      throw new BadRequestException({ code: 400, message: '缺少 prompt 参数'});
    }
    return this.aiService.getRecordStruct(prompt)
  }
}
