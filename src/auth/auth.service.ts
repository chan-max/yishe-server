import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisInstance } from 'src/cache/redis';
import { User } from 'src/user/entities/user.entity';
import { getConnection, Repository } from 'typeorm';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {

        this.redis = new RedisInstance(0);
    }

    redis = null

    // 获取用户信息
    getUser(user: Partial<User>) {
        const existUser = this.userRepository.findOne({
            where: { id: user.id, account: user.account },
        });
        return existUser;
    }

    

    verify() {

    }

    // 生成token
    createToken(user: Partial<User>) {

        return this.jwtService.sign({
            id: user.id,
            account: user.account,
        });
    }

    // 用户登录
    async login(post: Partial<User>) {

        const userInfo = await this.userRepository.findOne({
            where: { account: post.account },
        });

        if (!userInfo) {
            throw new HttpException({ message: '用户名不存在', code: 400 }, 200);
        }
        if (!compareSync(post.password, userInfo.password)) {
            throw new HttpException({ message: '密码错误！', code: 400 }, 200);
        }

        const token = this.createToken(userInfo);

        this.redis.setItem(`user-token-${userInfo.id}-${userInfo.account}`, token, 60 * 60 * 8);

        return {
            userInfo,
            token,
        };
    }
}
