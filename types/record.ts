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
    type: RecordTypes; // 记录的类型
    createTime: string; // 该条记录创建的时间
    raw: string; // 用于生成该条记录的原始内容，用户提供的内容
}

export interface UnknownRecord extends RecordCommon {
    type: RecordTypes.Unknown;
}

export interface SleepRecord extends RecordCommon {
    type: RecordTypes.Sleep;
    sleepStartTime: string; // 睡眠开始时间
    sleepEndTime: string; // 睡眠结束时间
    sleepQuality: number; // 睡眠质量 (0-10)
    dream?: boolean; // 是否做梦
    wakeUpTimes?: number; // 夜间醒来次数
    notes?: string; // 备注（如失眠原因、梦境描述等）
}

export interface EatRecord extends RecordCommon {
    type: RecordTypes.Eat;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'; // 餐次类型
    foodItems: string[]; // 食物列表
    calories?: number; // 卡路里摄入量
    satisfaction?: number; // 满意度 (0-10)
    notes?: string; // 备注（如饮食偏好、过敏等）
}

export interface DrinkRecord extends RecordCommon {
    type: RecordTypes.Drink;
    drinkType: 'water' | 'tea' | 'coffee' | 'juice' | 'alcohol'; // 饮品类型
    volume: number; // 饮用量（毫升）
    notes?: string; // 备注（如饮品品牌、口味等）
}

export interface ExerciseRecord extends RecordCommon {
    type: RecordTypes.Exercise;
    exerciseType: 'running' | 'yoga' | 'weightlifting' | 'swimming' | 'cycling'; // 运动类型
    duration: number; // 运动时长（分钟）
    intensity?: 'low' | 'medium' | 'high'; // 运动强度
    caloriesBurned?: number; // 消耗的卡路里
    notes?: string; // 备注（如运动地点、感受等）
}

export interface RestRecord extends RecordCommon {
    type: RecordTypes.Rest;
    duration: number; // 休息时长（分钟）
    activity?: 'reading' | 'listening to music' | 'napping'; // 休息时的活动
    notes?: string; // 备注（如休息后的感受）
}

export interface HygieneRecord extends RecordCommon {
    type: RecordTypes.Hygiene;
    activity: 'shower' | 'brush teeth' | 'wash face' | 'shave'; // 卫生行为
    duration?: number; // 时长（分钟）
    notes?: string; // 备注（如使用的产品等）
}

export interface WorkRecord extends RecordCommon {
    type: RecordTypes.Work;
    workType: 'physical' | 'mental'; // 工作类型（体力或脑力）
    duration: number; // 工作时长（分钟）
    productivity?: number; // 工作效率 (0-10)
    notes?: string; // 备注（如工作内容、感受等）
}

export interface WalkRecord extends RecordCommon {
    type: RecordTypes.Walk;
    distance: number; // 步行距离（公里）
    duration: number; // 步行时长（分钟）
    steps?: number; // 步数
    notes?: string; // 备注（如步行路线、感受等）
}

export interface BreatheRecord extends RecordCommon {
    type: RecordTypes.Breathe;
    duration: number; // 呼吸练习时长（分钟）
    technique?: 'deep breathing' | 'box breathing' | 'meditative breathing'; // 呼吸技巧
    notes?: string; // 备注（如感受、专注度等）
}

export interface ThinkRecord extends RecordCommon {
    type: RecordTypes.Think;
    topic: string; // 思考的主题
    duration: number; // 思考时长（分钟）
    clarity?: number; // 思维清晰度 (0-10)
    notes?: string; // 备注（如思考结果、灵感等）
}

export interface FeelRecord extends RecordCommon {
    type: RecordTypes.Feel;
    emotion: 'happy' | 'sad' | 'angry' | 'anxious' | 'calm'; // 情绪类型
    intensity: number; // 情绪强度 (0-10)
    trigger?: string; // 触发情绪的事件
    notes?: string; // 备注（如情绪变化过程）
}

export interface MeditateRecord extends RecordCommon {
    type: RecordTypes.Meditate;
    duration: number; // 冥想时长（分钟）
    technique?: 'mindfulness' | 'transcendental' | 'guided'; // 冥想技巧
    notes?: string; // 备注（如冥想感受、专注度等）
}

