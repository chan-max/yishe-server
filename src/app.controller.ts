/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:12:19
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-09 21:58:45
 * @FilePath: /design-server/src/app.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

  @Get('test')
  public test() {
    return true
  }

  
  @Post('getBasicConfig')
  getBasicConfig() {
    return this.appService.getBasicConfig()
  }

}
