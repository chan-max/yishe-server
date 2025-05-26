import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FontTemplate } from './entities/font-template.entity';
import { FontTemplateService } from './font-template.service';
import { FontTemplateController } from './font-template.controller';
import { Sticker } from '../sticker/entities/sticker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FontTemplate, Sticker])],
  controllers: [FontTemplateController],
  providers: [FontTemplateService],
  exports: [FontTemplateService],
})
export class FontTemplateModule {} 