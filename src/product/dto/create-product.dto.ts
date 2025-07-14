import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: '商品番号', example: 'PROD001' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: '商品名称', example: '示例商品' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '商品描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '商品类型', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: '商品图片', type: [String], required: false })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({ description: '商品价格', example: 99.99 })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @Type(() => Number)
  price: number | string;

  @ApiProperty({ description: '商品促销价', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @Type(() => Number)
  salePrice?: number | string;

  @ApiProperty({ description: '库存数量', example: 100 })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseInt(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @Type(() => Number)
  stock: number | string;

  @ApiProperty({ description: '商品规格', required: false })
  @IsOptional()
  @IsString()
  specifications?: string;

  @ApiProperty({ description: '商品标签', required: false })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({ description: '商品关键词', required: false })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiProperty({ description: '关联定制模型ID', required: false })
  @IsOptional()
  @IsString()
  customModelId?: string;

  @ApiProperty({ description: '是否上架', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '是否发布', example: false })
  @IsOptional()
  @IsBoolean()
  isPublish?: boolean;

  @ApiProperty({ description: '是否绝版', example: 0 })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseInt(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @Type(() => Number)
  isLimitedEdition?: number | string;
} 