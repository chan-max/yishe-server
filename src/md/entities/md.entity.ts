import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  Unique,
} from 'typeorm'

@Entity('md')
@Unique(['content', 'type']) // 根据实际需求，添加唯一约束
export class Md {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  content: string // 文章内容

  @Column({ type: 'varchar', length: 255 })
  type: string // 文章类型

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date // 创建时间

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date // 更新时间，TypeORM 会自动处理这个字段

  @BeforeUpdate()
  private updateTimestamp () {
    // 你可以在这里做额外的处理，如果需要
    console.log('Updating record timestamp...')
  }
}
