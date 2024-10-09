import { Injectable, UnauthorizedException, HttpException } from '@nestjs/common';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { InjectRepository, } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { BasicService } from 'src/common/basicService';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { generateInviteCode } from '../utils/common';

@Injectable()
export class ResourceService extends BasicService {

  constructor(
    @InjectRepository(Resource)
    private resourceRepository,
  ) {
    super()
  }

  /* 创建 */
  async create(post) {
    return await this.resourceRepository.save(post)
  }

  findAll() {
    return `This action returns all sticker`;
  }

  async findOne(id: number) {
    return await this.resourceRepository.findOne({ id });
  }

  async update(post) {

    const item = await this.resourceRepository.findOne(post.id);

    Object.assign(item, post);

    return this.resourceRepository.save(item);
  }

  async remove(id) {
    return this.resourceRepository.delete(id)
  }

  async getPage(post, user) {

    const where = null
    const queryBuilderName = 'Resource'


    function queryBuilderHook(qb) {
      qb.orderBy('Resource.createTime', 'DESC')
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.resourceRepository
    })
  }
}
