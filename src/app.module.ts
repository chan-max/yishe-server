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

// 环境配置信息
import envConfig from '../config';

@Module({
  imports: [
    TypeOrmModule.forRoot(envConfig.DATABASE_CONFIG as any),
    UserModule,
    AuthModule,
    DayrecordModule,
    FoodModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeyService],
})
export class AppModule { }
