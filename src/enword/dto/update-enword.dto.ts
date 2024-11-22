import { PartialType } from '@nestjs/swagger';
import { CreateEnwordDto } from './create-enword.dto';

export class UpdateEnwordDto extends PartialType(CreateEnwordDto) {}
