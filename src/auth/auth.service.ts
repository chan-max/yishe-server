import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisInstance } from 'src/cache/redis';
import { User } from 'src/user/entities/user.entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  // 获取用户信息
  getUser(user: Partial<User>) {
    const existUser = this.userRepository.findOne({
      where: { id: user.id, account: user.account },
    });
    return existUser;
  }

  // 生成token
  createToken(user: Partial<User>) {

    console.log('生成token',user.id, user.account)

    return this.jwtService.sign({
      id: user.id,
      account: user.account,
    });
  }

  verifyToken() {

  }

  // 用户登录
  async login(user: Partial<User>) {
    const token = this.createToken(user);

    console.log('token',token)

    const redis = new RedisInstance(0);

    redis.setItem(`user-token-${user.id}-${user.account}`, token, 60 * 60 * 8 * 365);



    return {
      // userInfo: user, login 不在返回用户信息，而是用过getuserinfo
      token,
    };
  }
}