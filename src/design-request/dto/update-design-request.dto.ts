import { PartialType } from '@nestjs/mapped-types';
import { CreateDesignRequestDto } from './create-design-request.dto';

export class UpdateDesignRequestDto extends PartialType(CreateDesignRequestDto) {} 