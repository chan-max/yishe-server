import localEnv from './env';
import prodEnv from './env.prod';

const parseEnv = {
  development: localEnv,
  production: prodEnv,
};

const isProd = false

export default parseEnv[process.env.NODE_ENV || 'development'];
