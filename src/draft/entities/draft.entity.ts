import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BeforeUpdate,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('draft')
export class Draft {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 1000, default: '', nullable: true })
    url: string; 

    @Column({ length: 1000, default: '', nullable: true })
    name: string;

    @Column({ length: 1000, default: '', nullable: true })
    description: string;

    @Column({ length: 50, default: 'image', nullable: true })
    type: string; // 'image' 或 'video'

    @Column({ default: null, nullable: true })
    uploaderId: any;

    @Column({ nullable: true, type: 'json' })
    meta: any;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uploaderId' })
    uploader;

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