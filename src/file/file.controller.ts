import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/common/authGuard'



@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('create')
  create(@Body() post: any) {
    return this.fileService.create(post);
  }


  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Post('all')
  findAllByPost() {
  }


  @Post('page')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  getPage(@Body() post, @Req() req) {
    return this.fileService.getPage({
      post,
      userInfo: req.user
    })
  }


  @Post('findOne')
  findOne(@Body() post) {
    return this.fileService.findOne(post);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() post) {
    return this.fileService.update(+id, post);
  }

  
}
