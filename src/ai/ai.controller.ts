import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { chatWithAssistant } from './request/deepseek';
import { RedisInstance } from 'src/cache/redis';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }


  /**
   * @define 根据用户输入的记录生成对应的数据结构
   * */
  @Get('getRecordStruct')
  async getRecordStruct(@Req() req,@Query('prompt') prompt: string) {

      if(!prompt){
        return ''
      }

    let redis =  RedisInstance.getInstance(15)

    let cache =  await redis.getItem(prompt)

    if(cache){
      return {
        cotent:cache,
        cache:true
      }
    }else{
      await redis.setItem(prompt,prompt)
      return {
        content:``,
        cache : false
      }
    }

  }



  @Post()
  create(@Body() createAiDto: CreateAiDto) {
    return this.aiService.create(createAiDto);
  }
  @Get()
  findAll() {
    return this.aiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiDto: UpdateAiDto) {
    return this.aiService.update(+id, updateAiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiService.remove(+id);
  }
}
