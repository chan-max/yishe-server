import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// 进行数据验证和转换
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFileDto {

  @IsNotEmpty({ message: '' })
  readonly url: string;

}

