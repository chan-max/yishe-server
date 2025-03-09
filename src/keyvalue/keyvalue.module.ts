// src/keyvalue/keyvalue.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyValueService } from './keyvalue.service';
import { KeyValueController } from './keyvalue.controller';
import { KeyValue } from './entities/keyvalue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KeyValue])], // 注册实体
  controllers: [KeyValueController], // 注册控制器
  providers: [KeyValueService], // 注册服务
})
export class KeyValueModule {}