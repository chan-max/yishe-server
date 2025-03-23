import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common'

import { RecordSentence } from './entities/record_sentence.entity'
import { RecordSentenceService } from './record_sentence.service'

@Controller('record-sentence')
export class RecordSentenceController {
  constructor (private readonly recordSentenceService: RecordSentenceService) {}

  // ✅ 添加一句记录
  @Get('create')
  async create (@Query('content') content) {
    return this.recordSentenceService.create({
      content: content,
    })
  }

  // // ✅ 获取所有记录（分页）
  // @Get()
  // async findAll (
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  // ) {
  //   return this.recordSentenceService.findAll(page, limit)
  // }

  // ✅ 通过 ID 获取单条记录
  // @Get(':id')
  // async findOne (@Param('id') id: number) {
  //   return this.recordSentenceService.findOne(id)
  // }

  // ✅ 通过 ID 更新记录
  // @Put(':id')
  // async update (
  //   @Param('id') id: number,
  //   @Body() updateData: Partial<RecordSentence>,
  // ) {
  //   return this.recordSentenceService.update(id, updateData)
  // }

  // ✅ 通过 ID 删除记录
  // @Delete(':id')
  // async remove (@Param('id') id: number) {
  //   return this.recordSentenceService.remove(id)
  // }


  // ✅ 模糊搜索
  @Get('search')
  async search (@Query('query') query: string,@Query('limit') limit: string) {
    return this.recordSentenceService.search({
      query,
      limit:limit
    })
  }
}
