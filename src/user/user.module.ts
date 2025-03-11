import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, AnalyzeController],
  providers: [UserService, AnalyzeService],
  exports:[UserService]
})
export class UserModule { }
