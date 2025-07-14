import { Module } from '@nestjs/common';
import { ProductModelService } from './product_model.service';
import { ProductModelController } from './product_model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModel } from './entities/product_model.entity';
import { CommonModule } from '../common/common.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductModel]),
    CommonModule,
    AiModule,
  ],
  controllers: [ProductModelController],
  providers: [ProductModelService]
})
export class ProductModelModule {}
