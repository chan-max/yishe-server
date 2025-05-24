/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 19:09:21
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-24 23:27:14
 * @FilePath: /design-server/src/psd-template/psd-template.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { PsdTemplateService } from './psd-template.service';
import { CreatePsdTemplateDto } from './dto/create-psd-template.dto';
import { UpdatePsdTemplateDto } from './dto/update-psd-template.dto';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/common/authGuard';

@Controller('psd-template')
@ApiTags('PSD模板')
export class PsdTemplateController {
    constructor(private readonly psdTemplateService: PsdTemplateService) {}

    // 获取单个
    @Get()
    @ApiOperation({ summary: '获取单个模板' })
    find(@Query() query) {
        return this.psdTemplateService.findOne(query.id);
    }

    @Post('create')
    @ApiOperation({ summary: '创建模板' })
    create(@Body() createPsdTemplateDto: CreatePsdTemplateDto) {
        return this.psdTemplateService.create(createPsdTemplateDto);
    }

    @Post('page')
    @ApiOperation({ summary: '获取模板列表（分页）' })
    @ApiBearerAuth()
    @UseGuards(OptionalAuthGuard)
    getPage(@Body() post, @Request() req) {
        return this.psdTemplateService.getPage(post, req.user);
    }

    @Get()
    @ApiOperation({ summary: '获取所有模板' })
    findAll() {
        return this.psdTemplateService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: '根据ID获取模板' })
    findOne(@Param('id') id: string) {
        return this.psdTemplateService.findOne(id);
    }

    @Post('update')
    @ApiOperation({ summary: '更新模板' })
    update(@Body() updatePsdTemplateDto: UpdatePsdTemplateDto) {
        return this.psdTemplateService.update(updatePsdTemplateDto);
    }

    @Post('delete')
    @ApiOperation({ summary: '删除模板' })
    remove(@Body() body) {
        return this.psdTemplateService.remove(body.id);
    }

    @Get('category/:category')
    findByCategory(@Param('category') category: string) {
        return this.psdTemplateService.findByCategory(category);
    }

    @Get('uploader/:uploaderId')
    findByUploader(@Param('uploaderId') uploaderId: string) {
        return this.psdTemplateService.findByUploader(uploaderId);
    }
}