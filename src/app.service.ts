/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:12:19
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-24 18:24:40
 * @FilePath: /design-server/src/app.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { KeyService } from './utils/key.service';

@Injectable()
export class AppService {
  constructor(private readonly keyService: KeyService) { }
  getHello(): string {
    return 'Hello World!';
  }

  getBasicConfig() {
    return {
      cos: {
        SecretId: 'AKIDMdmaMD0uiNwkVH0gTJFKXaXJyV4hHmAL',
        SecretKey: 'HPdigqyzpgTNICCQnK0ZF6zrrpkbL4un',
        Bucket: '1s-1257307499',
        Region: 'ap-beijing'
      },
      publicKey:this.keyService.getPublicKey()
    }
  }
}
