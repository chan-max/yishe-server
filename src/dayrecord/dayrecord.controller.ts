import { Controller, Post, Param, UseGuards, Req, Body } from '@nestjs/common';
import { DayrecordService } from './dayrecord.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dayrecord')
export class DayrecordController {
  constructor(private readonly dayrecordService: DayrecordService) { }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createTodayRecord(@Req() req,) {
    return await this.dayrecordService.createTodayRecord(req.user.id);
  }
}
