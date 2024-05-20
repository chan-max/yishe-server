import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('create')
  create(@Body() post: any) {
    return this.fileService.create(post);
  }


  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Post('all')
  findAllByPost(){
  }


  @Post('page')
  getPage(@Body() post){
    return this.fileService.getPage({
      post
    })
  }


  @Post('findOne')
  findOne(@Body() post) {
    return this.fileService.findOne(post);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() post ) {
    return this.fileService.update(+id, post);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
