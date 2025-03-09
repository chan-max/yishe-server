// src/keyvalue/entities/keyvalue.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class KeyValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  namespace: string; // 命名空间

  @Column({ type: 'varchar', length: 255 })
  key: string; // 键

  @Column({ type: 'text' })
  value: string; // 值（存储为 JSON 字符串）

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // 创建时间

  @Column({ type: 'timestamp', nullable: true })
  expireAt: Date; // 过期时间
}