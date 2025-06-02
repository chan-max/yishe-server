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
import { generateImage } from '../svg/text-to-png';
import { Sticker } from '../sticker/entities/sticker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('font-template')
@ApiTags('字体模板')
export class FontTemplateController {
    constructor(
        private readonly fontTemplateService: FontTemplateService,
        @InjectRepository(Sticker)
        private stickerRepository: Repository<Sticker>
    ) {}

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

    @Post('gen-image')
    @ApiOperation({ summary: '生成图片并上传到COS，同时新建一条数据到sticker' })
    async genImage(@Body() body: { fontId: string, text: string }) {
        const { fontId, text } = body;
        const fontTemplate = await this.fontTemplateService.findOne(fontId);
        if (!fontTemplate) {
            throw new Error('Font template not found');
        }
        const fontUrl = fontTemplate.url;
        const cosUrl = await generateImage({
            text,
            fontUrl,
            fontName: 'CustomFont',
            fontSize: 144,
            canvasWidth: 2400,
            canvasHeight: 800,
            canvasBackground: 'transparent',
            textColor: '#000000',
            textAlign: 'center',
            textBaseline: 'middle',
            outputFilename: 'output.png',
            outputDirectory: __dirname
        });
        const sticker = new Sticker();
        sticker.url = cosUrl;
        sticker.name = 'Generated Image';
        sticker.description = 'Generated from font template';
        await this.stickerRepository.save(sticker);
        return sticker;
    }
} 