import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { AiService } from 'src/ai/ai.service';
import { DayrecordService } from 'src/dayrecord/dayrecord.service';

@Processor('commonQueue') // 只处理 commonQueue
export class CommonProcessor {
  constructor(
    private dayrecordService: DayrecordService,
    private aiService: AiService
    ) {}

  @Process('add-dayrecord')
  async handleCommonRequest(job: Job) {
    console.log('使用 ai 分析用户记录提示词', job.data);
    
    let {id,cid,record} = job.data

    let struct = await this.aiService.recordToStruct(record.content);
    this.dayrecordService.updateRecordDetail(id,cid,{
      struct:struct
    })
    console.log('用户记录提示词分析完成');
  }
}

@Processor('taskQueue') // 只处理 taskQueue
export class TaskProcessor {
  @Process()
  async handleTaskRequest(job: Job) {
    console.log('Processing task request with data:', job.data);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 模拟更长的任务
    console.log('Task request completed');
  }
}

@Processor('aiQueue') // 监听 aiQueue 队列
export class AiProcessor {
  
  @Process('dayrecord-prompt-parser') // 处理 task1 类型的任务
  async handleAiTask1(job: Job) {
    console.log('Processing AI task1 with data: Dayrecord', job.data);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('Dayrecord completed');
  }

  @Process('todo') // 处理 task2 类型的任务
  async handleAiTask2(job: Job) {
    console.log('Processing AI task2 with data:', job.data);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('AI Task2 completed');
  }

}
