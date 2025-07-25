import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';
import { InjectRepository, } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';
import { BasicService } from 'src/common/basicService';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CosService } from 'src/common/cos.service';
import { AiService } from '../ai/ai.service';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import * as imghash from 'imghash'
import axios from 'axios';
import * as os from 'os';

@Injectable()
export class StickerService extends BasicService {

  constructor(
    @InjectRepository(Sticker)
    private stickerRepository,
    private cosService: CosService,
    private aiService: AiService,
  ) {
    super()
  }

  /**
   * 计算图片的感知哈希
   * @param url 图片地址
   * @param ext 文件后缀，可选
   * @returns Promise<string> phash
   */
  async calculatePhashByUrl(url: string, ext: string = 'jpg'): Promise<string> {
    let phash = '';
    const isSvg = ext.toLowerCase() === 'svg';
    const finalExt = isSvg ? 'png' : ext;
    const tempPath = path.join(os.tmpdir(), `sticker_phash_${Date.now()}.${finalExt}`);
    
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      
      if (isSvg) {
        // SVG需要转换为PNG
        const svgData = Buffer.from(res.data);
        await sharp(svgData).png().toFile(tempPath);
      } else {
        // 非SVG直接写入文件
        fs.writeFileSync(tempPath, res.data);
      }
      
      phash = await imghash.hash(tempPath, 12, 'hex');
      fs.unlinkSync(tempPath);
    } catch (e) {
      phash = '';
      console.error('[phash计算失败]', e);
      console.log('url', url);
      // 清理临时文件
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
    return phash;
  }

  /* 创建 */
  async create(post) {
    let phash = '';
    if (post.url && !post.phash) {
      phash = await this.calculatePhashByUrl(post.url, post.suffix || 'jpg');
    }
    post.phash = phash;
    return await this.stickerRepository.save(post);
  }

  findAll() {
    return `This action returns all sticker`;
  }

  async findOne(id: number) {
    return await this.stickerRepository.findOne({ id });
  }

  async update(post) {
    const item = await this.stickerRepository.findOne(post.id);

    Object.assign(item, post);

    return this.stickerRepository.save(item);

    // return await this.stickerRepository.update(post.id, post);
  }

  async remove(ids: string | string[]) {
    // 确保 ids 是数组
    const idArray = Array.isArray(ids) ? ids : [ids];
    
    // 查找所有要删除的贴纸
    const stickers = await this.stickerRepository.findByIds(idArray);
    if (!stickers.length) {
      throw new Error('未找到要删除的贴纸');
    }

  
    // 删除 COS 上的文件
    for (const sticker of stickers) {

      if (sticker.url) {
        await this.cosService.deleteFile(sticker.url);
      }
    }

    // 删除数据库记录
    return this.stickerRepository.delete(idArray);
  }

  async getPage(post, userInfo) {

    if (!userInfo) {
      throw new UnauthorizedException('请登录');
    }

    const where = null
    const queryBuilderName = 'Sticker'

    function queryBuilderHook(qb) {
      qb
        .leftJoinAndSelect('Sticker.uploader', 'user')
        .select([
          "Sticker.id",
          "Sticker.name",
          "Sticker.createTime",
          "Sticker.updateTime",
          "Sticker.description",
          "Sticker.isPublic",
          "Sticker.keywords",
          "Sticker.group",
          "Sticker.isTexture",
          "Sticker.meta",
          "Sticker.url",
          "Sticker.suffix", // 新增后缀字段
          "Sticker.phash", // 感知哈希
          "user.name",
          "user.account",
          "user.email",
          "user.isAdmin",
        ])

      // 名称模糊搜索
      if (post.imageName) {
        qb.andWhere('Sticker.name LIKE :imageName', { imageName: `%${post.imageName}%` })
      }
      // 描述模糊搜索
      if (post.description) {
        qb.andWhere('Sticker.description LIKE :desc', { desc: `%${post.description}%` })
      }
      // 关键字模糊搜索
      if (post.keywords) {
        qb.andWhere('Sticker.keywords LIKE :kw', { kw: `%${post.keywords}%` })
      }
      // 创建时间区间
      if (post.startTime && post.endTime) {
        qb.andWhere('Sticker.createTime BETWEEN :start AND :end', { start: post.startTime, end: post.endTime })
      }
      // 排序
      if (post.sortingFields) {
        // 例："createTime DESC" 或 "createTime ASC"
        const [field, order] = post.sortingFields.split(' ');
        qb.orderBy(`Sticker.${field}`, (order || 'DESC').toUpperCase());
      } else {
        qb.orderBy('Sticker.createTime', 'DESC');
      }
    }

    return await this.getPageFn({
      queryBuilderHook,
      queryBuilderName,
      post,
      where,
      repo: this.stickerRepository
    })
  }

