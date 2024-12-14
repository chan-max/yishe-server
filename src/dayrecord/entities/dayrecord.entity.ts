import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Unique,
    BeforeUpdate,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('dayrecord')
@Unique(['user', 'date']) // 确保同一用户每天只有一条记录
export class Dayrecord {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.dayRecords, { onDelete: 'CASCADE' })
    user: User; // 关联用户

    @Column({ type: 'date' })
    date: string; // 记录生成日期

    @Column({ type: 'json', nullable: true })
    record: any[]; // 记录生成日期

    @CreateDateColumn({ name: 'create_time' })
    createTime: Date; // 创建时间


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
