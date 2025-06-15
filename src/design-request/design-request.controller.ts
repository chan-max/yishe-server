/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-15 14:52:33
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-15 15:01:23
 * @FilePath: /design-server/src/design-request/design-request.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DesignRequestService } from './design-request.service';
import { CreateDesignRequestDto } from './dto/create-design-request.dto';
import { UpdateDesignRequestDto } from './dto/update-design-request.dto';

@Controller('design-request')
export class DesignRequestController {
  constructor(private readonly designRequestService: DesignRequestService) {}

  @Post()
  create(@Body() createDesignRequestDto) {
    return this.designRequestService.create(createDesignRequestDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.designRequestService.findAll(page, pageSize);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.designRequestService.findByUser(userId, page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.designRequestService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDesignRequestDto: UpdateDesignRequestDto,
  ) {
    return this.designRequestService.update(id, updateDesignRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.designRequestService.remove(id);
  }
} 