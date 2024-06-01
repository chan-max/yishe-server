import { Module } from '@nestjs/common';
import { CustomModelService } from './custom_model.service';
import { CustomModelController } from './custom_model.controller';
import { CustomModel } from './entities/custom_model.entity';
import { User } from 'src/user/entities/user.entity';
import {TypeOrmModule} from '@nestjs/typeorm'
@Module({
  imports: [TypeOrmModule.forFeature([CustomModel,User]),],
  controllers: [CustomModelController],
  providers: [CustomModelService]
})
export class CustomModelModule {}
