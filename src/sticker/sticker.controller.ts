import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StickerService } from './sticker.service';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';

@Controller('sticker')
export class StickerController {
  constructor(private readonly stickerService: StickerService) {}

  @Post()
  create(@Body() createStickerDto: CreateStickerDto) {
    return this.stickerService.create(createStickerDto);
  }

  @Post('page')
  getPage(@Body() params ) {
    return this.stickerService.getPage(params);
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