  /**
   * AI生成贴纸信息（名称、描述、关键字）
   * @param id 贴纸id
   */
  async aiGenerateInfo(id: string, prompt?: string) {
    const sticker = await this.stickerRepository.findOne({ id });
    if (!sticker) throw new Error('未找到贴纸');
    if (!sticker.url) throw new Error('贴纸无图片URL');
    if (!sticker.suffix) throw new Error('贴纸缺少文件后缀（suffix 字段）');

    let imageUrl = sticker.url;
    let tempPngPath = '';
    let cosPngKey = '';
    // 使用 suffix 字段判断是否为 svg
    let isSvg = sticker.suffix.toLowerCase() === 'svg';
    try {
      if (isSvg) {
        // 1. 下载svg到本地
        const svgRes = await fetch(imageUrl);
        const svgBuffer = await svgRes.arrayBuffer();
        const svgData = Buffer.from(svgBuffer);
        // 2. 转为png
        const fileName = `ai_tmp_${Date.now()}.png`;
        tempPngPath = path.join('/tmp', fileName);
        await sharp(svgData).png().toFile(tempPngPath);
        // 3. 上传到cos（用uploadBuffer）
        const fileBuffer = fs.readFileSync(tempPngPath);
        const cosRes = await this.cosService.uploadBuffer(fileBuffer, fileName);
        imageUrl = cosRes.url;
        cosPngKey = cosRes.key;
      }


      // 4. 拼接结构和格式要求
      let finalPrompt = '';
      const basePrompt = "尽量使用中文，除了英文专属的词，比如logo等,请以如下 JSON 格式返回：{name:'图片名称', description:'图片描述', keywords:'图片关键字'}。只返回 JSON，不要其他解释，也不要用```json或```包裹。";
      finalPrompt = prompt
        ? `${prompt}\n${basePrompt}`
        : `请分析这张图片内容，并${basePrompt}`;
      const params = {
        model: 'qwen-vl-max',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageUrl } },
              { type: 'text', text: finalPrompt }
            ]
          }
        ]
      };
      const res = await this.aiService.qwenChat(params);
      let text = res.choices?.[0]?.message?.content || JSON.stringify(res);
      // 尝试提取JSON
      let info;
      try {
        const match = text.match(/{[\s\S]*}/);
        if (match) {
          info = JSON.parse(match[0]);
        } else {
          info = {};
        }
      } catch (e) {
        info = {};
      }
      // 更新贴纸信息
      sticker.name = info.name || sticker.name;
      sticker.description = info.description || sticker.description;
      sticker.keywords = info.keywords || sticker.keywords;
      await this.stickerRepository.save(sticker);
      return {
        name: sticker.name,
        description: sticker.description,
        keywords: sticker.keywords,
        raw: text
      };
    } finally {
      // 5. 删除临时png（cos和本地）
      if (isSvg && cosPngKey) {
        await this.cosService.deleteFile(cosPngKey);
      }
      if (isSvg && tempPngPath && fs.existsSync(tempPngPath)) {
        fs.unlinkSync(tempPngPath);
      }
    }
  }

  /**
   * 分批为所有未生成 phash 的贴纸生成 phash
   */
  async batchGeneratePhashForAllStickers(batchSize = 100): Promise<{ total: number, updated: number }> {
    const repo = this.stickerRepository;
    let updated = 0;
    let total = 0;
    while (true) {
      const [list, count] = await repo.findAndCount({
        where: { phash: null },
        take: batchSize,
      });
      if (total === 0) total = count;
      if (!list.length) break;
      for (const item of list) {
        if (item.url) {
          const phash = await this.calculatePhashByUrl(item.url, item.suffix || 'jpg');
          if (phash) {
            item.phash = phash;
            await repo.save(item);
            updated++;
          }
        }
      }
      if (list.length < batchSize) break;
    }
    return { total, updated };
  }
}
