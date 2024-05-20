import { Module } from '@nestjs/common';
import { ProductModelService } from './product_model.service';
import { ProductModelController } from './product_model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModel } from './entities/product_model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductModel]),],
  controllers: [ProductModelController],
  providers: [ProductModelService]
})
export class ProductModelModule {}
