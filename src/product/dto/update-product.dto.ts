import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateProductDto {
  @ApiProperty({ description: '商品ID' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: '商品番号', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: '商品名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;

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

  @ApiProperty({ description: '商品价格', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @Type(() => Number)
  price?: number | string;

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

  @ApiProperty({ description: '库存数量', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseInt(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @Type(() => Number)
  stock?: number | string;

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

  @ApiProperty({ description: '是否上架', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '是否发布', required: false })
  @IsOptional()
  @IsBoolean()
  isPublish?: boolean;

  @ApiProperty({ description: '是否绝版', required: false })
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