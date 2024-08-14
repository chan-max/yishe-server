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

  @Get('')
  find(@Query() query) {
    return this.customModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customModelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() post) {
    return this.customModelService.update(+id, post);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customModelService.remove(+id);
  }
}
