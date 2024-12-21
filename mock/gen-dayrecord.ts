import { DataSource } from 'typeorm';
import * as faker from 'faker';
import { User } from 'src/user/entities/user.entity';
import { Dayrecord } from 'src/dayrecord/entities/dayrecord.entity';
import { AppDataSource } from './data-source'; // 根据项目的 TypeORM 配置调整

async function seedDayRecords() {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        const userRepository = AppDataSource.getRepository(User);
        const dayRecordRepository = AppDataSource.getRepository(Dayrecord);

        console.log('Seeding day records...');

        const users = await userRepository.find(); // 获取所有用户
        const today = new Date();

        // 遍历所有用户，为每个用户生成过去一年的记录
        for (const user of users) {
            for (let i = 0; i < 30; i++) {
                if (Math.random() < 0.2) continue; // 增加随机性，20% 的日期不生成记录

                const recordDate = new Date(today);
                recordDate.setDate(today.getDate() - i); // 生成过去一年的日期
                const dateString = recordDate.toISOString().split('T')[0];

                // 检查是否已经有记录
                const existingRecord = await dayRecordRepository.findOne({
                    where: { user: { id: user.id }, date: dateString },
                });

                if (!existingRecord) {
                    // 创建记录
                    const dayRecord = dayRecordRepository.create({
                        user,
                        date: dateString,
                    });

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
