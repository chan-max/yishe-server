import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToOne,
    JoinColumn,
    BeforeUpdate,
    ManyToOne
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

@Entity('font_template')
export class FontTemplate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 1000, default: '', nullable: true })
    url: string; 

    @Column({ length: 1000, default: '', nullable: true })
    key: string;

    @Column({ nullable: true, type: 'json' })
    thumbnail: any;

    @Column({ length: 1000, default: '', nullable: true })
    name: string;

    @Column({ length: 1000, default: '', nullable: true })
    category: string; // 字体分类

    @Column({ length: 1000, default: '', nullable: true })
    description: string; // 描述

    @Column({ type: 'uuid', nullable: true })
    uploaderId: string; // 作者id

    @Column({ type: 'boolean', default: false })
    isPublic: boolean; // 是否为公开的资源

    @Column({ nullable: true, type: 'json' })
    meta: any; // 元数据，可以存储字体文件的特定信息，如字体类型、支持的语言等

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uploaderId' })
    uploader: User;

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