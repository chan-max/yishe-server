import { PartialType } from '@nestjs/swagger';
import { CreateRecordSentenceDto } from './create-record_sentence.dto';

export class UpdateRecordSentenceDto extends PartialType(CreateRecordSentenceDto) {}
