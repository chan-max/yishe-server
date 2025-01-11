// period.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Dayrecord } from '../../entities/dayrecord.entity'
import { User } from 'src/user/entities/user.entity'
import { BasicService } from 'src/common/basicService'

@Injectable()
export class PeriodService extends BasicService {
  constructor (
    @InjectRepository(Dayrecord)
    private readonly dayRecordRepository: Repository<Dayrecord>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super()
  }

  // 获取某年某月的记录
  async getMonthlyRecords (
    userId: number,
    year: number,
    month: number,
  ): Promise<Dayrecord[]> {
    const startDate = new Date(year, month - 1, 1) // 月份从 0 开始
    const endDate = new Date(year, month, 0) // 当前月的最后一天

    return await this.dayRecordRepository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    } as any)
  }

  async predictPeriodForMonth (
    userId: number,
    year: number,
    month: number,
  ): Promise<{ isPredict: boolean; date: string }[]> {
    // 获取用户的历史记录
    const records = await this.dayRecordRepository.find({
      where: {
        user: { id: userId },
      },
      order: { date: 'ASC' },
    } as any)

    // 提取历史记录中生理期开始日期
    const periodStartDates = records
      .filter((record: any) => record.type == 'period')
      .map(record => new Date(record.createTime))

    // 默认周期长度为28天
    let avgCycleLength = 28
    if (periodStartDates.length >= 2) {
      const cycleLengths: number[] = []
      for (let i = 1; i < periodStartDates.length; i++) {
        const diff =
          (periodStartDates[i].getTime() - periodStartDates[i - 1].getTime()) /
          (1000 * 60 * 60 * 24)
        cycleLengths.push(diff)
      }
      avgCycleLength =
        cycleLengths.reduce((sum, length) => sum + length, 0) /
        cycleLengths.length
    }

    // 获取本月的日期范围
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 起点：最近的周期开始日期，或今天
    let lastPeriodDate = periodStartDates.length
      ? periodStartDates[periodStartDates.length - 1]
      : startDate

    // 调整到今天之后的日期
    while (lastPeriodDate <= today) {
      lastPeriodDate = new Date(
        lastPeriodDate.getTime() + avgCycleLength * 24 * 60 * 60 * 1000,
      )
    }

    // 预测本月的生理期
    const predictions: { isPredict: boolean; date: string }[] = []
    while (lastPeriodDate <= endDate) {
      if (lastPeriodDate >= today && lastPeriodDate <= endDate) {
        predictions.push({
          isPredict: true,
          date: lastPeriodDate.toISOString().split('T')[0],
        })
      }

      lastPeriodDate = new Date(
        lastPeriodDate.getTime() + avgCycleLength * 24 * 60 * 60 * 1000,
      )
    }

    // 如果没有预测日期，生成一个默认预测
    if (predictions.length === 0) {
      const defaultPrediction = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      if (defaultPrediction <= endDate) {
        predictions.push({
          isPredict: true,
          date: defaultPrediction.toISOString().split('T')[0],
        })
      }
    }

    return predictions
  }
}
