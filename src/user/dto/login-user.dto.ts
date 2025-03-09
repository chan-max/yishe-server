import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// 进行数据验证和转换
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: '用户名称' })
  @IsNotEmpty({ message: 'username is empty' })
  readonly username: string;

  @ApiProperty({ description: '用户密码' })
  @IsNotEmpty({ message: 'password is empty' })
  readonly password: string;
}
