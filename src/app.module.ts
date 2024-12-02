import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { KeyService } from 'src/utils/key.service';
import { DreamModule } from './dream/dream.module';


// 环境配置信息
import envConfig from '../config';

@Module({
  imports: [
    TypeOrmModule.forRoot(envConfig.DATABASE_CONFIG),
    UserModule,
    AuthModule,
    DreamModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeyService],
})
export class AppModule { }
