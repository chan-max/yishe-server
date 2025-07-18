import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sentence } from './entities/sentence.entity';
import { BasicService } from 'src/common/basicService';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SentenceService extends BasicService {
  constructor(
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
    private aiService: AiService, // 新增注入
  ) {
    super();
  }

  create(content: string, description?: string) {
    const sentence = this.sentenceRepository.create({ content, description });
    return this.sentenceRepository.save(sentence);
  }

  async findAll(currentPage: number = 1, pageSize: number = 20) {
    const skip = (currentPage - 1) * pageSize;
    const [list, total] = await this.sentenceRepository.findAndCount({
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' }
    });
    
    return {
      list,
      total,
      currentPage,
      pageSize
    };
  }

  async getPage(post) {
    const where = null;
    const queryBuilderName = 'Sentence';

    function queryBuilderHook(qb) {
      qb
        .select([
          "Sentence.id",
          "Sentence.content",
          "Sentence.description",
          "Sentence.createdAt",
          "Sentence.updatedAt",
        ])
        .orderBy('Sentence.createdAt', 'DESC');

      // 支持搜索功能
      if (post.search) {
        qb.where('Sentence.content LIKE :searchTerm', { searchTerm: `%${post.search}%` })
          .orWhere('Sentence.description LIKE :searchTerm', { searchTerm: `%${post.search}%` });
      }
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.sentenceRepository
    });
  }

  findOne(id: number) {
    return this.sentenceRepository.findOne({ where: { id } });
  }

  async update(id: number, content: string, description?: string) {
    await this.sentenceRepository.update(id, { content, description });
    return this.findOne(id);
  }

  async remove(id: number) {
    const sentence = await this.findOne(id);
    return this.sentenceRepository.remove(sentence);
  }

  /**
   * AI 生成句子和描述
   */
  async aiGenerateSentence(prompt: string) {
    // 默认提示词，要求AI返回JSON格式，包含content和description
    const defaultPrompt = "请用中文生成一句优美的句子，并为该句子生成一句简洁的描述介绍。只返回如下JSON格式：{content:'句子', description:'描述'}，不要其他解释、前后缀、标点或多余描述。";
    const finalPrompt = prompt && prompt.trim() ? `${defaultPrompt} 这是额外的要求${prompt}` : defaultPrompt;
    const params = {
      model: 'qwen-turbo',
      messages: [
        { role: 'user', content: [{ type: 'text', text: finalPrompt }] }
      ]
    };
    const res = await this.aiService.qwenChat(params);
    const text = res.choices?.[0]?.message?.content || '';
    let content = '', description = '';
    try {
      const match = text.match(/{[\s\S]*}/);
      if (match) {
        const obj = JSON.parse(match[0]);
        content = obj.content || '';
        description = obj.description || '';
      } else {
        content = text.trim();
      }
    } catch {
      content = text.trim();
    }
    return { content, description };
  }
} 