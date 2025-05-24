import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsdTemplate } from './entities/psd-template.entity';
import { PsdTemplateService } from './psd-template.service';
import { PsdTemplateController } from './psd-template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PsdTemplate])],
  controllers: [PsdTemplateController],
  providers: [PsdTemplateService],
  exports: [PsdTemplateService],
})
export class PsdTemplateModule {} 