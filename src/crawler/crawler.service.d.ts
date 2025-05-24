/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 06:53:06
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-24 07:01:19
 * @FilePath: /design-server/src/crawler/crawler.service.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export declare class CrawlerService {
  startCrawling(url: string, depth: number): Promise<any>;
  getTaskStatus(taskId: string): Promise<any>;
  stopTask(taskId: string): Promise<any>;
  getResults(taskId: string, page: number, pageSize: number): Promise<any>;
  getTaskList(status?: string): Promise<any>;
}