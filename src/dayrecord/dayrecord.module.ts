import { Module } from '@nestjs/common'
import { DayrecordService } from './dayrecord.service'
import { DayrecordController } from './dayrecord.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Dayrecord } from './entities/dayrecord.entity'
import { User } from 'src/user/entities/user.entity'
import { HeightController } from './mixins/height/height.controller'
import { HeightService } from './mixins/height/height.service'

@Module({
  imports: [TypeOrmModule.forFeature([Dayrecord, User])],
  controllers: [DayrecordController, HeightController],
  providers: [DayrecordService,HeightService],
})
export class DayrecordModule {}
