import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductModelService } from './product_model.service';
import { CreateProductModelDto } from './dto/create-product_model.dto';
import { UpdateProductModelDto } from './dto/update-product_model.dto';


@Controller('product-model')
export class ProductModelController {
  constructor(private readonly productModelService: ProductModelService) { }

  @Post('create')
  create(@Body() data) {
    return this.productModelService.create( data)
  }

  @Get()
  find(@Query() query) {
    return this.productModelService.findOne(query.id);
  }

  @Post('all')
  findAllByPost() {
  }


  @Post('delete')
  remove(@Body() post) {
    return this.productModelService.remove(post.id);
  }

  @Post('page')
  getPage(@Body() post) {
    return this.productModelService.getPage({
      post
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productModelService.findOne(id);
  }


  @Post('update')
  update(@Body() post) {
    return this.productModelService.update(post);
  }

  @Post('ai-generate-info')
  async aiGenerateInfo(@Body() body: { id: string; prompt?: string }) {
    return this.productModelService.aiGenerateInfo(body.id, body.prompt);
  }

}
