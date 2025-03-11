import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CommonQueueService {
  constructor(
    @InjectQueue('commonQueue') private commonQueue: Queue,
    @InjectQueue('taskQueue') private taskQueue: Queue, // 新的任务队列
    @InjectQueue('aiQueue') private aiQueue: Queue, // 新的任务队列
  ) {}

  async enqueueCommonRequest(data: any) {
    await this.commonQueue.add(data);
  }

  async enqueueAddDayrecord(data: any) {
    await this.commonQueue.add('add-dayrecord',data);
  }

  async enqueueTaskRequest(data: any) {
    await this.taskQueue.add(data);
  }

  async enqueueAiRequest(data: any) {
    await this.aiQueue.add('dayrecord-prompt-parser',data, {
      attempts: 1,      // 最多重试 3 次
      backoff: 5000,    // 每次失败后等待 5 秒再重试
      removeOnFail: false, // 失败任务不会被自动删除
    });
  }
}
