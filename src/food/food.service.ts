import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './entities/food.entity';
import { BasicService } from 'src/common/basicService';

@Injectable()
export class FoodService extends BasicService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {
    super()
  }

  async createFood(name: string, nutrition: Record<string, any>): Promise<Food> {
    const food = this.foodRepository.create({ name, nutrition });
    return this.foodRepository.save(food);
  }

  async findAll(): Promise<Food[]> {
    return this.foodRepository.find();
  }

  async findById(id: number): Promise<Food | undefined> {
    return this.foodRepository.findOne({ where: { id } });
  }

  async getPage(post) {


    const where = null
    const queryBuilderName = 'Food'


    function queryBuilderHook(qb) {
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.foodRepository
    })

  }
}
