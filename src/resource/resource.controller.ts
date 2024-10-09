import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, ClassSerializerInterceptor,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/common/authGuard'

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) { }

  // 获取单个
  @Get()
  find(@Query() query) {
    return this.resourceService.findOne(query.id);
  }

  @Post('create')
  create(@Body() createStickerDto) {
    return this.resourceService.create(createStickerDto);
  }

  @Post('page')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  getPage(@Body() post, @Request() req) {
    return this.resourceService.getPage(post, req.user);
  }

  @Get()
  findAll() {
    return this.resourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(+id);
  }

  @Post('update')
  update(@Body() body) {
    return this.resourceService.update(body);
  }

  @Post('delete')
  remove(@Body() body) {
    return this.resourceService.remove(body.id);
  }
}
