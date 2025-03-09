import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Dayrecord } from '../../entities/dayrecord.entity'
import { User } from 'src/user/entities/user.entity'
import { BasicService } from 'src/common/basicService'

@Injectable()
export class HeightService extends BasicService {
  constructor (
    @InjectRepository(Dayrecord)
    private readonly dayRecordRepository: Repository<Dayrecord>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super()
  }

  async getMyAllHeightRecords (
    userId: number,
  ): Promise<{ date: string; height: number }[]> {
    // 确保用户存在
    const user = await this.userRepository.findOne({
      where: { id: userId },
    } as any)
    if (!user) {
      throw new Error('User not found')
    }

    // 获取用户的所有日常记录
    const allRecords = await this.dayRecordRepository.find({
      where: { user: { id: userId } },
      select: ['date', 'record', 'id'], // 仅获取日期和记录字段
    } as any)

    // 筛选出所有身高记录

    const heightRecords = []

    allRecords.forEach(record => {
      if (Array.isArray(record.record)) {
        record.record.forEach(entry => {
          if (entry.type === 'height') {
            entry.pid = record.id
            heightRecords.push(entry)
          }
        })
      }
    })

    return heightRecords
  }

  /**
   * 获取最新的身高记录
   * 从最新的日常记录中查找身高类型的记录，并根据 createTime 字段排序，确保返回最新的身高记录
   */
  async getMyLatestHeightRecord (userId: number) {
    // 确保用户存在
    const user = await this.userRepository.findOne({
      where: { id: userId },
    } as any)
    if (!user) {
      throw new Error('User not found')
    }

    // 获取所有的日常记录，按日期降序排列
    const allRecords = await this.dayRecordRepository.find({
      where: { user: { id: userId } },
      select: ['date', 'record'], // 仅获取日期和记录字段
      order: { date: 'DESC' }, // 按日期降序排列
    } as any)

    // 遍历所有记录，从最新的记录开始查找
    for (const record of allRecords) {
      if (Array.isArray(record.record)) {
        // 查找类型为 'height' 的记录
        const heightRecords = record.record.filter(
          entry => entry.type === 'height',
        )

        // 如果存在身高记录，选择创建时间最新的那一条
        if (heightRecords.length > 0) {
          // 根据 createTime 排序，确保选取最新的身高记录
          const latestHeightRecord = heightRecords.sort((a, b) => {
            const timeA = new Date(a.createTime).getTime()
            const timeB = new Date(b.createTime).getTime()
            return timeB - timeA // 按照时间降序排列
          })[0] // 获取时间最新的一条记录

          return {
            ...latestHeightRecord,
          }
        }
      }
    }

    // 如果没有找到身高记录，返回 null
    return ''
  }
}
