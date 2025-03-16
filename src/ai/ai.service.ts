// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { KeyValueService } from '../keyvalue/keyvalue.service'; // 导入 KeyValueService
import { chatWithDeepSeek } from './request/deepseek';
import { createPromptGetSimilarRecordwords, PROMPT_RECORD_TO_STRUCT } from './prompt/record';
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
      responseFormat:'json_object'
    })

    let res = toSafeJSON(result.choices[0].message.content);

    // 缓存结果，设置过期时间为 1 小时（3600 秒）
    await this.keyValueService.setItem(namespace, prompt, res);

    return res;
  }


  /**
   * @api 根据一个词获取相关的推荐词
  */
  async getSimilarRecordWords(prompt,count){


      return  [
        { sentence: "累了", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "很开心", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "我感到很困", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "今天心情不错，天气也不错", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "忙碌的一天", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "累了", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "很开心", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "我感到很困", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "今天心情不错，天气也不错", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "忙碌的一天", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "累了", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "很开心", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "我感到很困", fontSize: 12.0 + Math.random() * 8.0 - 8 },
        { sentence: "今天心情不错，天气也不错", fontSize: 20.0+ Math.random() * 12.0 - 12 },
        { sentence: "忙碌的一天", fontSize: 20.0+ Math.random() * 12.0 - 12 },
      ];

    const namespace = 'similarRecordWords'; // 使用 recordToStruct 作为 namespace
    const cachedData = await this.keyValueService.getItem(namespace, prompt);

    if (cachedData) {
      return cachedData; // 返回缓存数据
    }

    const result = await chatWithDeepSeek({
      system: createPromptGetSimilarRecordwords(5),
      user:prompt || '',
    })
    let res = toSafeJSON(result.choices[0].message.content);

    // 缓存结果，设置过期时间为 1 小时（3600 秒）
    await this.keyValueService.setItem(namespace, prompt, res);

    return res;
  }

}