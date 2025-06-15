/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-15 14:52:09
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-15 21:26:00
 * @FilePath: /design-server/src/design-request/design-request.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignRequest } from './entities/design-request.entity';
import { CreateDesignRequestDto } from './dto/create-design-request.dto';
import { FeishuService } from '../common/feishu.service';

@Injectable()
export class DesignRequestService {
  constructor(
    @InjectRepository(DesignRequest)
    private designRequestRepository: Repository<DesignRequest>,
    private feishuService: FeishuService,
  ) {}

  private buildDesignRequestMessage(designRequest: DesignRequest): string {
    return `🎨 新的设计请求通知\n\n` +
      `📝 请求标题: ${designRequest.name}\n` +
      `👤 请求用户: ${designRequest.user?.name || '未知'}\n` +
      `📱 联系电话: ${designRequest.phoneNumber || '未提供'}\n` +
      `📧 联系邮箱: ${designRequest.email || '未提供'}\n` +
      `📅 创建时间: ${new Date(designRequest.createTime).toLocaleString()}\n` +
      `📋 描述: ${designRequest.description || '无'}\n\n` +
      `🔗 请及时处理该设计请求`;
  }

  async create(createDesignRequestDto: CreateDesignRequestDto) {
    const designRequest = this.designRequestRepository.create(createDesignRequestDto);
    const savedRequest = await this.designRequestRepository.save(designRequest);
    
    // 构建消息内容并发送通知
    try {
      const message = this.buildDesignRequestMessage(savedRequest);
      await this.feishuService.sendMessage(message, 'design');
    } catch (error) {
      console.error('发送飞书通知失败:', error);
      // 通知失败不影响主流程
    }
    
    return savedRequest;
  }

  async findAll(page = 1, pageSize = 10) {
    const [items, total] = await this.designRequestRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createTime: 'DESC',
      },
      relations: ['user'],
    });

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    return await this.designRequestRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: string, updateDesignRequestDto) {
    await this.designRequestRepository.update(id, updateDesignRequestDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const designRequest = await this.findOne(id);
    if (designRequest) {
      await this.designRequestRepository.remove(designRequest);
    }
    return { success: true };
  }

  async findByUser(userId: string, page = 1, pageSize = 10) {
    const [items, total] = await this.designRequestRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createTime: 'DESC',
      },
      relations: ['user'],
    });

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
} 