import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dream } from './entities/dream.entity';
import { DreamService } from './dream.service';
import { DreamController } from './dream.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dream])], // 注册实体
  controllers: [DreamController],
  providers: [DreamService],
})
export class DreamModule { }
