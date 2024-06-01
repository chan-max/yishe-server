import { Module } from '@nestjs/common';
import { CustomModelService } from './custom_model.service';
import { CustomModelController } from './custom_model.controller';
import { CustomModel } from './entities/custom_model.entity';
import {TypeOrmModule} from '@nestjs/typeorm'
@Module({
  imports: [TypeOrmModule.forFeature([CustomModel]),],
  controllers: [CustomModelController],
  providers: [CustomModelService]
})
export class CustomModelModule {}
