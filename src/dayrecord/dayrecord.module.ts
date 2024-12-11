import { Module } from '@nestjs/common';
import { DayrecordService } from './dayrecord.service';
import { DayrecordController } from './dayrecord.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dayrecord } from './entities/dayrecord.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dayrecord,User]),],
  controllers: [DayrecordController],
  providers: [DayrecordService]
})
export class DayrecordModule { }
