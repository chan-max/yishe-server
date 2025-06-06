import { Module } from '@nestjs/common';
import { ProductModelService } from './product_model.service';
import { ProductModelController } from './product_model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModel } from './entities/product_model.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductModel]),
    CommonModule
  ],
  controllers: [ProductModelController],
  providers: [ProductModelService]
})
export class ProductModelModule {}
