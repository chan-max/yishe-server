import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dayrecord } from './entities/dayrecord.entity';
import { User } from 'src/user/entities/user.entity';
import { BasicService } from 'src/common/basicService';

@Injectable()
export class DayrecordService extends BasicService {
  constructor(
    @InjectRepository(Dayrecord)
    private readonly dayRecordRepository: Repository<Dayrecord>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super()
  }

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
        record: [],
      });
      await this.dayRecordRepository.save(dayRecord);
    }

    return dayRecord;
  }

  /**
   * 获取记录
   * 如果传入日期，则获取该日期的记录；如果未传入日期，则获取今日记录
   */
  async getRecord(userId: number, date?: string): Promise<Dayrecord> {
    if (date) {
      // 根据日期查找记录
      const record = await this.dayRecordRepository.findOne({ where: { user: { id: userId }, date } } as any);
      if (!record) {
        throw new Error('Record not found for the given date');
      }
      return record;
    } else {
      // 获取今日记录
      return this.createTodayRecord(userId);
    }
  }

  /**
   * 添加记录
   * 向 dayrecord 的 record 字段中增加一个
   */
  async addRecordDetail(userId: number, newRecord: { id: number; data: string }): Promise<Dayrecord> {
    // 确保今日记录存在
    const dayRecord = await this.createTodayRecord(userId);

    // 更新 record 字段
    if (!Array.isArray(dayRecord.record)) {
      dayRecord.record = [];
    }
    dayRecord.record.push(newRecord);

    // 保存更新后的记录
    await this.dayRecordRepository.save(dayRecord);

    return dayRecord;
  }

  /**
   * 删除记录
   * 从 dayrecord 的 record 字段中删除指定记录
   */
  async deleteRecordDetail(userId: number, post: { id: number | number[]; pid: number }): Promise<Dayrecord> {
    // 根据 pid 查找对应的 dayRecord
    const dayRecord = await this.dayRecordRepository.findOne({ where: { id: post.pid, user: { id: userId } } } as any);
    if (!dayRecord) {
      throw new Error('Dayrecord not found');
    }

    // 检查并删除指定记录
    if (Array.isArray(dayRecord.record)) {
      if (!post.id) {
        // 没有 id 删除所有
        dayRecord.record = [];
      } else if (Array.isArray(post.id)) {
        // 如果 id 是数组，删除对应的多条记录
        dayRecord.record = dayRecord.record.filter(record => !(post.id as any[]).includes(record.id));
      } else {
        // 如果 id 是单个值，删除单条记录
        const recordIndex = dayRecord.record.findIndex(record => record.id === post.id);
        if (recordIndex > -1) {
          dayRecord.record.splice(recordIndex, 1);
        } else {
          throw new Error('Record not found in the specified day record');
        }
      }
    } else {
      throw new Error('No records found for the specified day');
    }

    // 保存更新后的记录
    await this.dayRecordRepository.save(dayRecord);

    return dayRecord;
  }


  async getPage(userId, post) {

    const queryBuilderName = 'Dayrecord'

    const where = null

    function queryBuilderHook(qb) {
      qb.where('Dayrecord.user = :userId', { userId });
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.dayRecordRepository
    })
  }
}
