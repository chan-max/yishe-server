import { PartialType } from '@nestjs/swagger';
import { CreateCrawlerMaterialDto } from './create-crawler-material.dto';

export class UpdateCrawlerMaterialDto extends PartialType(CreateCrawlerMaterialDto) {
  id: string;
} 