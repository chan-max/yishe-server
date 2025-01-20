/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-01-01 08:32:29
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-01-01 08:39:44
 * @FilePath: /design-server/src/dayrecord/mixins/sleep/sleep.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Post,
  Param,
  UseGuards,
  Req,
  Body,
  Get,
} from '@nestjs/common'
import { HeightService } from './height.service'
import { AuthGuard } from '@nestjs/passport'
import { DayrecordService } from 'src/dayrecord/dayrecord.service'

@Controller('height')
export class HeightController {
  constructor (
    private readonly heightService: HeightService,
    private readonly dayrecordService: DayrecordService,
  ) {}
  // 获取睡眠日志

  @Get('height-records')
  @UseGuards(AuthGuard('jwt'))
  async getHeightRecords (@Req() req) {
    return await this.heightService.getMyAllHeightRecords(req.user.id)
  }
  @Get('latest-height-record')
  @UseGuards(AuthGuard('jwt'))
  async getMyLatestHeightRecord (@Req() req) {
    return await this.heightService.getMyLatestHeightRecord(req.user.id)
  }
}
