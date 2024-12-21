import { DataSource } from 'typeorm';
import { Dayrecord } from 'src/dayrecord/entities/dayrecord.entity'; // 根据实际路径调整
import { AppDataSource } from './data-source'; // 根据项目的 TypeORM 配置调整
import * as faker from 'faker';
import { v4 as uuidv4 } from 'uuid';

// 随机生成一个日期范围内的时间
function getRandomDate(start: Date, end: Date): Date {
    const diff = end.getTime() - start.getTime();
    const randomTime = start.getTime() + Math.random() * diff;
    return new Date(randomTime);
}

// 生成随机睡眠时长，单位：小时
function getRandomSleepDuration(): number {
    // 模拟 5 到 12 小时的睡眠时长
    return Math.random() * (12 - 5) + 5;
}

// 模拟睡眠类型（夜间睡眠、午睡或懒觉）
function getSleepType(): 'night' | 'nap' | 'lazy' {
    const rand = Math.random();
    if (rand < 0.7) {
        return 'night';  // 70%概率是夜间睡眠
    } else if (rand < 0.85) {
        return 'nap';    // 15%概率是午睡
    } else {
        return 'lazy';   // 15%概率是懒觉
    }
}

// 检查睡眠记录是否与现有记录时间重叠
function isOverlapping(existingRecords: any[], newStartTime: Date, newEndTime: Date): boolean {
    return existingRecords.some((record) => {
        const existingStart = new Date(record.startTime);
        const existingEnd = new Date(record.endTime);
        return (newStartTime < existingEnd && newEndTime > existingStart); // 检查时间是否重叠
    });
}

async function seedDayRecords() {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        const dayRecordRepository = AppDataSource.getRepository(Dayrecord);

        console.log('Seeding day records...');

        // 获取所有的日常记录
        const dayRecords = await dayRecordRepository.find();

        // 逐个处理日常记录，添加睡眠记录
        for (const dayRecord of dayRecords) {
            // 如果 `record` 为空或未定义，则初始化为一个空数组
            if (!dayRecord.record || !Array.isArray(dayRecord.record)) {
                dayRecord.record = [];
            }

            // 决定是否为该记录生成睡眠记录
            const shouldRecordSleep = Math.random() < 0.9; // 90%的概率生成记录

            if (shouldRecordSleep) {
                // 随机决定睡眠开始时间和结束时间
                let startTime: Date;
                let endTime: Date;

                const sleepType = getSleepType();

                // 获取现有记录的睡眠时间范围
                const existingRecords = dayRecord.record || [];

                let sleepRecorded = false;
                let attempts = 0;

                // 避免时间重叠的循环，最多尝试 5 次
                while (!sleepRecorded && attempts < 5) {
                    attempts++;

                    if (sleepType === 'night') {
                        // 夜间睡眠：从前一天晚上到今天早上
                        startTime = getRandomDate(new Date(dayRecord.date + 'T22:00:00'), new Date(dayRecord.date + 'T23:59:59')); // 昨晚10点到今日凌晨
                        const sleepDuration = getRandomSleepDuration(); // 随机睡眠时长
                        endTime = new Date(startTime.getTime() + sleepDuration * 60 * 60 * 1000); // 睡眠结束时间
                    } else if (sleepType === 'nap' && Math.random() < 0.5) {
                        // 午睡：从今天中午到下午
                        startTime = getRandomDate(new Date(dayRecord.date + 'T12:00:00'), new Date(dayRecord.date + 'T15:00:00')); // 午睡时间：中午12点到下午3点
                        const sleepDuration = getRandomSleepDuration(); // 随机睡眠时长
                        endTime = new Date(startTime.getTime() + sleepDuration * 60 * 60 * 1000); // 睡眠结束时间
                    } else {
                        // 懒觉：从今天早上到中午
                        startTime = getRandomDate(new Date(dayRecord.date + 'T06:00:00'), new Date(dayRecord.date + 'T10:00:00')); // 懒觉时间：早上6点到中午10点
                        const sleepDuration = getRandomSleepDuration(); // 随机睡眠时长
                        endTime = new Date(startTime.getTime() + sleepDuration * 60 * 60 * 1000); // 睡眠结束时间
                    }

                    // 检查是否与已有记录时间重叠
                    if (!isOverlapping(existingRecords, startTime, endTime)) {
                        // 如果没有重叠，则认为记录有效
                        sleepRecorded = true;
                    }
                }

                if (sleepRecorded) {
                    // 生成睡眠记录
                    const sleepRecord = {
                        id: uuidv4(), // 唯一UUID
                        type: 'sleep', // 类型为睡眠
                        startTime: startTime.toISOString(),
                        endTime: endTime.toISOString(),
                        createTime: new Date().toISOString(),
                        updateTime: new Date().toISOString(),
                    };

                    // 将睡眠记录添加到现有记录的 `record` 数组中
                    dayRecord.record.push(sleepRecord);

                    // 保存更新后的记录
                    await dayRecordRepository.save(dayRecord);
                }
            }
        }

        console.log('Day records seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding day records:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

seedDayRecords();
