// src/ai/ai.controller.ts
import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}


  /**
   * 根据用户输入的提示生成文章
   * @param prompt 用户输入的提示
   * @returns 生成的文章
   */
  @Get('getArticleByPrompt')
  async getArticleByPrompt(@Query('prompt') prompt: string) {
    if (!prompt) {
      throw new BadRequestException({ code: 400, message: '缺少 prompt 参数' });
    }
    return this.aiService.getArticleByPrompt(prompt);
  }

  /**
   * 将用户输入的记录转换为数据结构
   * @param prompt 用户输入的提示
   * @returns 转换后的数据结构
   */
  @Get('record-to-struct')
  async recordToStruct(@Query('prompt') prompt: string) {
    if (!prompt) {
      throw new BadRequestException({ code: 400, message: '缺少 prompt 参数' });
    }
    return this.aiService.recordToStruct(prompt);
  }
}