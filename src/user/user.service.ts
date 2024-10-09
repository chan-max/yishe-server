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
import { CustomModel } from 'src/custom_model/entities/custom_model.entity';

import { UserMetaRelationKey, createDefaultRelation } from './relation';
import { Relation } from './entities/relation.entity';
import { BasicService } from 'src/common/basicService';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class UserService extends BasicService {
  constructor(
    @InjectRepository(User)
    private userRepository,
    @InjectRepository(CustomModel)
    private customModelRepository,
    @InjectRepository(Relation)
    private relationRepository,
    @InjectRepository(Company)
    private companyRepository,
  ) {
    super()
  }

  // 用户注册
  async register(createUserDto) {
    const { account, inviteCode } = createUserDto;

    const data = await this.userRepository.findOne({ where: { account } });
    if (data) {
      throw new HttpException({ message: '用户已存在', code: 400 }, 200);
    }

    // 存在邀请码
    if (inviteCode) {
      let company = await this.companyRepository.findOne({ where: { inviteCode: inviteCode } })
      if (!company) {
        throw new HttpException({ message: '错误的邀请码', code: 400 }, 200);
      } else {
        createUserDto.companyId = company.id;
      }
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
    const user = await this.userRepository.findOne({ where: { id: (id) }, relations: ['company'] });
    return user;
  }

  // 注销登录
  async logout(user: Partial<User>) {
    const redis = new RedisInstance(0);
    redis.removeItem(`user-token-${user.id}-${user.account}`);
    return '注销成功！';
  }

  // 修改用户密码
  async updatePass(user: Partial<User>, info: UpdatePassDto) {
    if (!compareSync(info.password, user.password)) {
      throw new HttpException({ message: '用户密码不正确', code: 400 }, 200);
    }
    if (compareSync(info.newPassword, user.password)) {
      throw new HttpException(
        { message: '新密码与旧密码一致', code: 400 },
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
    const redis = new RedisInstance(0);
    redis.removeItem(`user-token-${user.id}-${user.account}`);

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



  /***
   * 处理用户关联关系
  */
  // async updateRelation(post, user) {
  //   const userData = await this.userRepository.findOne(user.id);

  //   let {
  //     userId, // 目标用户
  //     follow // 是否关注
  //   } = post

  //   if (!userData.meta) {
  //     userData.meta = {} as any
  //   }

  //   if (!userData.meta[UserMetaRelationKey]) {
  //     userData.meta[UserMetaRelationKey] = {}
  //   }

  //   if (!userData.meta[UserMetaRelationKey][userId]) {
  //     userData.meta[UserMetaRelationKey][userId] = createDefaultRelation()
  //   }

  //   // 需要同时更新两个人的信息

  //   let relation = userData.meta[UserMetaRelationKey][userId]

  // }

  /*
    用户关注信息
  */


  // 创建关注关系
  async relationCreate(followerId: number, followedId: number) {
    const existingRelation = await this.relationFindOne(followerId, followedId);
    if (existingRelation && existingRelation.isActive) {
      throw new HttpException('Already following', HttpStatus.BAD_REQUEST);
    }

    if (existingRelation && !existingRelation.isActive) {
      existingRelation.isActive = true;
      return this.relationRepository.save(existingRelation);
    }

    const relation = this.relationRepository.create({
      followerId,
      followedId,
    } as any);
    return this.relationRepository.save(relation);
  }

  // 查找关注关系
  async relationFindOne(followerId: number, followedId: number) {
    return this.relationRepository.findOne({
      where: { followerId, followedId },
    }) as any;
  }

  // 获取用户的关注列表
  async getFollowing(userId: number) {
    return this.relationRepository.find({
      where: { followerId: userId, isActive: true },
    });
  }

  // 获取用户的粉丝列表
  async getFollowers(userId: number) {
    return this.relationRepository.find({
      where: { followedId: userId, isActive: true },
    });
  }

  // 取消关注（软删除）
  async removeRelation(followerId: number, followedId: number) {
    const existingRelation = await this.relationFindOne(followerId, followedId);
    if (!existingRelation || !existingRelation.isActive) {
      throw new HttpException('Not following', HttpStatus.BAD_REQUEST);
    }
    existingRelation.isActive = false;
    await this.relationRepository.save(existingRelation);
  }

}
