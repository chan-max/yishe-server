import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('EnWords') // 表名
export class EnWords {
    @PrimaryColumn({ type: 'varchar', length: 32, default: '' })
    word: string; // 主键字段

    @Column({ type: 'varchar', length: 512, nullable: true })
    translation: string | null; // 可选字段
}
