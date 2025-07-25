/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:12:19
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-04 07:26:40
 * @FilePath: /design-server/config/env.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  https:true,
  // token密钥
  SECRET: 'test123456',
  // 数据库配置
  DATABASE_CONFIG: {
    type: 'mysql',
    host: '49.232.186.238', // 主机，默认为localhost
    port: 3306, // 端口号
    username: 'root', // 用户名
    password: '666666', // 密码
    database: 's1', //数据库名
    dateStrings: true, // 设置返回日期为字符串
    autoLoadEntities: true, // 使用这个配置自动导入entities
    synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
  },
  
  // redis配置

  REDIS: {
    port: 6379, //Redis 端口
    host: '49.232.186.238', //Redis 域名
    // host: 'localhost', //Redis 域名
    db: 0,
    family: 4,
    password: '666666', //'Redis 访问密码'
    lazyConnect:false,
  },

  // 飞书机器人配置
  FEISHU: {
    DESIGN: 'https://open.feishu.cn/open-apis/bot/v2/hook/d3e5b95b-3d80-4d68-bd01-9bc11ea8c812', // 设计相关通知
    SYSTEM: process.env.FEISHU_WEBHOOK_URL_SYSTEM || '', // 系统相关通知
  },
  // COS配置
  COS: {
    SecretId: 'AKIDMdmaMD0uiNwkVH0gTJFKXaXJyV4hHmAL',
    SecretKey: 'HPdigqyzpgTNICCQnK0ZF6zrrpkbL4un',
    Bucket: '1s-1257307499',
    Region: 'ap-beijing'
  },
};