import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePassDto } from './dto/updatePass-user.dto';
import { OrganizationService } from 'src/organization/organization.service';
import { RoleService } from 'src/role/role.service';
import { RedisInstance } from 'src/cache/redis';
import { IPageResult, Pagination } from 'src/utils/pagination';
import { QueryUserDto } from './dto/query-user.dto';
import { OrganizationEntity } from 'src/organization/entities/organization.entity';
import { RoleEntity } from 'src/role/entities/role.entity';
import { getUserPageSql } from 'src/utils/sql';
import { createQueryCondition } from 'src/utils/utils';
import { CustomModel } from 'src/custom_model/entities/custom_model.entity';

type IUser = User & {
  roleInfo?: RoleEntity;
  organizationInfo?: OrganizationEntity;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CustomModel)
    private customModelRepository: Repository<User>,
  ) {
  }

  // 用户注册
  async register(createUserDto: CreateUserDto) {
    const { account } = createUserDto;

    const data = await this.userRepository.findOne({ where: { account } });
    if (data) {
      throw new HttpException({ message: '用户已存在', code: 400 }, 200);
    }
    // 必须先create才能进@BeforeInsert
    createUserDto = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(createUserDto);
  }

  // 更新用户信息
  async update(user: Partial<User>, info: UpdateUserDto) {
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
  async getUserInfo(id: string): Promise<IUser> {
    const user: IUser = await this.userRepository.findOne({ id });
    const organizationInfo = await getConnection()
      .createQueryBuilder(OrganizationEntity, 'organization')
      .where('organization.id = :id', { id: user.organizationId })
      .getOne();
    const roleInfo = await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .where('role.id = :id', { id: user.roleId })
      .getOne();
    user.roleInfo = roleInfo;
    user.organizationInfo = organizationInfo;
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
  async getPage(query: QueryUserDto): Promise<IPageResult<User>> {
    const page = (query.currentPage - 1) * query.pageSize;
    const pagination = new Pagination<User>(
      { current: query.currentPage, size: query.pageSize },
      User,
    );
    // const result = pagination.findByPageSql<any>({
    //   sql: getUserPageSql(),
    //   parameters: ['u.account = :name', { name: 'chenxin' }],
    // });
    const where = createQueryCondition(query, [
      'account',
      'nickname',
      'phone',
      'roleId',
      'organizationId',
      'sex',
    ]);
    const db = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        OrganizationEntity,
        'organ',
        'organ.id = user.organizationId',
      )
      .leftJoinAndSelect(RoleEntity, 'role', 'role.id = user.roleId')
      .select(
        `user.id, user.account, user.nickname, user.avatar, user.email, user.create_time, user.phone, user.organizationId, user.roleId, user.birthday, user.sex, 
        organ.name as organizationName, 
        role.name as roleName  
      `,
      )
      // .skip(page)
      // .take(query.pageSize)
      .offset(page)
      .limit(query.pageSize)
      .where(where)
      .orderBy('user.create_time', 'DESC');

    const result = pagination.findByPage(db, 'getRawMany');
    return result;
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
