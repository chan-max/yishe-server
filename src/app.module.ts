import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { ProductModelModule } from './product_model/product_model.module';
import { StickerModule } from './sticker/sticker.module';
import { CustomModelModule } from './custom_model/custom_model.module';
import { CommentModule } from './comment/comment.module';
import { KeyService } from 'src/utils/key.service';
import { CompanyModule } from './company/company.module';
import { ResourceModule } from './resource/resource.module';

// 环境配置信息
import envConfig from '../config';

@Module({
  imports: [
    TypeOrmModule.forRoot(envConfig.DATABASE_CONFIG),
    UserModule,
    AuthModule,
    FileModule,
    ProductModelModule,
    StickerModule,
    CustomModelModule,
    CommentModule,
    CompanyModule,
    ResourceModule
  ],
  controllers: [AppController],
  providers: [AppService, KeyService],
})
export class AppModule {}
