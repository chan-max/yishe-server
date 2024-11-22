import { Module } from '@nestjs/common';
import { EnWordsService } from './enword.service';
import { EnWordsController } from './enword.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnWords } from './entities/enword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnWords])],
  controllers: [EnWordsController],
  providers: [EnWordsService]
})
export class EnwordModule { }
