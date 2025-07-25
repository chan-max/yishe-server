/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:12:19
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-02 20:12:33
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
import { EncryptService } from 'src/utils/encrypt.service';
import { CompanyModule } from './company/company.module';
import { SentenceModule } from './sentence/sentence.module';
import { ProductModule } from './product/product.module';
import { CustomModelModule } from './custom_model/custom_model.module';
import { CommentModule } from './comment/comment.module';
import { ProductModelModule } from './product_model/product_model.module';
import { DraftModule } from './draft/draft.module';
import { DesignRequestModule } from './design-request/design-request.module';
import { FeishuService } from './common/feishu.service';
import { AiModule } from './ai/ai.module';
import { CrawlerModule } from './crawler/crawler.module';
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
    CompanyModule,
    SentenceModule,
    ProductModule,
    CustomModelModule,
    CommentModule,
    ProductModelModule,
    DraftModule,
    DesignRequestModule,
    AiModule,
    CrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeyService, EncryptService, FeishuService],
})
export class AppModule {}
