/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:12:19
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-25 09:18:06
 * @FilePath: /design-server/src/app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { StickerModule } from './sticker/sticker.module';
import { PsdTemplateModule } from './psd-template/psd-template.module';
import { FontTemplateModule } from './font-template/font-template.module';
import { KeyService } from 'src/utils/key.service';
import { SentenceModule } from './sentence/sentence.module';
import { ProductModule } from './product/product.module';

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
    FontTemplateModule,
    SentenceModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeyService],
})
export class AppModule {}
