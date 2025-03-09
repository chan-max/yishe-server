import { PartialType } from '@nestjs/swagger';
import { CreateKeyvalueDto } from './create-keyvalue.dto';

export class UpdateKeyvalueDto extends PartialType(CreateKeyvalueDto) {}
