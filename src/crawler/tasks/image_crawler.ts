import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export class ImageCrawler {
  private readonly outputDir: string;

  constructor(outputDir?: string) {
    // 如果没有指定输出目录，则使用默认目录
    this.outputDir = outputDir || path.join(process.cwd(), 'public', 'crawled');
    
    // 确保输出目录存在
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 爬取单个图片
   * @param url 图片URL
   * @returns 保存的图片路径
   */
  async crawlImage(url: string): Promise<string> {
    try {
      console.log(`开始爬取图片: ${url}`);
      
      // 下载图片
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer'
      });

      // 从URL中提取文件名，如果没有则使用时间戳
      const fileName = this.getFileNameFromUrl(url) || `image_${Date.now()}.jpg`;
      const filePath = path.join(this.outputDir, fileName);

      // 保存图片
      fs.writeFileSync(filePath, response.data);
      console.log(`图片已保存到: ${filePath}`);

      return filePath;
    } catch (error) {
      console.error('爬取图片失败:', error);
      throw error;
    }
  }

  /**
   * 批量爬取图片
   * @param urls 图片URL列表
   * @returns 爬取结果列表
   */
  async batchCrawl(urls: string[]): Promise<string[]> {
    console.log(`开始批量爬取 ${urls.length} 个图片`);
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

    console.log(`批量爬取完成，成功: ${results.filter(r => !r.startsWith('失败')).length} 个`);
    return results;
  }

  /**
   * 从URL中提取文件名
   * @param url 图片URL
   * @returns 文件名
   */
  private getFileNameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split('/').pop();
      
      // 如果文件名存在且包含扩展名，则返回
      if (fileName && fileName.includes('.')) {
        return fileName;
      }
      
      return null;
    } catch {
      return null;
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const crawler = new ImageCrawler();
  
  // 示例：爬取单个图片
  const url = process.argv[2];
  if (url) {
    crawler.crawlImage(url)
      .then(path => console.log('爬取成功:', path))
      .catch(error => console.error('爬取失败:', error));
  } else {
    console.log('请提供图片URL作为参数');
    console.log('使用示例: ts-node image_crawler.ts https://example.com/image.jpg');
  }
} 