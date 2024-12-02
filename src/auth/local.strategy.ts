import { HttpException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcryptjs';
import { IStrategyOptions, Strategy } from 'passport-local';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        } as IStrategyOptions);
    }

    async validate(username: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { username },
        });

        if (!user) {
            throw new HttpException({ message: 'user not exist', code: 400 }, 200);
        }
        if (!compareSync(password, user.password)) {
            throw new HttpException({ message: 'password error', code: 400 }, 200);
        }
        return user;
    }
}