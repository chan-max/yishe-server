import Redis from 'ioredis';
import envConfig from '../../config';

export class RedisInstance extends Redis {
  private static instance: RedisInstance;
  private db: number;

  /**
   * @Description: 构造函数
   * @param db {Number} 数据库编号，默认为0
   */
  private constructor(db: number = 0) {
    super({ ...envConfig.REDIS, db });
    this.db = db;
  }

  /**
   * @Description: 获取Redis实例（单例模式）
   * @param db {Number} 数据库编号，默认为0
   * @return: RedisInstance
   */
  public static getInstance(db: number = 0): RedisInstance {
    return new RedisInstance(db);
    if (!RedisInstance.instance) {
      RedisInstance.instance = new RedisInstance(db);
    }
    return RedisInstance.instance;
  }

  /**
   * @Description: 生成带命名空间的key
   * @param namespace {String} 命名空间
   * @param key {String} 原始key
   * @return: 带命名空间的key
   */
  private getNamespacedKey(namespace: string, key: string): string {
    return `${namespace}:${key}`;
  }

  /**
   * @Description: 封装设置redis缓存的方法
   * @param namespace {String} 命名空间
   * @param key {String} key值
   * @param value {any} key的值
   * @param seconds {Number} 过期时间
   * @return: Promise<any>
   */
  public async setItem(
    namespace: string,
    key: string,
    value: any,
    seconds?: number,
  ): Promise<any> {
    const namespacedKey = this.getNamespacedKey(namespace, key);
    value = JSON.stringify(value);
    if (!seconds) {
      await this.set(namespacedKey, value);
    } else {
      await this.set(namespacedKey, value, 'EX', seconds);
    }
  }

  /**
   * @Description: 获取redis缓存中的值
   * @param namespace {String} 命名空间
   * @param key {String}
   * @return: Promise<any>
   */
  public async getItem(namespace: string, key: string): Promise<any> {
    const namespacedKey = this.getNamespacedKey(namespace, key);
    const data = await this.get(namespacedKey);
    if (data) return JSON.parse(data);
    return null;
  }

  /**
   * @Description: 根据key删除redis缓存数据
   * @param namespace {String} 命名空间
   * @param key {String}
   * @return: Promise<any>
   */
  public async removeItem(namespace: string, key: string): Promise<any> {
    const namespacedKey = this.getNamespacedKey(namespace, key);
    return await this.del(namespacedKey);
  }

  /**
   * @Description: 清空指定命名空间下的所有缓存
   * @param namespace {String} 命名空间
   * @return: Promise<any>
   */
  public async clearNamespace(namespace: string): Promise<any> {
    const keys = await this.keys(`${namespace}:*`);
    if (keys.length > 0) {
      return await this.del(...keys);
    }
    return null;
  }

  /**
   * @Description: 清空整个redis的缓存
   * @return: Promise<any>
   */
  public async clear(): Promise<any> {
    return await this.flushall();
  }
}

export async function getRedisCache(namespace,target,db = 15){
    let redis = RedisInstance.getInstance(db);

    let cache = await redis.getItem(namespace,target)

    if(!cache){
      return cache
    }

    return null
} 