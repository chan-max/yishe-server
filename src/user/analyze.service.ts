import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity' // 根据实际路径调整

@Injectable()
export class AnalyzeService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getUserAnalyze (id) {
    return {
      suggestedSleepTimeHour: 23, // 建议睡眠时间
      suggestedSleepTimeMinute: 32, // 建议睡眠时间
      suggestedSleepDuration: 8.2, // 建议睡眠时长

      comprehensiveScore: 88, // 综合评分
      healthScore: 88, // 健康评分
      moodScore: 88, // 心情评分
      luckScore: 88, // 运气评分

    }
  }
}
