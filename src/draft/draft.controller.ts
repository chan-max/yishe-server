/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-12 21:16:22
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-17 23:24:22
 * @FilePath: /design-server/src/draft/draft.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DraftService } from './draft.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/common/authGuard';

@Controller('draft')
@ApiTags('草稿箱')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: '创建草稿' })
  create(@Body() createDraftDto: CreateDraftDto, @Request() req) {
    createDraftDto['uploaderId'] = req.user.id;
    return this.draftService.create(createDraftDto);
  }

  @Post('page')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: '获取草稿列表' })
  getPage(@Body() post, @Request() req) {
    return this.draftService.getPage(post, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个草稿' })
  findOne(@Param('id') id: string) {
    return this.draftService.findOne(+id);
  }

  @Post('update')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: '更新草稿' })
  update(@Body() updateDraftDto: UpdateDraftDto) {
    return this.draftService.update(updateDraftDto);
  }

  @Post('delete')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: '删除草稿' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Body() body: { ids: string | string[] }) {
    return this.draftService.remove(body.ids);
  }

  @Get()
  find(@Query() query) {
    return this.draftService.findOne(query.id);
  }
} 