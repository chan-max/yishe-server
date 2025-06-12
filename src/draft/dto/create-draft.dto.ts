import { ApiProperty } from '@nestjs/swagger';

export class CreateDraftDto {
    @ApiProperty({ description: '文件URL' })
    url: string;

    @ApiProperty({ description: '名称' })
    name: string;

    @ApiProperty({ description: '描述' })
    description: string;

    @ApiProperty({ description: '类型：image或video' })
    type: string;

    @ApiProperty({ description: '元数据' })
    meta: any;
} 