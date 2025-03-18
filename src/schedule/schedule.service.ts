// my-task.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  @Cron(CronExpression.EVERY_2ND_HOUR_FROM_1AM_THROUGH_11PM)
  handleCron() {
    // console.log('Cron task called every 10 seconds');
  }
}

