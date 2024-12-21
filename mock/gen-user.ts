import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity'; // 根据实际路径调整
import * as faker from 'faker';
import { AppDataSource } from './data-source'; // 根据项目的 TypeORM 配置调整

function randomNormal(mean: number, stdDev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // 保证u不为0
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
}

async function seedUsers() {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        const userRepository = AppDataSource.getRepository(User);

        console.log('Seeding users...');

        const today = new Date();
        const minAge = 5;
        const maxAge = 90;
        const meanAge = 30;    // 平均年龄30岁
        const ageStdDev = 15;  // 标准差15岁

        for (let i = 0; i < 500; i++) {
            const user = new User();

            user.username = faker.internet.userName();
            user.name = faker.name.findName();
            user.phone = faker.phone.phoneNumber('1##########');
            user.gender = Math.random() < 0.5 ? 1 : 0;

            // 年龄生成
            let age: number;
            do {
                age = Math.round(randomNormal(meanAge, ageStdDev));
            } while (age < minAge || age > maxAge);

            // 生日计算
            const birthYear = today.getFullYear() - age;
            const birthMonth = Math.floor(Math.random() * 12);
            const birthDay = Math.floor(Math.random() * 28) + 1;
            user.birthday = new Date(birthYear, birthMonth, birthDay);

            // 身高体重生成规则
            let heightMean, heightStdDev, weightMean, weightStdDev;

            if (age < 13) {
                // 儿童
                heightMean = user.gender === 1 ? 130 : 125; // 男孩略高
                heightStdDev = 10;
                weightMean = user.gender === 1 ? 30 : 28;  // 男孩略重
                weightStdDev = 5;
            } else if (age < 60) {
                // 成年人
                heightMean = user.gender === 1 ? 175 : 162; // 男性更高
                heightStdDev = 7;
                weightMean = user.gender === 1 ? 70 : 58;  // 男性更重
                weightStdDev = 10;
            } else {
                // 老年人
                heightMean = user.gender === 1 ? 170 : 158; // 男性略高
                heightStdDev = 5;
                weightMean = user.gender === 1 ? 68 : 56;  // 男性略重
                weightStdDev = 8;
            }

            // 生成身高和体重
            user.height = `${Math.max(
                Math.round(randomNormal(heightMean, heightStdDev)),
                100
            )}`;
            user.weight = `${Math.max(
                Math.round(randomNormal(weightMean, weightStdDev)),
                20
            )}`;

            // 额外增加一些特殊数据点
            if (Math.random() < 0.05) {
                user.height = `${Math.round(user.gender === 1 ? 210 : 190)}`; // 极高
                user.weight = `${Math.round(user.gender === 1 ? 120 : 100)}`; // 极重
            } else if (Math.random() < 0.05) {
                user.height = `${Math.round(user.gender === 1 ? 140 : 130)}`; // 极矮
                user.weight = `${Math.round(user.gender === 1 ? 40 : 35)}`;  // 极轻
            }

            user.isAdmin = false;
            user.password = 'password123';
            user.avatar = faker.internet.avatar();
            user.email = faker.internet.email();

            await userRepository.save(user);
        }

        console.log('User seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        AppDataSource.destroy();
    }
}

seedUsers();
