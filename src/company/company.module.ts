import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company,User])],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}


