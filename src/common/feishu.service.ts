/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-15 21:13:17
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-15 21:24:06
 * @FilePath: /design-server/src/common/feishu.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import envConfig from '../../config';

@Injectable()
export class FeishuService {
  private readonly webhookUrls: { [key: string]: string };

  constructor() {
    // 从配置文件获取 webhook URL
    this.webhookUrls = {
      design: envConfig.FEISHU.DESIGN,
      system: envConfig.FEISHU.SYSTEM,
    };
  }

  async sendMessage(content: string, botType: string = 'system') {
    const webhookUrl = this.webhookUrls[botType];
    if (!webhookUrl) {
      throw new Error(`未找到类型为 ${botType} 的飞书机器人配置`);
    }

    try {
      const response = await axios.post(webhookUrl, {
        msg_type: 'text',
        content: {
          text: content
        }
      });
      return response.data;
    } catch (error) {
      console.error(`发送飞书消息失败 (${botType}):`, error);
      throw error;
    }
  }

  // 可以添加更多特定类型的通知方法
  async sendSystemNotification(content: string) {
    return this.sendMessage(content, 'system');
  }
} 