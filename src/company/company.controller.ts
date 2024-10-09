import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, ClassSerializerInterceptor,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
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

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  // 获取单个
  @Get()
  find(@Query() query) {
    return this.companyService.findOne(query.id);
  }

  @Post('create')
  create(@Body() createStickerDto) {
    return this.companyService.create(createStickerDto);
  }

  @Post('page')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  getPage(@Body() post, @Request() req) {
    return this.companyService.getPage(post, req.user);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Post('update')
  update(@Body() body) {
    return this.companyService.update(body);
  }

  @Post('delete')
  remove(@Body() body) {
    return this.companyService.remove(body.id);
  }
}
