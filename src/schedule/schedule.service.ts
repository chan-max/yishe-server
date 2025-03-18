// my-task.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Cron task called every 10 seconds');
  }
}

