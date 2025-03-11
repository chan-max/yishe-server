import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Dayrecord } from './entities/dayrecord.entity'
import { User } from 'src/user/entities/user.entity'
import { BasicService } from 'src/common/basicService'
import { getDateKey } from 'src/common/date'
import { CommonQueueService } from 'src/common/queue/common.service'
// import { CommonQueueService } from 'src/common/queue/common.service'


export function getDayRecordDateKey (inputDate?) {
  const date = inputDate ? new Date(inputDate) : new Date() // 如果未传入日期，使用当前日期

  // 确保日期有效
  if (isNaN(date.getTime())) {
    throw new Error(
      'Invalid date input. Please provide a valid date string or Date object.',
    )
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 补零，确保两位数
  const day = String(date.getDate()).padStart(2, '0') // 补零，确保两位数

  return `${year}-${month}-${day}`
}

@Injectable()
export class DayrecordService extends BasicService {
  constructor (
    @InjectRepository(Dayrecord)
    private readonly dayRecordRepository: any,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonQueueService: CommonQueueService
  ) {
    super()
  }

  /**
   * 创建今天的记录
   * 如果已存在记录，直接返回；如果不存在记录，则创建新记录
   */
  async createTodayRecord (userId: number): Promise<Dayrecord> {
    // 确保用户存在
    const user = await this.userRepository.findOne({
      where: { id: String(userId) },
    })
    if (!user) {
      throw new Error('User not found')
    }

    // 获取今天的日期
    const today = getDayRecordDateKey()

    // 检查是否已存在记录
    let dayRecord = await this.dayRecordRepository.findOne({
      where: { user: { id: userId }, date: today },
    } as any)

    if (!dayRecord) {
      // 如果没有记录则创建
      dayRecord = this.dayRecordRepository.create({
        user,
        date: today,
        record: [],
      })
      await this.dayRecordRepository.save(dayRecord)
    }
    return dayRecord
  }

  /**
   * 获取记录
   * 如果传入日期，则获取该日期的记录；如果未传入日期，则获取今日记录
   * 如果指定日期没有记录，则自动创建并返回该记录
   */
  async getRecord (userId: number, date?: string): Promise<Dayrecord> {
    // 确保用户存在
    const user = await this.userRepository.findOne({
      where: { id: userId },
    } as any)
    if (!user) {
      throw new Error('User not found')
    }

    // 如果没有传递 date 参数，则默认使用今天的日期
    const currentDate = date || getDayRecordDateKey()

    // 查找指定日期的记录
    let dayRecord = await this.dayRecordRepository.findOne({
      where: { user: { id: userId }, date: currentDate },
    } as any)

    // 如果记录不存在，创建新的记录
    if (!dayRecord) {
      dayRecord = this.dayRecordRepository.create({
        user,
        date: currentDate,
        record: [], // 初始化 record 字段为空数组
      })
      await this.dayRecordRepository.save(dayRecord)
    }

    return dayRecord
  }

  async updateRecordDetail(
    id,
    cid,
    updateData
  ) {
    // 获取 Dayrecord
    const dayRecord = await this.dayRecordRepository.findOne({
      where: { id: id },
    });
  
    if (!dayRecord) {
      console.log('dayRecord not found')
      return null;
    }
  
    // 确保 record 字段是数组
    if (!Array.isArray(dayRecord.record)) {
      console.log('Invalid record format')
      return null;
    }
  
    // 查找需要更新的记录项
    const recordIndex = dayRecord.record.findIndex(record => record.id === cid);
    if (recordIndex === -1) {
      console.log('Invalid record format')
      return null;
    }
  
    // 更新指定字段
    Object.assign(dayRecord.record[recordIndex], updateData);
  
    // 保存更新后的 Dayrecord
    await this.dayRecordRepository.save(dayRecord);
  
    return dayRecord;
  }
  

  async updateDayrecord (
    userId: number,
    date,
    updateData: {
      title?: string
      description?: string
      color?: string
    },
  ): Promise<Dayrecord> {
    // 获取或创建记录
    let dayRecord = await this.getRecord(userId, date)

    // 仅更新传入的字段
    if (updateData.title !== undefined) {
      dayRecord.title = updateData.title
    }
    if (updateData.description !== undefined) {
      dayRecord.description = updateData.description
    }
    if (updateData.color !== undefined) {
      dayRecord.color = updateData.color
    }

    // 保存更新后的记录
    await this.dayRecordRepository.save(dayRecord)

    return dayRecord
  }

  async getTotalRecords (userId: number): Promise<number> {
    return await this.dayRecordRepository.count({
      where: { user: { id: userId } },
    })
  }

  /**
   * 添加记录
   * 向 dayrecord 的 record 字段中增加一个
   */
  async addRecordDetail (
    userId: number,
    date: string | null,
    newRecord,
  ): Promise<Dayrecord> {
    // 确保用户存在
    const user = await this.userRepository.findOne({
      where: { id: userId },
    } as any)
    if (!user) {
      throw new Error('User not found')
    }

    // 如果没有传递 date 参数，则默认使用今天的日期
    const currentDate = !date || date == 'today' ? getDayRecordDateKey() : date

    // 查找指定日期的记录
    let dayRecord = await this.dayRecordRepository.findOne({
      where: { user: { id: userId }, date: currentDate },
    } as any)

    // 如果记录不存在，创建新的记录
    if (!dayRecord) {
      dayRecord = this.dayRecordRepository.create({
        user,
        date: currentDate,
        record: [newRecord], // 初始化 record 字段，包含新的记录
      })
      await this.dayRecordRepository.save(dayRecord)
    } else {
      // 如果记录已存在，更新 record 字段

      if (!Array.isArray(dayRecord.record)) {
        dayRecord.record = []
      }

      dayRecord.record.push(newRecord)

      // 保存更新后的记录
      await this.dayRecordRepository.save(dayRecord)
    }

    

    await this.commonQueueService.enqueueAddDayrecord({
      id:dayRecord.id,
      cid:newRecord.id,
      record:newRecord,
      userId,
    })


    return dayRecord
  }

  /**
   * 删除记录
   * 从 dayrecord 的 record 字段中删除指定记录
   */
  async deleteRecordDetail (
    userId: number,
    post: { id: number | number[]; pid: number },
  ): Promise<Dayrecord> {
    // 根据 pid 查找对应的 dayRecord
    const dayRecord = await this.dayRecordRepository.findOne({
      where: { id: post.pid, user: { id: userId } },
    } as any)
    if (!dayRecord) {
      throw new Error('Dayrecord not found')
    }

    // 检查并删除指定记录
    if (Array.isArray(dayRecord.record)) {
      if (!post.id) {
        // 没有 id 删除所有
        dayRecord.record = []
      } else if (Array.isArray(post.id)) {
        // 如果 id 是数组，删除对应的多条记录
        dayRecord.record = dayRecord.record.filter(
          record => !(post.id as any[]).includes(record.id),
        )
      } else {
        // 如果 id 是单个值，删除单条记录
        const recordIndex = dayRecord.record.findIndex(
          record => record.id === post.id,
        )
        if (recordIndex > -1) {
          dayRecord.record.splice(recordIndex, 1)
        } else {
          throw new Error('Record not found in the specified day record')
        }
      }
    } else {
      throw new Error('No records found for the specified day')
    }

    // 保存更新后的记录
    await this.dayRecordRepository.save(dayRecord)

    return dayRecord
  }

  async getPage (userId, post) {
    const queryBuilderName = 'Dayrecord'

    const where = null

    function queryBuilderHook (qb) {
      qb.where('Dayrecord.user = :userId', { userId })
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.dayRecordRepository,
    })
  }

  async getLatest (userId: number, count): Promise<Dayrecord[]> {
    // 获取当前日期
    const today = new Date()

    // 获取7天前的日期
    const countDaysAgo = new Date(today)
    countDaysAgo.setDate(today.getDate() - count)

    // 格式化为 ISO 字符串（只保留日期部分）
    // const todayStr = today.toISOString().split('T')[0]
    // const countDaysAgoStr = countDaysAgo.toISOString().split('T')[0]

    const todayStr = getDateKey(today)
    const countDaysAgoStr = getDateKey(countDaysAgo)

    // 查询数据库获取最近7天的记录
    const records = await this.dayRecordRepository.find({
      where: {
        user: { id: userId },
        date: Between(countDaysAgoStr, todayStr), // 查询7天内的记录
      },
      order: { date: 'ASC' }, // 按照日期升序排列（从7天前到今天）
    } as any)

    // 结果数组
    const result: Dayrecord[] = []

    // 遍历过去7天的日期
    let currentDate = new Date(countDaysAgo)
    for (let i = 0; i < count; i++) {
      const currentDateStr = currentDate.toISOString().split('T')[0]

      // 查找该日期的记录
      let recordForDate = records.find(record => record.date === currentDateStr)

      // 如果没有记录，自动生成新的记录
      if (!recordForDate) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        } as any)

        // 确保用户存在
        if (!user) {
          throw new Error('User not found')
        }

        // 创建新的记录
        recordForDate = this.dayRecordRepository.create({
          user,
          date: currentDateStr,
          record: [],
        })

        await this.dayRecordRepository.save(recordForDate)
      }

      // 添加记录到结果数组
      result.push(recordForDate)

      // 增加一天
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }

  async getAnalysis (userId: number): Promise<any> {
    // 获取总记录数
    const totalRecords = await this.dayRecordRepository.count({
      where: { user: { id: userId } },
    })

    // 获取所有个人记录
    const allRecords = await this.dayRecordRepository.find({
      where: { user: { id: userId } },
      select: ['date', 'record'], // 仅获取需要的字段
      order: { date: 'ASC' }, // 按日期排序
    })

    // 处理记录，计算 recordCount
    const totalRecordCount = allRecords.map(record => ({
      date: record.date,
      recordCount: Array.isArray(record.record) ? record.record.length : 0,
    }))

    // 返回分析结果
    return {
      totalRecords,
      totalRecordCount,
    }
  }



  /**
   */
  async getMyMonthlyRecordDetail (type: string, userId: number) {
    // 确保用户存在
    const user = await this.userRepository.findOne({
      where: { id: userId },
    } as any)
    if (!user) {
      throw new Error('User not found')
    }

    // 获取当前日期和一个月前的日期
    const today = new Date()
    const oneMonthAgo = new Date(today)
    oneMonthAgo.setMonth(today.getMonth() - 1)

    const todayStr = today.toISOString().split('T')[0]
    const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0]

    // 查询数据库获取一个月内的记录
    const records = await this.dayRecordRepository.find({
      where: {
        user: { id: userId },
        date: Between(oneMonthAgoStr, todayStr),
      },
      order: { date: 'ASC' }, // 按日期升序排列
    } as any)

    // 提取所有身高记录
    const _records: { date: string }[] = []
    records.forEach(record => {
      if (Array.isArray(record.record)) {
        record.record.forEach(entry => {
          if (entry.type === type) {
            entry.pid = record.id
            _records.push(entry)
          }
        })
      }
    })

    // 返回身高记录
    return _records
  }

  async getMonthlyRecords (
    userId: number,
    year?: number,
    month?: number,
  ): Promise<Dayrecord[]> {
    // 如果 year 和 month 没有传入，则使用当前的年份和月份
    const currentDate = new Date()
    const finalYear = year ?? currentDate.getFullYear() // 使用提供的 year 或当前年份
    const finalMonth = month ?? currentDate.getMonth() + 1 // 使用提供的 month 或当前月份（注意：getMonth() 返回值从 0 开始）

    const startDate = new Date(finalYear, finalMonth - 1, 1) // 月份从 0 开始
    const endDate = new Date(finalYear, finalMonth, 0) // 当前月的最后一天

    return await this.dayRecordRepository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    } as any)
  }
}
