import { Controller, Get, Post, Body, Patch, Param, Delete,Query } from '@nestjs/common';
import { ProductModelService } from './product_model.service';
import { CreateProductModelDto } from './dto/create-product_model.dto';
import { UpdateProductModelDto } from './dto/update-product_model.dto';


@Controller('product-model')
export class ProductModelController {
  constructor(private readonly productModelService: ProductModelService) {}

  @Post('create')
  create(@Body() createProductModelDto: CreateProductModelDto) {
    return this.productModelService.create(createProductModelDto);
  }


  @Get()
  find(@Query() query) {
    return this.productModelService.findOne(query.id);
  }

  @Post('all')
  findAllByPost(){
  }


  @Post('page')
  getPage(@Body() post){
    return this.productModelService.getPage({
      post
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productModelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductModelDto: UpdateProductModelDto) {
    return this.productModelService.update(+id, updateProductModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productModelService.remove(+id);
  }
}
