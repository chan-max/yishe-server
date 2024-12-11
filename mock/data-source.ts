import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity'; // 调整为实际路径

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '666666z.',
    database: 'lif',
    entities: [User],
    synchronize: true, // 根据需求是否启用
    logging: true,
});
