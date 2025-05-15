import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { AiService } from 'src/ai/ai.service';
import { UserService } from 'src/user/user.service';

@Processor('commonQueue') // 只处理 commonQueue
export class CommonProcessor {
  constructor(
    private aiService: AiService,
    private userService: UserService,
    ) {}
}
