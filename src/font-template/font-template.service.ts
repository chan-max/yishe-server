import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FontTemplate } from './entities/font-template.entity';
import { CreateFontTemplateDto } from './dto/create-font-template.dto';

@Injectable()
export class FontTemplateService {
  constructor(
    @InjectRepository(FontTemplate)
    private fontTemplateRepository: Repository<FontTemplate>,
  ) {}

  async create(createFontTemplateDto: CreateFontTemplateDto): Promise<FontTemplate> {
    const fontTemplate = this.fontTemplateRepository.create(createFontTemplateDto);
    return await this.fontTemplateRepository.save(fontTemplate);
  }

  async findAll(): Promise<FontTemplate[]> {
    return await this.fontTemplateRepository.find();
  }

  async findOne(id: number): Promise<FontTemplate> {
    const fontTemplate = await this.fontTemplateRepository.findOne({ where: { id } });
    if (!fontTemplate) {
      throw new NotFoundException(`字体模板 ID ${id} 不存在`);
    }
    return fontTemplate;
  }

  async findByFontFamily(fontFamily: string): Promise<FontTemplate[]> {
    return await this.fontTemplateRepository.find({
      where: { fontFamily, isActive: true },
    });
  }

  async update(id: number, updateFontTemplateDto: Partial<CreateFontTemplateDto>): Promise<FontTemplate> {
    const fontTemplate = await this.findOne(id);
    Object.assign(fontTemplate, updateFontTemplateDto);
    return await this.fontTemplateRepository.save(fontTemplate);
  }

  async remove(id: number): Promise<void> {
    const fontTemplate = await this.findOne(id);
    await this.fontTemplateRepository.remove(fontTemplate);
  }

  async searchFonts(query: string): Promise<FontTemplate[]> {
    return await this.fontTemplateRepository
      .createQueryBuilder('font')
      .where('font.name LIKE :query', { query: `%${query}%` })
      .orWhere('font.fontFamily LIKE :query', { query: `%${query}%` })
      .orWhere('font.metadata->>\'tags\' LIKE :query', { query: `%${query}%` })
      .getMany();
  }
} 