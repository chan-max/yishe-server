import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Dayrecord } from '../../entities/dayrecord.entity';
import { User } from 'src/user/entities/user.entity';
import { BasicService } from 'src/common/basicService';

@Injectable()
export class SleepService extends BasicService {
    constructor(
        @InjectRepository(Dayrecord)
        private readonly dayRecordRepository: Repository<Dayrecord>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super()
    }


    // 获取睡眠日志
    async getSleepDashboard(userId) {
        return {

        }
    }

}
