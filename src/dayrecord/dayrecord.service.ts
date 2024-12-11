import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dayrecord } from './entities/dayrecord.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DayrecordService {
  constructor(
    @InjectRepository(Dayrecord)
    private readonly dayRecordRepository: Repository<Dayrecord>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /**
   * 创建今天的记录
   * 如果已存在记录，直接返回；如果不存在记录，则创建新记录
   */
  async createTodayRecord(userId: number): Promise<Dayrecord> {
    // 确保用户存在

    const user = await this.userRepository.findOne({ where: { id: String(userId) } });
    if (!user) {
      throw new Error('User not found');
    }

    // 获取今天的日期
    const today = new Date().toISOString().split('T')[0];

    // 检查是否已存在记录
    let dayRecord = await this.dayRecordRepository.findOne({
      where: { user: { id: userId }, date: today },
    } as any);
    
    if (!dayRecord) {
      // 如果没有记录则创建
      dayRecord = this.dayRecordRepository.create({
        user,
        date: today,
      });
      await this.dayRecordRepository.save(dayRecord);
    }

    return dayRecord;
  }
}
