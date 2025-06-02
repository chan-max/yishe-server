/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:12:19
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-24 09:28:38
 * @FilePath: /design-server/src/auth/jwt.strategy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

// 环境配置信息
import envConfig from '../../config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { RedisInstance } from 'src/cache/redis';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envConfig.SECRET,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(req: Request, user: User) {
    // 接口token
    const originToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
    // redis token
    const redis = new RedisInstance(0);
    const key = `user-token-${user.id}-${user.account}`;
    const cacheToken = await redis.getItem(key);

    //单点登陆验证
    if (cacheToken !== originToken) {
      throw new HttpException(
        { message: '登录信息已过期，请重新登录！', code: 401 },
        200,
      );
    }

    const existUser = await this.authService.getUser(user);
    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }
    return existUser;
  }
}