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
    return {
      cos: {
        SecretId: 'AKIDMdmaMD0uiNwkVH0gTJFKXaXJyV4hHmAL',
        SecretKey: 'HPdigqyzpgTNICCQnK0ZF6zrrpkbL4un',
        Bucket: '1s-1257307499',
        Region: 'ap-beijing'
      }
    }
  }

}
