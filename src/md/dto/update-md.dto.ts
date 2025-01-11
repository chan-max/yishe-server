import { PartialType } from '@nestjs/swagger';
import { CreateMdDto } from './create-md.dto';

export class UpdateMdDto extends PartialType(CreateMdDto) {}
