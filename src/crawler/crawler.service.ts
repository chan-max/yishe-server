import { Injectable } from '@nestjs/common';
import { ExampleCrawlerTask } from './tasks/example.task';
import { InjectRepository } from '@nestjs/typeorm';
import { CrawlerMaterial } from './entities/crawler-material.entity';
import { Repository } from 'typeorm';
import { CreateCrawlerMaterialDto } from './dto/create-crawler-material.dto';
import { UpdateCrawlerMaterialDto } from './dto/update-crawler-material.dto';
import { CosService } from 'src/common/cos.service';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly exampleCrawler: ExampleCrawlerTask,
    @InjectRepository(CrawlerMaterial)
    private readonly crawlerMaterialRepository: Repository<CrawlerMaterial>,
    private readonly cosService: CosService, // 注入 COS 服务
  ) {}

  /**
   * 爬取单个图片
   * @param url 图片URL
   * @returns 保存的图片路径
   */
  async crawlImage(url: string): Promise<string> {
    return this.exampleCrawler.crawlImage(url);
  }

  /**
   * 爬取网页内容
   * @param url 网页URL
   * @returns 网页内容
   */
  async crawlWebpage(url: string): Promise<string> {
    return this.exampleCrawler.crawlWebpage(url);
  }

  /**
   * 批量爬取图片
   * @param urls 图片URL列表
   * @returns 爬取结果列表
   */
  async batchCrawl(urls: string[]): Promise<string[]> {
    return this.exampleCrawler.batchCrawl(urls);
  }

  /**
   * 开始爬取指定网站
   * @param url 目标网站URL
   * @param depth 爬取深度
   */
  async startCrawling(url: string, depth: number) {
    // TODO: 实现爬虫逻辑
    return {
      taskId: Date.now().toString(),
      message: '爬虫任务已启动',
      url,
      depth,
    };
  }

  /**
   * 获取爬虫任务状态
   * @param taskId 任务ID
   */
  async getTaskStatus(taskId: string) {
    // TODO: 实现获取任务状态逻辑
    return {
      taskId,
      status: 'running',
      progress: 0.5,
      startTime: new Date().toISOString(),
    };
  }

  /**
   * 停止爬虫任务
   * @param taskId 任务ID
   */
  async stopTask(taskId: string) {
    // TODO: 实现停止任务逻辑
    return {
      taskId,
      message: '爬虫任务已停止',
    };
  }

  /**
   * 获取爬取结果
   * @param taskId 任务ID
   * @param page 页码
   * @param pageSize 每页数量
   */
  async getResults(taskId: string, page: number, pageSize: number) {
    // TODO: 实现获取结果逻辑
    return {
      taskId,
      page,
      pageSize,
      total: 100,
      data: [
        {
          url: 'https://example.com',
          title: '示例页面',
          content: '示例内容',
          crawlTime: new Date().toISOString(),
        },
      ],
    };
  }

  /**
   * 获取爬虫任务列表
   * @param status 任务状态过滤
   */
  async getTaskList(status?: string) {
    // TODO: 实现获取任务列表逻辑
    return {
      total: 1,
      data: [
        {
          taskId: '123456',
          url: 'https://example.com',
          status: 'running',
          startTime: new Date().toISOString(),
          progress: 0.5,
        },
      ],
    };
  }

  /**
   * 分页查询爬图素材
   */
  async getMaterialPage(query: any) {
    const qb = this.crawlerMaterialRepository.createQueryBuilder('material');
    if (query.imageName) {
      qb.andWhere('material.name LIKE :name', { name: `%${query.imageName}%` });
    }
    if (query.startTime && query.endTime) {
      qb.andWhere('material.createTime BETWEEN :start AND :end', { start: query.startTime, end: query.endTime });
    }
    qb.orderBy('material.createTime', 'DESC');
    const page = Number(query.currentPage) || 1;
    const pageSize = Number(query.pageSize) || 20;
    qb.skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  /**
   * 查询单个素材
   */
  async findMaterialById(id: string) {
    return this.crawlerMaterialRepository.findOne({ where: { id } });
  }

  /**
   * 更新素材
   */
  async updateMaterial(dto: UpdateCrawlerMaterialDto) {
    const entity = await this.crawlerMaterialRepository.findOne({ where: { id: dto.id } });
    if (!entity) throw new Error('素材不存在');
    Object.assign(entity, dto);
    return this.crawlerMaterialRepository.save(entity);
  }

  /**
   * 删除素材
   */
  async deleteMaterial(ids: string[] | string) {
    const idArr = Array.isArray(ids) ? ids : [ids];
    // 先查出所有素材，删除 COS 文件
    const materials = await this.crawlerMaterialRepository.findByIds(idArr);
    for (const material of materials) {
      if (material.url) {
        try {
          await this.cosService.deleteFile(material.url);
        } catch (e) {
          // 记录日志但不中断
          console.warn('删除COS文件失败:', material.url, e.message);
        }
      }
    }
    return this.crawlerMaterialRepository.delete(idArr);
  }

  /**
   * 新增素材
   */
  async createMaterial(dto: CreateCrawlerMaterialDto) {
    const entity = this.crawlerMaterialRepository.create(dto);
    return this.crawlerMaterialRepository.save(entity);
  }
} 