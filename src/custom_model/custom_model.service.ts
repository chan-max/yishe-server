import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} `;
  }

  update(id: number, post) {
    return `This action updates a #${id} `;
  }

  remove(id: number) {
    return `This action removes a #${id} `;
  }

  async getPage(post) {

    const queryBuilderName = 'CustomModel'

    function queryBuilderHook(qb){
      qb
      .leftJoinAndSelect(User, 'user', `${queryBuilderName}.uploader_id = user.id`)
      .orderBy('CustomModel.create_time', 'DESC')
    }

    return await this.getPageFn({
      queryBuilderName,
      queryBuilderHook,
      post,
      where:null,
      repo:this.customModelRepository
    })
  }
}
