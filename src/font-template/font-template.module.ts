import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FontTemplate } from './entities/font-template.entity';
import { FontTemplateService } from './font-template.service';
import { FontTemplateController } from './font-template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FontTemplate])],
  controllers: [FontTemplateController],
  providers: [FontTemplateService],
  exports: [FontTemplateService],
})
export class FontTemplateModule {} 