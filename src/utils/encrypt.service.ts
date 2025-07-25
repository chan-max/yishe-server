/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-07-26 06:00:00
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-26 06:00:00
 * @FilePath: /design-server/src/utils/encrypt.service.ts
 * @Description: 加密服务
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptService {
  private readonly secretKey = process.env.ENCRYPT_SECRET_KEY || 'your-secret-key-32-chars-long!';

  /**
   * 简单编码字符串 - 使用Base64
   */
  encrypt(text: string): string {
    // 简单的Base64编码，增加一层保护
    const encoded = Buffer.from(text).toString('base64');
    console.log('编码结果:', encoded)
    return encoded;
  }

  /**
   * 解码字符串 - 使用Base64
   */
  decrypt(encodedText: string): string {
    try {
      const decoded = Buffer.from(encodedText, 'base64').toString('utf8');
      console.log('解码结果:', decoded)
      return decoded;
    } catch (error) {
      console.error('解码失败:', error)
      return encodedText; // 如果解码失败，返回原值
    }
  }

  /**
   * 编码对象
   */
  encryptObject(obj: any): any {
    const encoded = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        encoded[key] = this.encrypt(value);
      } else {
        encoded[key] = value;
      }
    }
    return encoded;
  }

  /**
   * 解码对象
   */
  decryptObject(obj: any): any {
    const decoded = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        decoded[key] = this.decrypt(value);
      } else {
        decoded[key] = value;
      }
    }
    return decoded;
  }
} 