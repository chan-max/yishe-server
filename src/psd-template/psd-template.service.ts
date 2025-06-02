import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PsdTemplate } from './entities/psd-template.entity';
import { CreatePsdTemplateDto } from './dto/create-psd-template.dto';
import { UpdatePsdTemplateDto } from './dto/update-psd-template.dto';
import { IPageResult, Pagination } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { BasicService } from 'src/common/basicService';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PsdTemplateService extends BasicService {
    constructor(
        @InjectRepository(PsdTemplate)
        private psdTemplateRepository: Repository<PsdTemplate>,
    ) {
        super();
    }

    async create(post) {
        return await this.psdTemplateRepository.save(post);
    }

    findAll() {
        return `This action returns all psd template`;
    }

    async findOne(id: string) {
        return await this.psdTemplateRepository.findOne({ where: { id } });
    }

    async update(post) {
        const item = await this.psdTemplateRepository.findOne({ where: { id: post.id } });
        Object.assign(item, post);
        return this.psdTemplateRepository.save(item);
    }

    async remove(id) {
        return this.psdTemplateRepository.delete(id);
    }

    async getPage(post, userInfo) {
        if (post.myUploads && !userInfo) {
            throw new UnauthorizedException('请登录');
        }

        const where = null;
        const queryBuilderName = 'PsdTemplate';

        function queryBuilderHook(qb) {
            qb
                .leftJoinAndSelect('PsdTemplate.uploader', 'user')
                .select([
                    "PsdTemplate.id",
                    "PsdTemplate.name",
                    "PsdTemplate.createTime",
                    "PsdTemplate.updateTime",
                    "PsdTemplate.thumbnail",
                    "PsdTemplate.description",
                    "PsdTemplate.isPublic",
                    "PsdTemplate.category",
                    "PsdTemplate.meta",
                    "PsdTemplate.url",
                    "user.name",
                    "user.account",
                    "user.email",
                    "user.isAdmin",
                ]).orderBy('PsdTemplate.createTime', 'DESC');

            if (post.myUploads) {
                qb.where('PsdTemplate.uploaderId = :uploaderId', { uploaderId: userInfo.id });
            }

            if (post.match) {
                let match = Array.isArray(post.match) ? post.match : [post.match];
                match.forEach(matcher => {
                    if (!match) {
                        return;
                    }

                    qb.where('PsdTemplate.name LIKE :searchTerm', { searchTerm: `%${matcher}%` })
                        .orWhere('PsdTemplate.description LIKE :searchTerm', { searchTerm: `%${matcher}%` });
                });
            }

            if (post.category) {
                qb.where('PsdTemplate.category = :category', { category: post.category });
            }
        }

        return await this.getPageFn({
            queryBuilderHook,
            queryBuilderName,
            post,
            where,
            repo: this.psdTemplateRepository
        });
    }

    async findByCategory(category: string) {
        return await this.psdTemplateRepository.find({ where: { category } });
    }

    async findByUploader(uploaderId: string) {
        return await this.psdTemplateRepository.find({ where: { uploaderId } });
    }
} 