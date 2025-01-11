// period.controller.ts
import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common'
import { PeriodService } from './period.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('period')
export class PeriodController {
  constructor (private readonly periodService: PeriodService) {}

  // 获取某年某月的记录
  @UseGuards(AuthGuard('jwt'))
  @Get('monthly-records')
  async getMonthlyRecords (
    @Req() req,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const userId = req.user.id // 从认证信息中获取用户ID
    return await this.periodService.getMonthlyRecords(userId, year, month)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('predict-period-month')
  async  predictPeriodForMonth(
    @Req() req,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const userId = req.user.id // 从认证信息中获取用户ID
    return await this.periodService.predictPeriodForMonth(userId, year, month)
  }
}
