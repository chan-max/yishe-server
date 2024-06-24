import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
// 环境配置信息
import envConfig from '../../config';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';
// import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy'
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule,
  // JwtModule.register({
  //   secret: 'P@ssp0rt20HJ21@@$$', // 私钥
  //   signOptions: { expiresIn: '6h' }  //过期时间
  // })
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtService],
  exports: [],
})
export class AuthModule { }


