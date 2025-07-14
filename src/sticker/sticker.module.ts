import { Module } from '@nestjs/common';
import { StickerService } from './sticker.service';
import { StickerController } from './sticker.controller';
import { Sticker } from './entities/sticker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CosService } from 'src/common/cos.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sticker]), AiModule],
  controllers: [StickerController],
  providers: [StickerService, CosService]
})
export class StickerModule {}
