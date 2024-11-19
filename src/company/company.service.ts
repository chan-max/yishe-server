import { Injectable, UnauthorizedException, HttpException } from '@nestjs/common';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { InjectRepository, } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { BasicService } from 'src/common/basicService';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { generateInviteCode } from '../utils/common';

@Injectable()
export class CompanyService extends BasicService {

  constructor(
    @InjectRepository(Company)
    private companyRepository,
    @InjectRepository(User)
    private userRepository,
    // private jwtService: JwtService,
  ) {
    super()
  }

  /* 创建 */
  async create(post) {

    post.inviteCode = generateInviteCode()

    return await this.companyRepository.save(post)
  }

  findAll() {
    return `This action returns all sticker`;
  }

  async findOne(id: number) {
    return await this.companyRepository.findOne({ id });
  }

  async update(post) {

    const item = await this.companyRepository.findOne(post.id);

    Object.assign(item, post);

    return this.companyRepository.save(item);
  }

  async remove(id) {

    let hasUser = await this.userRepository.findOne({ where: { companyId: id } })

    if (hasUser) {
      throw new HttpException({ message: '该公司下存在用户，请先删除用户', code: 400 }, 200);
    }

    return this.companyRepository.delete(id)
  }

  async getPage(post, user) {

    const where = null
    const queryBuilderName = 'Company'


    function queryBuilderHook(qb) {
      qb.orderBy('Company.createTime', 'DESC')
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.companyRepository
    })
  }
}
