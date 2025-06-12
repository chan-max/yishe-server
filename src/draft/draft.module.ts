import { Module } from '@nestjs/common';
import { DraftService } from './draft.service';
import { DraftController } from './draft.controller';
import { Draft } from './entities/draft.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CosService } from 'src/common/cos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Draft])],
  controllers: [DraftController],
  providers: [DraftService, CosService]
})
export class DraftModule {} 