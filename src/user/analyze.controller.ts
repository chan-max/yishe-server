import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('analyze')
export class AnalyzeController {
    constructor(private readonly analyzeService: AnalyzeService) { }


    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getUserAnalyze (@Req() req) {
      const res = await this.analyzeService.getUserAnalyze(req.user.id)
      return res
    }

}
