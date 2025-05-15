import { Module, Global, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CommonQueueService } from './common.service';
import {  CommonProcessor, } from './common.processor';

import config from 'config'
import { AiModule } from 'src/ai/ai.module';
import { UserModule } from 'src/user/user.module';
@Global() // 👈 让这个模块变成全局模块，所有地方都能用
@Module({
    imports: [
      BullModule.forRoot({
        redis: {
          host: config.REDIS.host,
          port: 6379,
          password: config.REDIS.password,
        },
      }),
      BullModule.registerQueue({ name: 'commonQueue' }),
      BullModule.registerQueue({ name: 'taskQueue' }), 
      BullModule.registerQueue({ name: 'aiQueue' }), 
      AiModule,
      UserModule,
    ],
    providers: [CommonQueueService, CommonProcessor,], // 注册处理器
    exports: [CommonQueueService],
  })



  export class QueueModule {}
  
