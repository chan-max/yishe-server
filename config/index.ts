/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-02 17:51:11
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-16 20:14:44
 * @FilePath: /design-server/config/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import localEnv from './env';
import prodEnv from './env.prod';

const parseEnv = {
  // development: localEnv,
  development: localEnv,
  production: prodEnv,
};


// 生产模式
const isProd = process.env.NODE_ENV === 'production';
console.log(`[config] 当前环境: ${isProd ? '生产' : '开发'} (NODE_ENV=${process.env.NODE_ENV})`);

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

export default parseEnv[isProd ? 'production' : 'development'];
