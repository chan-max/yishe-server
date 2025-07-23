import { Injectable } from '@nestjs/common';
import { ExampleCrawlerTask } from './tasks/example.task';
import { InjectRepository } from '@nestjs/typeorm';
import { CrawlerMaterial } from './entities/crawler-material.entity';
import { Repository } from 'typeorm';
import { CreateCrawlerMaterialDto } from './dto/create-crawler-material.dto';
import { UpdateCrawlerMaterialDto } from './dto/update-crawler-material.dto';
import { CosService } from 'src/common/cos.service';
import { StickerService } from 'src/sticker/sticker.service';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly exampleCrawler: ExampleCrawlerTask,
    @InjectRepository(CrawlerMaterial)
    private readonly crawlerMaterialRepository: Repository<CrawlerMaterial>,
    private readonly cosService: CosService, // 注入 COS 服务
    private readonly stickerService: StickerService, // 注入贴纸服务
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
    
    // 按名称搜索
    if (query.imageName) {
      qb.andWhere('material.name LIKE :name', { name: `%${query.imageName}%` });
    }
    
    // 时间范围过滤
    if (query.startTime && query.endTime) {
      // 前端传递的是毫秒级时间戳，需要转换为Date对象
      const startTimestamp = Number(query.startTime);
      const endTimestamp = Number(query.endTime);
      
      // 验证时间戳是否有效
      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        console.warn('Invalid timestamp format:', { startTime: query.startTime, endTime: query.endTime });
      } else {
        const startDate = new Date(startTimestamp);
        const endDate = new Date(endTimestamp);
        
        qb.andWhere('material.createTime BETWEEN :start AND :end', { 
          start: startDate, 
          end: endDate 
        });
      }
    } else if (query.startTime) {
      // 只有开始时间，查询从开始时间到现在
      const startTimestamp = Number(query.startTime);
      if (!isNaN(startTimestamp)) {
        const startDate = new Date(startTimestamp);
        qb.andWhere('material.createTime >= :start', { start: startDate });
      }
    } else if (query.endTime) {
      // 只有结束时间，查询从最早到结束时间
      const endTimestamp = Number(query.endTime);
      if (!isNaN(endTimestamp)) {
        const endDate = new Date(endTimestamp);
        qb.andWhere('material.createTime <= :end', { end: endDate });
      }
    }
    
    // 按创建时间倒序排列
    qb.orderBy('material.createTime', 'DESC');
    
    // 分页处理
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

  /**
   * 批量入库到贴纸
   * @param ids 爬虫素材ID列表
   * @param uploaderId 上传者ID
   * @returns 入库结果
   */
  async batchImportToSticker(ids: string[], uploaderId?: string) {
    const results = {
      success: [],
      failed: [],
      total: ids.length
    };

    // 查询所有素材
    const materials = await this.crawlerMaterialRepository.findByIds(ids);
    
    for (const material of materials) {
      try {
        // 构建贴纸数据
        const stickerData = {
          name: material.name || `素材_${material.id}`,
          description: material.description || '',
          keywords: material.keywords || '',
          url: material.url,
          suffix: material.suffix || '',
          uploaderId: uploaderId || material.uploaderId,
          isPublic: false,
          isTexture: false,
          group: '爬虫素材',
          meta: {
            source: 'crawler_material',
            originalId: material.id,
            originalSource: material.source
          }
        };

        // 创建贴纸
        const sticker = await this.stickerService.create(stickerData);
        
        // 入库成功后，删除对应的爬虫素材
        await this.crawlerMaterialRepository.delete(material.id);
        
        results.success.push({
          materialId: material.id,
          stickerId: sticker.id,
          name: sticker.name
        });
      } catch (error) {
        results.failed.push({
          materialId: material.id,
          error: error.message
        });
      }
    }

    return results;
  }
} 