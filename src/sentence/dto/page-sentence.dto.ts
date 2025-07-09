import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class PageSentenceDto {
  @ApiProperty({ description: '当前页码', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  currentPage?: number = 1;

  @ApiProperty({ description: '每页数量', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize?: number = 20;

  @ApiProperty({ description: '搜索关键词', required: false })
  @IsOptional()
  @IsString()
  search?: string;
} 