import { Module } from '@nestjs/common'
import { DayrecordService } from './dayrecord.service'
import { DayrecordController } from './dayrecord.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Dayrecord } from './entities/dayrecord.entity'
import { User } from 'src/user/entities/user.entity'
import { HeightController } from './mixins/height/height.controller'
import { HeightService } from './mixins/height/height.service'
import { CommonQueueService } from 'src/common/queue/common.service'
import { QueueModule } from 'src/common/queue/queue.module'
import { RecordSentenceService } from 'src/record_sentence/record_sentence.service'
import { RecordSentenceModule } from 'src/record_sentence/record_sentence.module'

@Module({
  imports: [TypeOrmModule.forFeature([Dayrecord, User]),QueueModule,RecordSentenceModule],
  controllers: [DayrecordController,],
  providers: [DayrecordService],
  exports: [DayrecordService],
})
export class DayrecordModule {}
