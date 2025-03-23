import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { KeyService } from 'src/utils/key.service';
import { DayrecordModule } from './dayrecord/dayrecord.module';
import { FoodModule } from './food/food.module';
import { AiModule } from './ai/ai.module';
import { KeyValueModule } from './keyvalue/keyvalue.module';
import { ScheduleModule } from '@nestjs/schedule';

// 环境配置信息
import envConfig from '../config';
import { QueueModule } from './common/queue/queue.module';
import { TaskService } from './schedule/schedule.service';
import { SseController } from './sse/sse.controller';
import { SseService } from './sse/sse.service';
import { EventsGateway } from './websocket/app.gateway';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { RecordSentenceModule } from './record_sentence/record_sentence.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(envConfig.DATABASE_CONFIG as any),
    UserModule,
    AuthModule,
    DayrecordModule,
    FoodModule,
    AiModule,
    KeyValueModule,
    QueueModule,
    ScheduleModule.forRoot(),
    RecordSentenceModule
  ],
  controllers: [AppController],
  providers: [AppService, KeyService,TaskService,EventsGateway],
})




export class AppModule { }
