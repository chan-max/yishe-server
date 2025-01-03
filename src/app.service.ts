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
        // SecretId: 'AKIDMdmaMD0uiNwkVH0gTJFKXaXJyV4hHmAL',
        // SecretKey: 'HPdigqyzpgTNICCQnK0ZF6zrrpkbL4un',
        // Bucket: '1s-1257307499',
        // Region: 'ap-beijing'
      },
      publicKey: this.keyService.getPublicKey()
    }
  }
}
