/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-25 10:04:17
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-25 18:51:23
 * @FilePath: /design-server/src/font-template/dto/update-font-template.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFontTemplateDto {
    @ApiProperty({ description: 'ID' })
    id: string;

    @ApiProperty({ description: '模板名称' })
    name: string;

    @ApiProperty({ description: '模板分类' })
    category: string;

    @ApiProperty({ description: '描述' })
    description: string;

    @ApiProperty({ description: '关键字', required: false })
    keywords: string;

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