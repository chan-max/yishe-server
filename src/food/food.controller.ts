import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FoodService } from './food.service';
import { Food } from './entities/food.entity';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) { }

  @Post()
  async createFood(
    @Body('name') name: string,
    @Body('nutrition') nutrition: Record<string, any>,
  ): Promise<Food> {
    return this.foodService.createFood(name, nutrition);
  }

  @Get()
  async findAll(): Promise<Food[]> {
    return this.foodService.findAll();
  }

  @Post('page')
  async page(@Body() post) {
    return this.foodService.getPage(post);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Food> {
    return this.foodService.findById(id);
  }
}
