import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePassDto } from './dto/updatePass-user.dto';
import { RedisInstance } from 'src/cache/redis';
import { IPageResult, Pagination } from 'src/utils/pagination';


import { getUserPageSql } from 'src/utils/sql';
import { createQueryCondition } from 'src/utils/utils';


import { BasicService } from 'src/common/basicService';


@Injectable()
export class UserService extends BasicService {
  constructor(
    @InjectRepository(User)
    private userRepository,
  ) {
    super()
  }

  // 用户注册
  async signup(createUserDto) {
    const { username, inviteCode } = createUserDto;

    const data = await this.userRepository.findOne({ where: { username } });
    if (data) {
      throw new HttpException({ message: '用户已经存在', code: 400 }, 200);
    }

    // 必须先create才能进@BeforeInsert
    createUserDto = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(createUserDto);
  }

  // 更新用户信息
  async update(user, info: UpdateUserDto) {
    await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set(info)
      .where('user.id=:id', { id: user.id })
      .execute();
    return await this.userRepository.findOne({
      where: { id: user.id },
    });
  }

  // 根据用户名获取用户信息
  async getUserInfo(id: string) {
    const user = await this.userRepository.findOne({ where: { id: (id) }, });
    return user;
  }

  // 注销登录
  async logout(user: Partial<User>) {
    const redis =  RedisInstance.getInstance(0);
    redis.removeItem('token',`user-token-${user.id}-${user.username}`);
    return 'logout successful';
  }

  // 修改用户密码
  async updatePass(user: Partial<User>, info: UpdatePassDto) {
    if (!compareSync(info.password, user.password)) {
      throw new HttpException({ message: 'error password', code: 400 }, 200);
    }
    if (compareSync(info.newPassword, user.password)) {
      throw new HttpException(
        { message: 'same password', code: 400 },
        200,
      );
    }
    await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({ password: hashSync(info.newPassword, 10) })
      .where('user.id=:id', { id: user.id })
      .execute();
    // 清空用户redis
    const redis =  RedisInstance.getInstance(0);
    redis.removeItem('token',`user-token-${user.id}-${user.username}`);

    return {};
  }

  // 获取用户列表
  async getPage(post, user) {

    const where = null
    const queryBuilderName = 'User'

    function queryBuilderHook(qb) {
      qb.orderBy('User.createTime', 'DESC')

      // 模糊查询
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.userRepository
    })
  }


  async updateMeta(user, post) {

    const userData = await this.userRepository.findOne(user.id);

    const { metaKey, data } = post

    if (!userData.meta) {
      userData.meta = {} as any
    }

    if (!userData.meta[metaKey]) {
      userData.meta[metaKey] = {}
    }

    userData.meta[metaKey] = post.data

    this.userRepository.save(userData)
    return {}
  }



  async getMeta(user, post) {
    const userData = await this.userRepository.findOne(user.id);

    const metaKey = post.metaKey

    if (!userData.meta) {
      userData.meta = {} as any
    }

    if (!userData.meta[metaKey]) {
      userData.meta[metaKey] = {}
    }

    return Promise.resolve(userData.meta[metaKey])
  }





}
