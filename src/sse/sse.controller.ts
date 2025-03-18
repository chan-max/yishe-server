import { Controller, Get, Query, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { SseService } from './sse.service'

@Controller('sse')
export class SseController {
  constructor (private readonly sseService: SseService) {}

  @Get('events')
  async events (
    @Query('userId') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // 监听客户端断开连接
    req.on('close', () => {
      this.sseService.userOffline(userId)
    })

    this.sseService.userOnline(userId)

    // 监听 SSE 事件
    this.sseService.events.subscribe(event => {
      res.write(`event: ${event.type}\n`)
      res.write(`data: ${JSON.stringify(event.data)}\n\n`)
    })
  }
}
