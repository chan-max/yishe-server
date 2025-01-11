import {
  Controller,
  Post,
  Param,
  UseGuards,
  Req,
  Body,
  Get,
  Query,
} from '@nestjs/common'
import { DayrecordService } from './dayrecord.service'
import { AuthGuard } from '@nestjs/passport'
import { count } from 'console'

@Controller('dayrecord')
export class DayrecordController {
  constructor (private readonly dayrecordService: DayrecordService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createTodayRecord (@Req() req) {
    return await this.dayrecordService.createTodayRecord(req.user.id)
  }

  @Post('add/:date?')
  @UseGuards(AuthGuard('jwt'))
  async addRecordDetail (
    @Req() req,
    @Body() post,
    @Param('date') date?: string,
  ) {
    return await this.dayrecordService.addRecordDetail(req.user.id, date, post)
  }

  @Post('page')
  @UseGuards(AuthGuard('jwt'))
  async page (@Req() req, @Body() post) {
    return this.dayrecordService.getPage(req.user.id, post)
  }

  @Post('delete-detail')
  @UseGuards(AuthGuard('jwt'))
  async deleteRecordDetail (@Req() req, @Body() post) {
    return await this.dayrecordService.deleteRecordDetail(req.user.id, post)
  }

  @Get('latest/:count?')
  @UseGuards(AuthGuard('jwt'))
  async getLatest (@Req() req, @Param('count') count?: any) {
    if (!count) {
      count = 7
    }
    return await this.dayrecordService.getLatest(req.user.id, Number(count))
  }

  @Get('analysis')
  @UseGuards(AuthGuard('jwt'))
  async getAnalysis (@Req() req) {
    return await this.dayrecordService.getAnalysis(req.user.id)
  }

  @Get('total')
  @UseGuards(AuthGuard('jwt'))
  async getTotalRecords (@Req() req) {
    return {
      success: true,
      totalRecords: await this.dayrecordService.getTotalRecords(req.user.id),
    }
  }

  @Get('height-records')
  @UseGuards(AuthGuard('jwt'))
  async getHeightRecords (@Req() req) {
    return await this.dayrecordService.getMyAllHeightRecords(req.user.id)
  }

  @Get('weight-records')
  @UseGuards(AuthGuard('jwt'))
  async getWeightRecords (@Req() req) {
    return await this.dayrecordService.getMyAllWeightRecords(req.user.id)
  }

  @Get('latest-height-records')
  @UseGuards(AuthGuard('jwt'))
  async getMyLatestHeightRecord (@Req() req) {
    return await this.dayrecordService.getMyLatestHeightRecord(req.user.id)
  }

  @Get('latest-weight-records')
  @UseGuards(AuthGuard('jwt'))
  async getMyLatestWeightRecord (@Req() req) {
    return await this.dayrecordService.getMyLatestWeightRecord(req.user.id)
  }

  @Get('my-monthly-record-detail')
  @UseGuards(AuthGuard('jwt'))
  async getMyMonthlyRecordDetail (@Req() req, @Query('type') type?: any) {
    return await this.dayrecordService.getMyMonthlyRecordDetail(
      type,
      req.user.id,
    )
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('monthly-records')
  async getMonthlyRecords (
    @Req() req,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const userId = req.user.id // 从认证信息中获取用户ID
    return await this.dayrecordService.getMonthlyRecords(userId, year, month)
  }

  // 这个方法始终放在最底下

  @Get(':date?')
  @UseGuards(AuthGuard('jwt'))
  async getRecord (@Req() req, @Param('date') date?: string) {
    return await this.dayrecordService.getRecord(req.user.id, date)
  }

  // 新增：获取所有身高记录
}
