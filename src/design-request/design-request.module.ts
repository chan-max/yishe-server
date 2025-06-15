import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignRequestService } from './design-request.service';
import { DesignRequestController } from './design-request.controller';
import { DesignRequest } from './entities/design-request.entity';
import { User } from 'src/user/entities/user.entity';
import { FeishuService } from '../common/feishu.service';

@Module({
  imports: [TypeOrmModule.forFeature([DesignRequest, User])],
  controllers: [DesignRequestController],
  providers: [DesignRequestService, FeishuService],
  exports: [DesignRequestService],
})
export class DesignRequestModule {} 