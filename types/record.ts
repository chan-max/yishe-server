
/**
 * @最小记录单元格式
*/

enum RecordTypes {
    Unknown = 'unknown', // 未知类型

    // 生理行为（基本需求与身体活动）
    Sleep = 'sleep',           // 睡眠
    Eat = 'eat',               // 饮食
    Drink = 'drink',           // 饮水
    Exercise = 'exercise',     // 运动
    Rest = 'rest',             // 休息（非睡眠的短暂放松）
    Hygiene = 'hygiene',       // 个人卫生（洗澡、刷牙等）
    Work = 'work',             // 工作（体力或脑力劳动）
    Walk = 'walk',             // 步行
    Breathe = 'breathe',       // 呼吸（可用于记录冥想或呼吸练习）

    // 心理与情感活动
    Think = 'think',           // 思考（专注或发散性思维）
    Feel = 'feel',             // 感受情绪（快乐、悲伤等）
    Meditate = 'meditate',     // 冥想
    Socialize = 'socialize',   // 社交（与他人互动）
    Learn = 'learn',           // 学习（阅读、研究等）
    Create = 'create',         // 创造（写作、绘画等）
    Play = 'play',             // 娱乐（游戏、看电影等）
    Plan = 'plan',             // 计划（安排日程或目标）
    Reflect = 'reflect',       // 反思（回顾一天或自我审视）

    // 其他常见日常行为
    Travel = 'travel',         // 出行（开车、乘车等）
    Shop = 'shop',             // 购物
    Cook = 'cook',             // 烹饪
    Clean = 'clean',           // 清洁（打扫房间等）
    Communicate = 'communicate' // 沟通（电话、聊天等）
}

export interface RecordCommon {
    type: RecordTypes // 记录的类型
    createTime: string // 该条记录创建的时间
    raw: string // 用于生成该条记录的原始内容 ，用户提供的内容
}


export interface UnknownRecord extends RecordCommon {
    type:RecordTypes.Unknown,
}

export interface SleepRecord extends RecordCommon {
    type: RecordTypes.Sleep
    sleepStartTime: string // 睡眠开始时间
    sleepEndTime: string // 睡眠结束时间
    sleepQuality: number // 睡眠质量 0 - 10  0为极差 10为极佳
}

export type DayRecord = SleepRecord | UnknownRecord

