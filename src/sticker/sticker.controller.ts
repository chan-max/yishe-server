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
  // @UseGuards(AuthGuard('jwt'))
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStickerDto: UpdateStickerDto) {
    return this.stickerService.update(+id, updateStickerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stickerService.remove(+id);
  }
}
