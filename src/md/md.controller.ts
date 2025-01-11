import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common'
import { MdService } from './md.service'
import { Md } from './entities/md.entity'

@Controller('md')
export class MdController {
  constructor (private readonly mdService: MdService) {}

  // 创建一个新的记录
  @Post()
  createMd (@Body() body: { content: string; type: string }): Md {
    const { content, type } = body
    return this.mdService.createMd(content, type)
  }

  // 获取所有记录
  @Get()
  getAllMds (): Md[] {
    return this.mdService.getAllMds()
  }

  // 根据ID获取指定记录
  @Get(':id')
  getMdById (@Param('id') id: number): Md {
    return this.mdService.getMdById(id)
  }

  // 根据类型获取记录
  @Get('type/:type')
  getMdsByType (@Param('type') type: string): Md[] {
    return this.mdService.getMdsByType(type)
  }

  // 更新记录
  @Put(':id')
  updateMd (
    @Param('id') id: number,
    @Body() body: { content: string; type: string },
  ): Md {
    const { content, type } = body
    return this.mdService.updateMd(id, content, type)
  }
}
