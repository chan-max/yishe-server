export default {
  https:true,
  // token密钥
  SECRET: 'test123456',
  // 数据库配置
  DATABASE_CONFIG: {
    type: 'mysql',
    host: '49.232.186.238', // 主机，默认为localhost
    port: 3306, // 端口号
    username: 'cz', // 用户名
    password: '666666', // 密码
    database: 'chinesemysticknowledge', //数据库名
    dateStrings: true, // 设置返回日期为字符串
    autoLoadEntities: true, // 使用这个配置自动导入entities
    synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
  },
  // redis配置
  REDIS: {
    port: 6379, //Redis 端口
    host: 'localhost', //Redis 域名
    db: 0,
    family: 4,
    password: '', //'Redis 访问密码'
  },
};
