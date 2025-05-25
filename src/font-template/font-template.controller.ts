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
import { FontTemplateService } from './font-template.service';
import { CreateFontTemplateDto } from './dto/create-font-template.dto';
import { UpdateFontTemplateDto } from './dto/update-font-template.dto';
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

@Controller('font-template')
@ApiTags('字体模板')
export class FontTemplateController {
    constructor(private readonly fontTemplateService: FontTemplateService) {}

    // 获取单个
    @Get()
    @ApiOperation({ summary: '获取单个模板' })
    find(@Query() query) {
        return this.fontTemplateService.findOne(query.id);
    }

    @Post('create')
    @ApiOperation({ summary: '创建模板' })
    create(@Body() createFontTemplateDto: CreateFontTemplateDto) {
        return this.fontTemplateService.create(createFontTemplateDto);
    }

    @Post('page')
    @ApiOperation({ summary: '获取模板列表（分页）' })
    @ApiBearerAuth()
    @UseGuards(OptionalAuthGuard)
    getPage(@Body() post, @Request() req) {
        return this.fontTemplateService.getPage(post, req.user);
    }

    @Get()
    @ApiOperation({ summary: '获取所有模板' })
    findAll() {
        return this.fontTemplateService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: '根据ID获取模板' })
    findOne(@Param('id') id: string) {
        return this.fontTemplateService.findOne(id);
    }

    @Post('update')
    @ApiOperation({ summary: '更新模板' })
    update(@Body() updateFontTemplateDto: UpdateFontTemplateDto) {
        return this.fontTemplateService.update(updateFontTemplateDto);
    }

    @Post('delete')
    @ApiOperation({ summary: '删除模板' })
    remove(@Body() body) {
        return this.fontTemplateService.remove(body.id);
    }

    @Get('category/:category')
    findByCategory(@Param('category') category: string) {
        return this.fontTemplateService.findByCategory(category);
    }

    @Get('uploader/:uploaderId')
    findByUploader(@Param('uploaderId') uploaderId: string) {
        return this.fontTemplateService.findByUploader(uploaderId);
    }
} 