export interface SocializeRecord extends RecordCommon {
    type: RecordTypes.Socialize;
    participants: string[]; // 参与者
    duration: number; // 社交时长（分钟）
    activity?: 'chat' | 'dinner' | 'game'; // 社交活动
    satisfaction?: number; // 满意度 (0-10)
    notes?: string; // 备注（如社交感受、话题等）
}

export interface LearnRecord extends RecordCommon {
    type: RecordTypes.Learn;
    topic: string; // 学习主题
    duration: number; // 学习时长（分钟）
    resource?: 'book' | 'video' | 'course'; // 学习资源
    progress?: number; // 学习进度 (0-100)
    notes?: string; // 备注（如学习心得、难点等）
}

export interface CreateRecord extends RecordCommon {
    type: RecordTypes.Create;
    activity: 'writing' | 'painting' | 'coding' | 'designing'; // 创造活动
    duration: number; // 创造时长（分钟）
    output?: string; // 产出内容（如文章标题、作品名称等）
    notes?: string; // 备注（如创作灵感、感受等）
}

export interface PlayRecord extends RecordCommon {
    type: RecordTypes.Play;
    activity: 'game' | 'movie' | 'music' | 'sport'; // 娱乐活动
    duration: number; // 娱乐时长（分钟）
    satisfaction?: number; // 满意度 (0-10)
    notes?: string; // 备注（如娱乐内容、感受等）
}

export interface PlanRecord extends RecordCommon {
    type: RecordTypes.Plan;
    goal: string; // 计划目标
    tasks: string[]; // 任务列表
    duration: number; // 计划时长（分钟）
    priority?: 'high' | 'medium' | 'low'; // 优先级
    notes?: string; // 备注（如计划调整、完成情况等）
}

export interface ReflectRecord extends RecordCommon {
    type: RecordTypes.Reflect;
    topic: string; // 反思主题
    duration: number; // 反思时长（分钟）
    insights?: string[]; // 反思的收获
    notes?: string; // 备注（如反思结论、改进计划等）
}

export interface TravelRecord extends RecordCommon {
    type: RecordTypes.Travel;
    mode: 'walk' | 'drive' | 'public transport' | 'bike'; // 出行方式
    distance: number; // 出行距离（公里）
    duration: number; // 出行时长（分钟）
    destination?: string; // 目的地
    notes?: string; // 备注（如出行感受、路况等）
}

export interface ShopRecord extends RecordCommon {
    type: RecordTypes.Shop;
    items: string[]; // 购买物品
    amount: number; // 花费金额
    location?: string; // 购物地点
    notes?: string; // 备注（如购物体验、需求等）
}

export interface CookRecord extends RecordCommon {
    type: RecordTypes.Cook;
    dish: string; // 菜品名称
    ingredients: string[]; // 食材列表
    duration: number; // 烹饪时长（分钟）
    satisfaction?: number; // 满意度 (0-10)
    notes?: string; // 备注（如烹饪心得、改进点等）
}

export interface CleanRecord extends RecordCommon {
    type: RecordTypes.Clean;
    area: 'kitchen' | 'bathroom' | 'living room' | 'bedroom'; // 清洁区域
    duration: number; // 清洁时长（分钟）
    notes?: string; // 备注（如清洁工具、感受等）
}

export interface CommunicateRecord extends RecordCommon {
    type: RecordTypes.Communicate;
    mode: 'phone' | 'text' | 'video call' | 'face to face'; // 沟通方式
    participants: string[]; // 参与者
    duration: number; // 沟通时长（分钟）
    topic?: string; // 沟通主题
    notes?: string; // 备注（如沟通感受、结论等）
}

export type DayRecord =
    | UnknownRecord
    | SleepRecord
    | EatRecord
    | DrinkRecord
    | ExerciseRecord
    | RestRecord
    | HygieneRecord
    | WorkRecord
    | WalkRecord
    | BreatheRecord
    | ThinkRecord
    | FeelRecord
    | MeditateRecord
    | SocializeRecord
    | LearnRecord
    | CreateRecord
    | PlayRecord
    | PlanRecord
    | ReflectRecord
    | TravelRecord
    | ShopRecord
    | CookRecord
    | CleanRecord
    | CommunicateRecord;