import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSentenceDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
} 