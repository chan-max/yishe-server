import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // 根据实际路径调整

@Injectable()
export class AnalyzeService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    /**
     * @method 获取各年龄段的人数
    */
    async getAgeGenderDistribution(): Promise<
        { age: number; year: number; maleCount: number; femaleCount: number }[]
    > {
        // 查询数据库中的年龄、出生年份和性别统计
        const rawData = await this.userRepository
            .createQueryBuilder('user')
            .select(
                `TIMESTAMPDIFF(YEAR, user.birthday, CURDATE()) AS age`, // 计算年龄
            )
            .addSelect(
                `YEAR(user.birthday) AS year`, // 提取出生年份
            )
            .addSelect(
                `SUM(CASE WHEN user.gender = 1 THEN 1 ELSE 0 END) AS maleCount`, // 统计男性人数
            )
            .addSelect(
                `SUM(CASE WHEN user.gender = 0 THEN 1 ELSE 0 END) AS femaleCount`, // 统计女性人数
            )
            .where('user.birthday IS NOT NULL') // 确保生日字段非空
            .andWhere('TIMESTAMPDIFF(YEAR, user.birthday, CURDATE()) BETWEEN 1 AND 100') // 限制在 1-100 岁范围
            .groupBy('age, year') // 按年龄和年份分组
            .orderBy('age', 'ASC') // 按年龄排序
            .addOrderBy('year', 'ASC') // 按年份排序
            .getRawMany();

        // 转换为标准返回格式
        const result: { age: number; year: number; maleCount: number; femaleCount: number }[] = [];

        // 遍历1到100岁的范围并初始化数据
        for (let age = 1; age <= 100; age++) {
            const year = new Date().getFullYear() - age; // 计算出生年份
            const existingData = rawData.find(
                (row) => parseInt(row.age, 10) === age && parseInt(row.year, 10) === year,
            );

            // 如果有统计数据，直接使用；否则初始化为0
            result.push({
                age,
                year,
                maleCount: existingData ? parseInt(existingData.maleCount, 10) : 0,
                femaleCount: existingData ? parseInt(existingData.femaleCount, 10) : 0,
            });
        }

        return result;
    }


    /**
 * @method 获取各年龄段的平均身高
 */
    /**
     * @method 获取各年龄段的平均身高（总体、男性、女性）以及全局平均身高
     */
    async getHeightDistribution(): Promise<{
        list: {
            age: number;
            year: number;
            maleAverageHeight: number;
            femaleAverageHeight: number;
            overallAverageHeight: number;
        }[];
        overallHeight: {
            allAverageHeight: number;
            allMaleAverageHeight: number;
            allFemaleAverageHeight: number;
        };
    }> {
        // 查询各年龄段的平均身高
        const rawData = await this.userRepository
            .createQueryBuilder('user')
            .select(
                `TIMESTAMPDIFF(YEAR, user.birthday, CURDATE()) AS age`, // 计算年龄
            )
            .addSelect(
                `YEAR(user.birthday) AS year`, // 提取出生年份
            )
            .addSelect(
                `AVG(CASE WHEN user.gender = 1 THEN CAST(user.height AS DECIMAL(10, 2)) ELSE NULL END) AS maleAverageHeight`, // 计算男性平均身高
            )
            .addSelect(
                `AVG(CASE WHEN user.gender = 0 THEN CAST(user.height AS DECIMAL(10, 2)) ELSE NULL END) AS femaleAverageHeight`, // 计算女性平均身高
            )
            .addSelect(
                `AVG(CAST(user.height AS DECIMAL(10, 2))) AS overallAverageHeight`, // 计算总体平均身高
            )
            .where('user.birthday IS NOT NULL') // 确保生日字段非空
            .andWhere('user.height IS NOT NULL') // 确保身高字段非空
            .andWhere('TIMESTAMPDIFF(YEAR, user.birthday, CURDATE()) BETWEEN 1 AND 100') // 限制在 1-100 岁范围
            .groupBy('age, year') // 按年龄和年份分组
            .orderBy('age', 'ASC') // 按年龄排序
            .addOrderBy('year', 'ASC') // 按年份排序
            .getRawMany();

        // 查询全局的平均身高
        const globalData = await this.userRepository
            .createQueryBuilder('user')
            .select(
                `AVG(CAST(user.height AS DECIMAL(10, 2))) AS allAverageHeight`, // 全部平均身高
            )
            .addSelect(
                `AVG(CASE WHEN user.gender = 1 THEN CAST(user.height AS DECIMAL(10, 2)) ELSE NULL END) AS allMaleAverageHeight`, // 所有男性平均身高
            )
            .addSelect(
                `AVG(CASE WHEN user.gender = 0 THEN CAST(user.height AS DECIMAL(10, 2)) ELSE NULL END) AS allFemaleAverageHeight`, // 所有女性平均身高
            )
            .where('user.height IS NOT NULL') // 确保身高字段非空
            .andWhere('user.birthday IS NOT NULL') // 确保生日字段非空
            .getRawOne();

        // 初始化返回结果
        const list: {
            age: number;
            year: number;
            maleAverageHeight: number;
            femaleAverageHeight: number;
            overallAverageHeight: number;
        }[] = [];

        for (let age = 1; age <= 100; age++) {
            const year = new Date().getFullYear() - age; // 计算出生年份
            const existingData = rawData.find(
                (row) => parseInt(row.age, 10) === age && parseInt(row.year, 10) === year,
            );

            // 如果有统计数据，直接使用；否则初始化为0
            list.push({
                age,
                year,
                maleAverageHeight: existingData ? parseFloat(existingData.maleAverageHeight) || 0 : 0,
                femaleAverageHeight: existingData ? parseFloat(existingData.femaleAverageHeight) || 0 : 0,
                overallAverageHeight: existingData ? parseFloat(existingData.overallAverageHeight) || 0 : 0,
            });
        }

        // 构造返回结果
        return {
            list,
            overallHeight: {
                allAverageHeight: globalData ? parseFloat(globalData.allAverageHeight) || 0 : 0,
                allMaleAverageHeight: globalData ? parseFloat(globalData.allMaleAverageHeight) || 0 : 0,
                allFemaleAverageHeight: globalData ? parseFloat(globalData.allFemaleAverageHeight) || 0 : 0,
            },
        };
    }





}
