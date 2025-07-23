import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, ClassSerializerInterceptor,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StickerService } from './sticker.service';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';
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

@Controller('sticker')
export class StickerController {
  constructor(private readonly stickerService: StickerService) { }

  // 获取单个
  @Get()
  find(@Query() query) {
    return this.stickerService.findOne(query.id);
  }

  @Post('create')
  create(@Body() createStickerDto: CreateStickerDto) {
    return this.stickerService.create(createStickerDto);
  }

  @Post('page')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  getPage(@Body() post, @Request() req) {
    return this.stickerService.getPage(post, req.user);
  }

  @Get()
  findAll() {
    return this.stickerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stickerService.findOne(+id);
  }

  @Post('update')
  update(@Body() updateStickerDto: UpdateStickerDto) {
    return this.stickerService.update(updateStickerDto);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除贴纸' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Body() body: { ids: string | string[] }) {
    return this.stickerService.remove(body.ids);
  }

  @Post('ai-generate-info')
  async aiGenerateInfo(@Body() body: { id: string, prompt?: string }) {
    return await this.stickerService.aiGenerateInfo(body.id, body.prompt);
  }

  @Post('phash')
  @ApiOperation({ summary: '计算图片感知哈希' })
  async calculatePhash(@Body() body: { url: string, ext?: string }) {
    if (!body.url) {
      return { phash: '' };
    }
    const phash = await this.stickerService.calculatePhashByUrl(body.url, body.ext || 'jpg');
    return { phash };
  }
}
