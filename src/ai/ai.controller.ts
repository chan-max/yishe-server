import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('qwen-chat')
  async qwenChat(@Body() body: any) {
    // body: { model, messages, ... }
    return await this.aiService.qwenChat(body);
  }
} 