import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FontTemplate } from './entities/font-template.entity';
import { CreateFontTemplateDto } from './dto/create-font-template.dto';
import { UpdateFontTemplateDto } from './dto/update-font-template.dto';
import { IPageResult, Pagination } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { BasicService } from 'src/common/basicService';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FontTemplateService extends BasicService {
    constructor(
        @InjectRepository(FontTemplate)
        private fontTemplateRepository: Repository<FontTemplate>,
    ) {
        super();
    }

    async create(post) {
        return await this.fontTemplateRepository.save(post);
    }

    findAll() {
        return `This action returns all font template`;
    }

    async findOne(id: string) {
        return await this.fontTemplateRepository.findOne({ where: { id } });
    }

    async update(post) {
        const item = await this.fontTemplateRepository.findOne({ where: { id: post.id } });
        Object.assign(item, post);
        return this.fontTemplateRepository.save(item);
    }

    async remove(id) {
        return this.fontTemplateRepository.delete(id);
    }

    async getPage(post, userInfo) {
        if (post.myUploads && !userInfo) {
            throw new UnauthorizedException('请登录');
        }

        const where = null;
        const queryBuilderName = 'FontTemplate';

        function queryBuilderHook(qb) {
            qb
                .leftJoinAndSelect('FontTemplate.uploader', 'user')
                .select([
                    "FontTemplate.id",
                    "FontTemplate.name",
                    "FontTemplate.createTime",
                    "FontTemplate.updateTime",
                    "FontTemplate.thumbnail",
                    "FontTemplate.description",
                    "FontTemplate.isPublic",
                    "FontTemplate.category",
                    "FontTemplate.meta",
                    "FontTemplate.url",
                    "user.name",
                    "user.account",
                    "user.email",
                    "user.isAdmin",
                ]).orderBy('FontTemplate.createTime', 'DESC');

            if (post.myUploads) {
                qb.where('FontTemplate.uploaderId = :uploaderId', { uploaderId: userInfo.id });
            }

            if (post.match) {
                let match = Array.isArray(post.match) ? post.match : [post.match];
                match.forEach(matcher => {
                    if (!match) {
                        return;
                    }

                    qb.where('FontTemplate.name LIKE :searchTerm', { searchTerm: `%${matcher}%` })
                        .orWhere('FontTemplate.description LIKE :searchTerm', { searchTerm: `%${matcher}%` });
                });
            }

            if (post.category) {
                qb.where('FontTemplate.category = :category', { category: post.category });
            }
        }

        return await this.getPageFn({
            queryBuilderHook,
            queryBuilderName,
            post,
            where,
            repo: this.fontTemplateRepository
        });
    }

    async findByCategory(category: string) {
        return await this.fontTemplateRepository.find({ where: { category } });
    }

    async findByUploader(uploaderId: string) {
        return await this.fontTemplateRepository.find({ where: { uploaderId } });
    }
} 