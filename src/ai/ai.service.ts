// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { KeyValueService } from '../keyvalue/keyvalue.service'; // 导入 KeyValueService
import { chatWithDeepSeek } from './request/deepseek';
import { PROMPT_RECORD_TO_STRUCT } from './prompt/record';
import { toSafeJSON } from 'src/utils/common';

@Injectable()
export class AiService {
  constructor(private readonly keyValueService: KeyValueService) {}

  /**
   * 根据用户输入的提示生成文章
   * @param prompt 用户输入的提示
   * @returns 生成的文章
   */
  async getArticleByPrompt(prompt: string): Promise<any> {
    const namespace = 'getArticleByPrompt'; // 使用 getArticleByPrompt 作为 namespace
    const cachedData = await this.keyValueService.getItem(namespace, prompt);

    if (cachedData) {
      return cachedData; // 返回缓存数据
    }

    // 模拟 AI 服务的调用
    const result = { data: `Article for prompt: ${prompt}` };

    // 缓存结果，设置过期时间为 1 小时（3600 秒）
    await this.keyValueService.setItem(namespace, prompt, result);

    return result;
  }

  /**
   * 将用户输入的记录转换为数据结构
   * @param prompt 用户输入的提示
   * @returns 转换后的数据结构
   */
  async recordToStruct(prompt: string): Promise<any> {
    const namespace = 'recordToStruct'; // 使用 recordToStruct 作为 namespace
    const cachedData = await this.keyValueService.getItem(namespace, prompt);

    if (cachedData) {
      return cachedData; // 返回缓存数据
    }

    // 模拟 AI 服务的调用
    const result = await chatWithDeepSeek({
      system:PROMPT_RECORD_TO_STRUCT,
      user:prompt,
    })

    let res = toSafeJSON(result.choices[0].message.content)

    // 缓存结果，设置过期时间为 1 小时（3600 秒）
    await this.keyValueService.setItem(namespace, prompt, res);

    return res;
  }
}