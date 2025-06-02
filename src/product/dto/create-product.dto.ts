import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: '商品名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '商品描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '商品类型', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: '商品图片，多个图片用逗号分隔', required: false })
  @IsString()
  @IsOptional()
  images?: string;

  @ApiProperty({ description: '商品价格' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '商品促销价格', required: false })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ description: '商品库存' })
  @IsNumber()
  stock: number;

  @ApiProperty({ description: '商品规格，JSON字符串', required: false })
  @IsString()
  @IsOptional()
  specifications?: string;

  @ApiProperty({ description: '标签，多个标签用逗号分隔', required: false })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiProperty({ description: '是否激活', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: '元数据', required: false })
  @IsOptional()
  meta?: any;
} 