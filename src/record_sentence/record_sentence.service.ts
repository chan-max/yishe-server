import { Injectable } from '@nestjs/common'
import { Repository, DataSource } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as nodejieba from 'nodejieba'
import { RecordSentence } from './entities/record_sentence.entity'

@Injectable()
export class RecordSentenceService {
  constructor (
    @InjectRepository(RecordSentence)
    private readonly recordSentenceRepository: Repository<RecordSentence>,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit () {
    await this.ensureFulltextIndex()
  }

  private async ensureFulltextIndex () {}

  // ✅ 创建记录
  // ✅ 创建记录（避免重复）

  async create (recordSentence: Partial<RecordSentence>) {
    if (!recordSentence.content || recordSentence.content.trim().length === 0) {
      throw new Error('内容不能为空')
    }

    const existingRecord = await this.recordSentenceRepository.findOne({
      where: { content: recordSentence.content.trim() },
    })

    if (existingRecord) {
      await this.recordSentenceRepository.update(existingRecord.id, {
        views: existingRecord.views + 1,
      })
      existingRecord.views += 1 // 确保返回的数据同步
      return existingRecord // 返回已存在的记录
    }

    // 初始化 views 字段
    const newRecord = this.recordSentenceRepository.create({
      ...recordSentence,
      views: 0, // 访问次数初始为 0
    })

    return this.recordSentenceRepository.save(newRecord)
  }

  // ✅ 获取所有记录（支持分页）
  async findAll (page: number = 1, limit: number = 10) {
    return this.recordSentenceRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      order: { createTime: 'DESC' },
    })
  }

  // ✅ 获取单条记录
  async findOne (id: number) {
    const record = await this.recordSentenceRepository.findOne({
      where: { id },
    })

    if (record) {
      // 访问次数 +1
      await this.recordSentenceRepository.update(id, {
        views: record.views + 1,
      })
      // 返回更新后的记录
      record.views += 1 // 让返回的数据也体现更新
    }

    return record
  }

  // ✅ 更新记录
  async update (id: number, updateData: Partial<RecordSentence>) {
    await this.recordSentenceRepository.update(id, updateData)
    return this.findOne(id)
  }

  // ✅ 删除记录
  async remove (id: number) {
    await this.recordSentenceRepository.delete(id)
    return { message: '删除成功' }
  }

  // ✅ 关键字模糊搜索 + 同义词扩展
  // ✅ 关键字模糊搜索 + FULLTEXT + 同义词扩展 + token 匹配
  async search (searchParams) {
    var { query, limit } = searchParams

    limit ||= 10

     // 1️⃣ 如果查询为空，返回默认的数据（这里我们可以按访问量返回前几条记录，或返回全部记录）
  if (!query || query.trim().length === 0) {
    return this.recordSentenceRepository.query(
      `SELECT id, content FROM record_sentence
       ORDER BY views DESC LIMIT ?`,
      [Number(limit)]
    );
  }



    // 1️⃣ 使用 nodejieba 进行分词
    const keywords = nodejieba
      .cut(query, true)
      .filter(word => word.trim().length > 0)
    const fulltextQuery = keywords.join(' ')

    

    /**
     * @按照views排名排序
    */
    // 2️⃣ 使用 FULLTEXT 进行全文搜索（BOOLEAN MODE + NATURAL LANGUAGE MODE）
    // const fulltextBooleanResults = await this.recordSentenceRepository.query(
    //   `SELECT id, content FROM record_sentence 
    //  WHERE MATCH(record_text) AGAINST(? IN BOOLEAN MODE)
    //  ORDER BY views DESC
    //  LIMIT ?`,
    //   [fulltextQuery, limit],
    // )

    // const fulltextNaturalResults = await this.recordSentenceRepository.query(
    //   `SELECT id, content FROM record_sentence 
    //  WHERE MATCH(record_text) AGAINST(? IN NATURAL LANGUAGE MODE)
    //  ORDER BY views DESC
    //  LIMIT ?`,
    //   [fulltextQuery, limit],
    // )

    /**
     * @按相似度排序,相似度相同按照访问量
    */
    const fulltextBooleanResults = await this.recordSentenceRepository.query(
      `SELECT id, content, MATCH(record_text) AGAINST(? IN BOOLEAN MODE) AS relevance
       FROM record_sentence
       WHERE MATCH(record_text) AGAINST(? IN BOOLEAN MODE)
       ORDER BY views DESC
       LIMIT ?`,
      [fulltextQuery, fulltextQuery, Number(limit)],
    );

    const fulltextNaturalResults = await this.recordSentenceRepository.query(
      `SELECT id, content, MATCH(record_text) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance
       FROM record_sentence
       WHERE MATCH(record_text) AGAINST(? IN NATURAL LANGUAGE MODE)
       ORDER BY relevance DESC, views DESC
       LIMIT ?`,
      [fulltextQuery, fulltextQuery, Number(limit)],
    );

    
    // 3️⃣ 额外使用 LIKE 进行模糊匹配
    // const likeResults = await this.recordSentenceRepository
    //   .createQueryBuilder('record')
    //   .where('record.content LIKE :keyword', { keyword: `%${query}%` })
    //   .getMany()

    // // 4️⃣ 额外使用 JSON 查询 token 进行补充匹配
    // const tokenResults = await this.recordSentenceRepository
    //   .createQueryBuilder('record')
    //   .where('JSON_CONTAINS(record.token, :keyword)', { keyword: `"${query}"` })
    //   .getMany()

    // 5️⃣ 合并搜索结果并去重
    const resultMap = new Map<number, RecordSentence>()

    ;[
      ...fulltextBooleanResults,
      ...fulltextNaturalResults,
      // ...likeResults,
      // ...tokenResults,
    ].forEach(record => {
      resultMap.set(record.id, record)
    })

    return Array.from(resultMap.values())
  }
}
