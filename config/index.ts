import localEnv from './env';
import prodEnv from './env.prod';

const parseEnv = {
  // development: localEnv,
  development: localEnv,
  production: prodEnv,
};


// 生产模式
const isProd = true

export default parseEnv[isProd ? 'production' : 'development'];
