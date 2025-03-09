import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePassDto } from './dto/updatePass-user.dto';

import { OptionalAuthGuard } from 'src/common/authGuard'


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  @UseInterceptors(AnyFilesInterceptor())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 201, type: [User] })
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.userService.signup(createUserDto);
  }
  
  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Req() req, @Body() data: UpdateUserDto) {
    const user = await this.userService.update(req.user, data);
    delete user.password;
    return user;
  }

  @Post('updatePass')
  @ApiOperation({ summary: '修改用户密码' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  updatePass(@Req() req, @Body() data: UpdatePassDto) {
    return this.userService.updatePass(req.user, data);
  }


  @Post('getUserInfo')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Req() req, @Body('id') id: string) {
    if (!id) id = req.user.id;
    const res = await this.userService.getUserInfo(id);
    delete res.password;
    delete res.meta;
    return res;
  }

  @Post('page')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  getPage(@Body() post, @Req() req) {
    return this.userService.getPage(post, req.user);
  }

  @Post('logout')
  @ApiOperation({ summary: '注销登录' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  logout(@Req() req) {
    return this.userService.logout(req.user);
  }

  @Post('updateMeta')
  @UseGuards(AuthGuard('jwt'))
  async updateMeta(
    @Req() request,
    @Body() updateMetaDto,
  ) {
    return this.userService.updateMeta(request.user, updateMetaDto);
  }

  @Post('getMeta')
  @UseGuards(AuthGuard('jwt'))
  async getMeta(
    @Req() request,
    @Body() post,
  ) {
    return this.userService.getMeta(request.user, post);
  }

}
