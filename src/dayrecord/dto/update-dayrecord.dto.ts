import { PartialType } from '@nestjs/swagger';
import { CreateDayrecordDto } from './create-dayrecord.dto';

export class UpdateDayrecordDto extends PartialType(CreateDayrecordDto) {}
