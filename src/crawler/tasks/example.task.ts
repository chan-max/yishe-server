/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-26 05:47:29
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-26 05:51:57
 * @FilePath: /design-server/src/crawler/tasks/example.task.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExampleCrawlerTask {
  private readonly outputDir = path.join(process.cwd(), 'public', 'crawled');

  constructor() {
    // 确保输出目录存在
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 爬取图片示例
   * @param url 图片URL
   * @returns 保存的图片路径
   */
  async crawlImage(url: string): Promise<string> {
    try {
      // 下载图片
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer'
      });

      // 生成文件名
      const fileName = `image_${Date.now()}.jpg`;
      const filePath = path.join(this.outputDir, fileName);

      // 保存图片
      fs.writeFileSync(filePath, response.data);

      return filePath;
    } catch (error) {
      console.error('爬取图片失败:', error);
      throw error;
    }
  }

  /**
   * 爬取网页内容示例
   * @param url 网页URL
   * @returns 网页内容
   */
  async crawlWebpage(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('爬取网页失败:', error);
      throw error;
    }
  }

  /**
   * 批量爬取示例
   * @param urls 要爬取的URL列表
   * @returns 爬取结果列表
   */
  async batchCrawl(urls: string[]): Promise<string[]> {
    const results: string[] = [];
    
    for (const url of urls) {
      try {
        const result = await this.crawlImage(url);
        results.push(result);
      } catch (error) {
        console.error(`爬取 ${url} 失败:`, error);
        results.push(`失败: ${url}`);
      }
    }

    return results;
  }
} 