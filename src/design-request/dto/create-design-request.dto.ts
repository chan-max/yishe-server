import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateDesignRequestDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  userId?: string;
} 