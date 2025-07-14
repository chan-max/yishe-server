import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { CustomModelService } from './custom_model.service';
import { OptionalAuthGuard } from 'src/common/authGuard'
import {
  ApiBearerAuth, 
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('custom-model')
export class CustomModelController {
  constructor(private readonly customModelService: CustomModelService) { }

  @Post('create')
  create(@Body() post) {
    return this.customModelService.create(post);
  }

  @Post('page')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  getPage(@Body() params, @Request() req) {
    return this.customModelService.getPage(params, req.user);
  }



  @Post('')
  find(@Body() body) {
    return this.customModelService.findOne(body.id);
  }


  @Post('update')
  update(@Body() post) {
    return this.customModelService.update(post);
  }

  @Post('delete')
  remove(@Body() body: { ids: string | string[] }) {
    return this.customModelService.remove(body.ids);
  }
}