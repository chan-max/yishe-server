import { Controller, Post, Param, UseGuards, Req, Body, Get } from '@nestjs/common';
import { DayrecordService } from './dayrecord.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dayrecord')
export class DayrecordController {
  constructor(private readonly dayrecordService: DayrecordService) { }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createTodayRecord(@Req() req) {
    return await this.dayrecordService.createTodayRecord(req.user.id);
  }

  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  async addRecordDetail(@Req() req, @Body() post) {
    return await this.dayrecordService.addRecordDetail(req.user.id, post);
  }

  @Get(':date?')
  @UseGuards(AuthGuard('jwt'))
  async getRecord(@Req() req, @Param('date') date?: string) {
    return await this.dayrecordService.getRecord(req.user.id, date);
  }


  @Post('page')
  @UseGuards(AuthGuard('jwt'))
  async page(@Req() req, @Body() post) {
    return this.dayrecordService.getPage(req.user.id, post);
  }

  @Post('delete-detail')
  @UseGuards(AuthGuard('jwt'))
  async deleteRecordDetail(@Req() req, @Body() post) {
    return await this.dayrecordService.deleteRecordDetail(req.user.id, post);
  }
}