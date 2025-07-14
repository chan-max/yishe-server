/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 12:42:47
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-13 22:09:32
 * @FilePath: /yishe-admin/Users/jackie/workspace/design-server/src/product/product.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
@ApiTags('商品管理')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiOperation({ summary: '创建商品' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
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
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto);
  }

  @Post('updatePublish')
  @ApiOperation({ summary: '更新商品发布状态' })
  updatePublish(@Body() body: { id: string; isPublish: boolean }) {
    return this.productService.update(body);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除商品' })
  remove(@Body() body: { ids: string[] }) {
    return this.productService.removeMany(body.ids);
  }

  @Post('page')
  @ApiOperation({ summary: '分页获取商品列表' })
  getPage(@Body() body) {
    return this.productService.getPage(body);
  }
} 