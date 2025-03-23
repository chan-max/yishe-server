import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  BeforeUpdate,
  Index,
  BeforeInsert,
} from 'typeorm'
import * as nodejieba from 'nodejieba'

@Entity('record_sentence')
export class RecordSentence {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  content: string //

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date // 创建时间

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date

  @Column({ type: 'text', nullable: false })
  @Index('record_index', { fulltext: true, parser: 'ngram' }) // ✅ FULLTEXT 索引
  record_text: string // ✅ 用于全文搜索的字段

  // 经过nodejieba解析过的文字
  @Column({ type: 'json', nullable: true })
  token: string[] // 解析后的分词结果

  // ✅ 访问次数
  @Column({ type: 'int', default: 0 })
  views: number

  @BeforeUpdate()
  updateTimestamp () {
    this.updateTime = new Date()
  }

  
  @BeforeInsert()
  @BeforeUpdate()
  generateTokens () {
    if (this.content) {
      // 这里可以考虑增加相似词查询，然后拼接
      // this.token = nodejieba.cut(this.content, true) // ✅ 自动生成分词
      this.token = nodejieba.cutAll(this.content) // ✅ 自动生成分词
      this.record_text = this.content // ✅ 在插入时自动填充 FULLTEXT 字段
    }

    this.updateTime = new Date()
  }
}
