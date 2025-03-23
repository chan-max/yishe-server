import { Module } from '@nestjs/common';
import { RecordSentenceService } from './record_sentence.service';
import { RecordSentenceController } from './record_sentence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordSentence } from './entities/record_sentence.entity';

@Module({

  imports: [TypeOrmModule.forFeature([RecordSentence])],
  controllers: [RecordSentenceController],
  providers: [RecordSentenceService],
  exports:[RecordSentenceService]

})
export class RecordSentenceModule {}
