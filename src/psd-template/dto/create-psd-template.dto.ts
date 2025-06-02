import { ApiProperty } from '@nestjs/swagger';

export class CreatePsdTemplateDto {
    @ApiProperty({ description: '模板名称' })
    name: string;

    @ApiProperty({ description: '模板分类' })
    category: string;

    @ApiProperty({ description: '描述' })
    description: string;

    @ApiProperty({ description: '文件URL' })
    url: string;

    @ApiProperty({ description: '文件键值' })
    key: string;

    @ApiProperty({ description: '缩略图' })
    thumbnail: any;

    @ApiProperty({ description: '是否公开' })
    isPublic: boolean;

    @ApiProperty({ description: '元数据' })
    meta: any;
} 