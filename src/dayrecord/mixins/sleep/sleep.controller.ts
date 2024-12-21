import { Controller, Post, Param, UseGuards, Req, Body, Get } from '@nestjs/common';
import { SleepService } from './sleep.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('sleep')
export class SleepController {
    constructor(private readonly sleepService: SleepService) { }
    // 获取睡眠日志
    @Get('dashboard')
    @UseGuards(AuthGuard('jwt'))
    async getSleepDashboard(@Req() req) {
        return await this.sleepService.getSleepDashboard(req.user.id);
    }
}