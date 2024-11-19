import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { InjectRepository, } from '@nestjs/typeorm';
import { CustomModel } from './entities/custom_model.entity';
import { BasicService } from 'src/common/basicService';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CustomModelService extends BasicService {

  constructor(
    @InjectRepository(CustomModel)
    private customModelRepository,
    @InjectRepository(User)
    private userRepository,
  ) {
    super()
  }

  async create(post) {
    return await this.customModelRepository.save(post);
  }


  findAll() {
    return `This action returns all `;
  }

  async findOne(id) {
    console.log(id)
    let res = await this.customModelRepository.findOne({ where: { id: (id) }, relations: ['uploader'] });

    return res
  }

  async update(post) {
    const item = await this.customModelRepository.findOne(post.id);
    Object.assign(item, post);
    return this.customModelRepository.save(item);
  }

  async remove(id) {
    return this.customModelRepository.delete(id)
  }

  async getPage(post, userInfo) {

    // 查询个人上传
    if (post.myUploads && !userInfo) {
      throw new UnauthorizedException('请登录');
    }

    const where = null
    const queryBuilderName = 'customModel'

    function queryBuilderHook(qb) {
      qb
        .leftJoinAndSelect('CustomModel.uploader', 'user')
        .select([
          "CustomModel.id",
          "CustomModel.name",
          "CustomModel.createTime",
          "CustomModel.updateTime",
          "CustomModel.thumbnail",
          "CustomModel.thumbnails",
          "CustomModel.description",
          "CustomModel.isPublic",
          "CustomModel.keywords",
          "CustomModel.price",
          "CustomModel.customizable",
          "CustomModel.meta",
          "user.name",
          "user.account",
          "user.email",
          "user.avatar",
          "user.isAdmin",
        ])

      if (post.myUploads) {
        qb.where('CustomModel.uploaderId = :uploaderId', { uploaderId: userInfo.id })
      }

      // 搜索 关键字 匹配 
      if (post.match) {

        let match = Array.isArray(post.match) ? post.match : [post.match]
        match.forEach(matcher => {

          if (!match) {
            return
          }

          qb.where('CustomModel.name LIKE :searchTerm', { searchTerm: `%${matcher}%` })
            .orWhere('CustomModel.description LIKE :searchTerm', { searchTerm: `%${matcher}%` })
            .orWhere('CustomModel.keywords LIKE :searchTerm', { searchTerm: `%${matcher}%` });
        });
      }

      // 是否可定制

      if (post.customizable) {
        qb.where('CustomModel.customizable = :customizable', { customizable: post.customizable == '1' })
      }

      qb.orderBy('CustomModel.createTime', post.createTimeOrderBy || 'DESC')

      if (post.priceOrderBy) {
        qb.orderBy('CustomModel.price', post.priceOrderBy)
      }


      // 指定基础模型
      if (post.baseModelId) {
        qb.where(`json_valid(CustomModel.meta)`).andWhere(`json_search(CustomModel.meta, "one",:value)`, { value: `%${post.baseModelId}%` })
      }
    }


    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.customModelRepository
    })
  }
}
