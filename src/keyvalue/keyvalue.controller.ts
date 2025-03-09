// src/keyvalue/keyvalue.controller.ts
import { Controller, Get, Post, Delete, Query, Body } from '@nestjs/common';
import { KeyValueService } from './keyvalue.service';

@Controller('keyvalue')
export class KeyValueController {
  constructor(private readonly keyValueService: KeyValueService) {}

  /**
   * 设置键值对
   * @param namespace 命名空间
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒）
   */
  @Post('set')
  async setItem(
    @Body('namespace') namespace: string,
    @Body('key') key: string,
    @Body('value') value: any,
    @Body('ttl') ttl?: number,
  ) {
    await this.keyValueService.setItem(namespace, key, value, ttl);
    return { success: true };
  }

  /**
   * 获取键值对
   * @param namespace 命名空间
   * @param key 键
   */
  @Get('get')
  async getItem(
    @Query('namespace') namespace: string,
    @Query('key') key: string,
  ) {
    const value = await this.keyValueService.getItem(namespace, key);
    return { namespace, key, value };
  }

  /**
   * 删除键值对
   * @param namespace 命名空间
   * @param key 键
   */
  @Delete('remove')
  async removeItem(
    @Query('namespace') namespace: string,
    @Query('key') key: string,
  ) {
    await this.keyValueService.removeItem(namespace, key);
    return { success: true };
  }

  /**
   * 清空命名空间下的所有键值对
   * @param namespace 命名空间
   */
  @Delete('clear-namespace')
  async clearNamespace(@Query('namespace') namespace: string) {
    await this.keyValueService.clearNamespace(namespace);
    return { success: true };
  }

  /**
   * 清空所有键值对
   */
  @Delete('clear')
  async clear() {
    await this.keyValueService.clear();
    return { success: true };
  }
}