
/**
 * @description 根据用户提供的提示词分辨出来是那种 记录类型
*/

import { PROMPT_GET_SLEEP_RECORD_DETAIL } from "./sleep";

export function createPrompt_userInputToRecordType() {
    return `
    你是一个数据分析助手，负责从用户输入中识别出日常活动的类型。以下是任务要求：
    1. **输入**：用户输入是一段描述日常活动的文本。
    2. **输出**:返回一个json结构,其中只有一个type字段,表示识别出的活动类型。关键字必须是以下枚举值之一, 直接返回json字符串即可 , 开头和结尾一定要是花括号，不需要任何前缀和后缀，我希望可以直接解析:
    - 'sleep': 睡眠
    - 'eat': 饮食
    - 'drink': 饮水
    - 'exercise': 运动
    - 'rest': 休息
    - 'hygiene': 个人卫生
    - 'work': 工作
    - 'walk': 步行
    - 'breathe': 呼吸
    - 'think': 思考
    - 'feel': 感受情绪
    - 'meditate': 冥想
    - 'socialize': 社交
    - 'learn': 学习
    - 'create': 创造
    - 'play': 娱乐
    - 'plan': 计划
    - 'reflect': 反思
    - 'travel': 出行
    - 'shop': 购物
    - 'cook': 烹饪
    - 'clean': 清洁
    - 'communicate': 沟通
    - 'unknown': 未知类型
    3. **示例**:
    - 昨晚睡了8小时,感觉还不错
    - {"type":"sleep"}
    请分析以下用户输入，并返回识别出的活动类型关键字：
    `
}

export function createPrompt_getPromptRecordTypeDetail(recordType){
    switch (recordType){
        case "sleep" :
            return PROMPT_GET_SLEEP_RECORD_DETAIL;
    }
}