import { Controller, Post, Param, UseGuards, Req, Body, Get } from '@nestjs/common';
import { DayrecordService } from './dayrecord.service';
import { AuthGuard } from '@nestjs/passport';
import { count } from 'console';

@Controller('dayrecord')
export class DayrecordController {
  constructor(private readonly dayrecordService: DayrecordService) { }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createTodayRecord(@Req() req) {
    return await this.dayrecordService.createTodayRecord(req.user.id);
  }

  @Post('add/:date?')
  @UseGuards(AuthGuard('jwt'))
  async addRecordDetail(@Req() req, @Body() post, @Param('date') date?: string) {
    return await this.dayrecordService.addRecordDetail(req.user.id, date, post);
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


  @Get('latest/:count?')
  @UseGuards(AuthGuard('jwt'))
  async getLatest(@Req() req, @Param('count') count?: any) {
    if (!count) {
      count = 7
    }
    return await this.dayrecordService.getLatest(req.user.id, Number(count));
  }

  @Get('analysis')
  @UseGuards(AuthGuard('jwt'))
  async getAnalysis(@Req() req) {
    return await this.dayrecordService.getAnalysis(req.user.id);
  }

  @Get('total')
  @UseGuards(AuthGuard('jwt'))
  async getTotalRecords(@Req() req) {
    return {
      success: true,
      totalRecords: await this.dayrecordService.getTotalRecords(req.user.id),
    };
  }

  @Get(':date?')
  @UseGuards(AuthGuard('jwt'))
  async getRecord(@Req() req, @Param('date') date?: string) {
    return await this.dayrecordService.getRecord(req.user.id, date);
  }


}