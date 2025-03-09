import { Injectable } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { RedisInstance } from 'src/cache/redis';
import { createPrompt_getPromptRecordTypeDetail, createPrompt_userInputToRecordType } from './prompt';
import { chatWithDeepSeek } from './request/deepseek';
import { PROMPT_GET_MARKDOWN_ARTICLE } from './prompt/article';
import { PROMPT_RECORD_TO_STRUCT } from './prompt/record';
import { toSafeJSON } from 'src/utils/common';


function generateFormattedTimestampKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

const UnknownRecord = {
  type:'unknown',
  message:'未被ai理解的记录,可能有它特别的含义吧~'
}


// 根据用户提示词获取基本信息
const GET_PROMPT_RECORD_BASIC_INFO_NAMESPACE = 'get-prompt-record-basic-info'

// 根据用户提示词获取完整信息
const GET_PROMPT_RECORD_DETAIL_NAMESPACE = 'get-prompt-record-detail'

@Injectable()
export class AiService {

  // 获取类型
  async getPromptRecordBasicInfo(prompt){


    let redis =  await RedisInstance.getInstance(15)

    let cache  = await redis.getItem(GET_PROMPT_RECORD_BASIC_INFO_NAMESPACE,prompt)

    if(cache){
      return JSON.parse(cache)
    }

    let actionPrompt = createPrompt_userInputToRecordType()
  
    let response =  await chatWithDeepSeek({
      system:actionPrompt,
      user:prompt
    })

    let jsonString = response.choices[0].message.content || JSON.stringify({
      type:'unknown', // 未被ai所理解的记录
    })

    let json = null
    try{
      json = JSON.parse(jsonString)
    }catch(e){
      json = JSON.parse(jsonString)
    }

    await redis.setItem(GET_PROMPT_RECORD_BASIC_INFO_NAMESPACE,prompt,jsonString)
    return json
  }


  /**
   * @think prompt 具有时效性，所以传递时要传入时间，将时间精确到时分秒
  */
  async getRecordStruct(prompt){
    let info = await this.getPromptRecordBasicInfo(prompt)
    let {type} = info

    if(type == 'unknown'){
      return UnknownRecord
    }

    let redis = await RedisInstance.getInstance(15)

    let cache = await redis.getItem(GET_PROMPT_RECORD_DETAIL_NAMESPACE,prompt)

    if(cache){
      return JSON.parse(cache)
    }
    
    let actionPrompt = createPrompt_getPromptRecordTypeDetail(type)

    if(!actionPrompt){
      return UnknownRecord
    }

    let response =  await chatWithDeepSeek({
      system:actionPrompt,
      user:prompt
    })

    let jsonString = response.choices[0].message.content
    
    let json = null
    try{
      json = JSON.parse(jsonString)
    }catch(e){
      json = JSON.parse(jsonString)
    }

    await redis.setItem(GET_PROMPT_RECORD_DETAIL_NAMESPACE,prompt,jsonString)
    return json
  }


  // 听过 ai 获取对应文章
  async getArticleByPrompt(prompt){
    let response = await chatWithDeepSeek({
      system:PROMPT_GET_MARKDOWN_ARTICLE,
      user:prompt
    })

    let content = response.choices[0].message.content
    return content
  }


  // 根据用户的记录，得到对应的结构
  async recordToStruct(prompt){

    const ns = 'record_to_struct';

    let redis = RedisInstance.getInstance(15);

    let cache = await redis.getItem(ns,prompt);

    if(cache){
      return toSafeJSON(cache)
    }

    let response = await chatWithDeepSeek({
      system:PROMPT_RECORD_TO_STRUCT,
      user:prompt
    })

    let content = response.choices[0].message.content

    redis.setItem(ns,prompt,content);

    return toSafeJSON(content);
  }
}
