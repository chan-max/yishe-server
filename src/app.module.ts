import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { StickerModule } from './sticker/sticker.module';
import { PsdTemplateModule } from './psd-template/psd-template.module';
import { KeyService } from 'src/utils/key.service';


// 环境配置信息
import envConfig from '../config';

@Module({
  imports: [
    TypeOrmModule.forRoot(envConfig.DATABASE_CONFIG),
    UserModule,
    AuthModule,
    FileModule,
    StickerModule,
    PsdTemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeyService],
})
export class AppModule {}
