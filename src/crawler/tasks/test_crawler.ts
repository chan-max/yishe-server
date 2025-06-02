import { ImageCrawler } from './image_crawler';

async function main() {
  const crawler = new ImageCrawler();
  
  // 测试单个图片爬取
  const testUrl = 'https://picsum.photos/200/300'; // 使用 picsum.photos 提供的测试图片
  try {
    const result = await crawler.crawlImage(testUrl);
    console.log('单个图片爬取成功:', result);
  } catch (error) {
    console.error('单个图片爬取失败:', error);
  }

  // 测试批量爬取
  const testUrls = [
    'https://picsum.photos/200/300',
    'https://picsum.photos/400/500',
    'https://picsum.photos/600/700'
  ];

  try {
    const results = await crawler.batchCrawl(testUrls);
    console.log('批量爬取结果:', results);
  } catch (error) {
    console.error('批量爬取失败:', error);
  }
}

// 运行测试
main().catch(console.error); 