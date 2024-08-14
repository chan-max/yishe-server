import { Controller, Get, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';


import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/common/authGuard'


@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('hello')
  public hello() {
    return 'hello 1s!'
  }

  @Post('getBasicConfig')
  getBasicConfig() {
    return this.appService.getBasicConfig()
  }

}
