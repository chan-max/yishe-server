import { Module } from '@nestjs/common';
import { MdController } from './md.controller';
import { MdService } from './md.service';

@Module({
  imports: [],
  controllers: [MdController],
  providers: [MdService],
})
export class MdModule {}
