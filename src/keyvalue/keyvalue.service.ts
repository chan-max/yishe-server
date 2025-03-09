// src/keyvalue/keyvalue.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeyValue } from './entities/keyvalue.entity';

@Injectable()
export class KeyValueService {
  constructor(
    @InjectRepository(KeyValue)
    private readonly keyValueRepository: Repository<KeyValue>,
  ) {}

  /**
   * 设置键值对
   * @param namespace 命名空间
   * @param key 键
   * @param value 值（任意类型）
   * @param ttl 过期时间（秒）
   */
  async setItem(namespace: string, key: string, value: any, ttl?: number): Promise<void> {
    const expireAt = ttl ? new Date(Date.now() + ttl * 1000) : null;
    const valueString = JSON.stringify(value);

    await this.keyValueRepository.save({
      namespace,
      key,
      value: valueString,
      expireAt,
    });
  }

  /**
   * 获取键值对
   * @param namespace 命名空间
   * @param key 键
   * @returns 值（解析后的对象）或 null
   */
  async getItem(namespace: string, key: string): Promise<any> {
    const record = await this.keyValueRepository.findOne({
      where: { namespace, key },
    });

    if (record && (!record.expireAt || record.expireAt > new Date())) {
      return JSON.parse(record.value);
    }
    return null;
  }

  /**
   * 删除键值对
   * @param namespace 命名空间
   * @param key 键
   */
  async removeItem(namespace: string, key: string): Promise<void> {
    await this.keyValueRepository.delete({ namespace, key });
  }

  /**
   * 清空命名空间下的所有键值对
   * @param namespace 命名空间
   */
  async clearNamespace(namespace: string): Promise<void> {
    await this.keyValueRepository.delete({ namespace });
  }

  /**
   * 清空所有键值对
   */
  async clear(): Promise<void> {
    await this.keyValueRepository.clear();
  }
}