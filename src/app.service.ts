/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:12:19
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-26 05:56:49
 * @FilePath: /design-server/src/app.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { KeyService } from './utils/key.service';
import { EncryptService } from './utils/encrypt.service';
import config from '../config';

@Injectable()
export class AppService {
  constructor(
    private readonly keyService: KeyService,
    private readonly encryptService: EncryptService
  ) { }
  
  getHello(): string {
    return 'Hello World!';
  }

  getBasicConfig() {
    console.log('原始COS配置:', config.COS)
    
    // 测试单个字段加密
    const testSecretId = config.COS.SecretId
    console.log('测试加密 SecretId:', testSecretId)
    const encryptedSecretId = this.encryptService.encrypt(testSecretId)
    console.log('加密后的 SecretId:', encryptedSecretId)
    const decryptedSecretId = this.encryptService.decrypt(encryptedSecretId)
    console.log('解密后的 SecretId:', decryptedSecretId)
    
    // 对敏感信息进行加密
    const encryptedCos = this.encryptService.encryptObject(config.COS);
    
    console.log('加密后的COS配置:', encryptedCos)
    
    return {
      cos: encryptedCos,
      publicKey: this.keyService.getPublicKey()
    }
  }
}
