import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: 'sk-4cbcacd9694740a68f19bb5c65ae42d6',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
  }

  async qwenChat(params: {
    model: string,
    messages: any[],
    [key: string]: any
  }) {
    const response = await this.openai.chat.completions.create({
      ...params
    });
    return response;
  }
} 