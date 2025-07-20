import { Module } from '@nestjs/common';
import { StickerService } from './sticker.service';
import { StickerController } from './sticker.controller';
import { Sticker } from './entities/sticker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sticker]), CommonModule, AiModule],
  controllers: [StickerController],
  providers: [StickerService],
  exports: [StickerService]
})
export class StickerModule {}
