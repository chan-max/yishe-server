import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('product')
@ApiTags('商品管理')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiOperation({ summary: '创建商品' })
  create(@Body() post: any) {
    return this.productService.create(post);
  }

  @Get()
  @ApiOperation({ summary: '获取所有商品' })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个商品' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post('update')
  @ApiOperation({ summary: '更新商品' })
  update(@Body() post: any) {
    return this.productService.update(post);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除商品' })
  remove(@Body() body: any) {
    return this.productService.remove(body.id);
  }

  @Post('page')
  @ApiOperation({ summary: '分页获取商品列表' })
  getPage(@Body() post: any) {
    return this.productService.getPage(post);
  }
} 