import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Draft } from './entities/draft.entity';
import { BasicService } from 'src/common/basicService';
import { User } from 'src/user/entities/user.entity';
import { CosService } from 'src/common/cos.service';

@Injectable()
export class DraftService extends BasicService {
  constructor(
    @InjectRepository(Draft)
    private draftRepository,
    private cosService: CosService,
  ) {
    super()
  }

  /* 创建 */
  async create(post) {
    return await this.draftRepository.save(post)
  }

  async findOne(id: number) {
    return await this.draftRepository.findOne({ id });
  }

  async update(post) {
    const item = await this.draftRepository.findOne(post.id);
    Object.assign(item, post);
    return this.draftRepository.save(item);
  }

  async remove(ids: string | string[]) {
    // 确保 ids 是数组
    const idArray = Array.isArray(ids) ? ids : [ids];
    
    // 查找所有要删除的草稿
    const drafts = await this.draftRepository.findByIds(idArray);
    if (!drafts.length) {
      throw new Error('未找到要删除的草稿');
    }

    // 删除 COS 上的文件
    for (const draft of drafts) {
      if (draft.url) {
        await this.cosService.deleteFile(draft.url);
      }
    }

    // 删除数据库记录
    return this.draftRepository.delete(idArray);
  }

  async getPage(post, userInfo) {
    if (!userInfo) {
      throw new UnauthorizedException('请登录');
    }

    const where = null
    const queryBuilderName = 'Draft'

    function queryBuilderHook(qb) {
      qb
        .leftJoinAndSelect('Draft.uploader', 'user')
        .select([
          "Draft.id",
          "Draft.name",
          "Draft.createTime",
          "Draft.updateTime",
          "Draft.description",
          "Draft.type",
          "Draft.meta",
          "Draft.url",
          "user.name",
          "user.account",
          "user.email",
          "user.isAdmin",
        ])
        .where('Draft.uploaderId = :uploaderId', { uploaderId: userInfo?.id })
        .orderBy('Draft.createTime', 'DESC')

      if (post.type) {
        qb.andWhere('Draft.type = :type', { type: post.type })
      }

      if (post.customModelId) {
        qb.andWhere('Draft.customModelId = :customModelId', { customModelId: post.customModelId })
      }

      if (post.match) {
        let match = Array.isArray(post.match) ? post.match : [post.match]
        match.forEach(matcher => {
          if (!match) {
            return
          }
          qb.andWhere('(Draft.name LIKE :searchTerm OR Draft.description LIKE :searchTerm)', 
            { searchTerm: `%${matcher}%` })
        });
      }
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.draftRepository
    })
  }
}