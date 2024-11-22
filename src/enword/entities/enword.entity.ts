import { Entity, Column, PrimaryColumn, BeforeUpdate } from 'typeorm';

@Entity('EnWords') // 表名
export class EnWords {
    @PrimaryColumn({ type: 'varchar', length: 32, default: '' })
    word: string; // 主键字段

    @Column({ type: 'varchar', length: 512, nullable: true })
    translation: string | null; // 可选字段

    @Column({ type: 'varchar', length: 512, nullable: true })
    type: string | null; // 可选字段


    @Column({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createTime: Date;

    @Column({
        name: 'update_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updateTime: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updateTime = new Date();
    }
}
