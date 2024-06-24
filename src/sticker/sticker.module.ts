import { Module } from '@nestjs/common';
import { StickerService } from './sticker.service';
import { StickerController } from './sticker.controller';
import { Sticker } from './entities/sticker.entity';
import {TypeOrmModule} from '@nestjs/typeorm'


@Module({
  imports: [TypeOrmModule.forFeature([Sticker])],
  controllers: [StickerController],
  providers: [StickerService]
})
export class StickerModule {}
