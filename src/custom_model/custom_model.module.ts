import { Module } from '@nestjs/common';
import { CustomModelService } from './custom_model.service';
import { CustomModelController } from './custom_model.controller';
import { CustomModel } from './entities/custom_model.entity';
import { User } from 'src/user/entities/user.entity';
import { Draft } from 'src/draft/entities/draft.entity';
import {TypeOrmModule} from '@nestjs/typeorm'
import { CosService } from 'src/common/cos.service';
import { AiModule } from '../ai/ai.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomModel,User,Draft]), AiModule, ProductModule],
  controllers: [CustomModelController],
  providers: [CustomModelService, CosService]
})
export class CustomModelModule {}
