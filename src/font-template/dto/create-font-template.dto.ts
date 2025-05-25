import { IsString, IsOptional, IsObject, IsArray, IsBoolean } from 'class-validator';

export class CreateFontTemplateDto {
  @IsString()
  name: string;

  @IsString()
  fontFamily: string;

  @IsString()
  fontPath: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    version?: string;
    author?: string;
    license?: string;
    description?: string;
    tags?: string[];
    [key: string]: any;
  };

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 