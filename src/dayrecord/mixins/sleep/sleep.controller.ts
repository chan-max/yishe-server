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
import { SleepService } from './sleep.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('sleep')
export class SleepController {
  constructor (private readonly sleepService: SleepService) {}
  // 获取睡眠日志
  @Get('dashboard')
  @UseGuards(AuthGuard('jwt'))
  async getSleepDashboard (@Req() req) {
    return await this.sleepService.getSleepDashboard(req.user.id)
  }
}
