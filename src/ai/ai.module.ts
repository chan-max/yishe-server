import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { KeyValueController } from 'src/keyvalue/keyvalue.controller';
import { KeyValueService } from 'src/keyvalue/keyvalue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyValue } from 'src/keyvalue/entities/keyvalue.entity';

@Module({
  imports:[TypeOrmModule.forFeature([KeyValue])],
  controllers: [AiController,KeyValueController],
  providers: [AiService,KeyValueService],
})
export class AiModule {}
