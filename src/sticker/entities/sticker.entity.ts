
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
const bcrypt = require('bcryptjs');

@Entity('sticker')
export class Sticker {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 1000 })
    type: string; // 文件路径

    @Column({ length: 1000, default: '', nullable: true })
    url: string; // 文件路径

    @Column({ nullable: true, type: 'json' })
    thumbnail: any;

    @Column({ length: 1000, default: '', nullable: true })
    keywords: string; // 描述

    @Column({ length: 1000, default: '', nullable: true })
    name: string; //文件类型

    @Column({ length: 1000, default: '', nullable: true })
    group: string; // 贴纸分组

    @Column({ length: 1000, default: '', nullable: true })
    description: string; // 描述

    @Column({default: null, nullable: true })
    uploaderId: any; // 作者id

    @Column({ type: 'boolean', default: false })
    isPublic: boolean; // 是否为公开的资源

    @Column({ nullable: true, type: 'json' })
    meta: any; // 元数据


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
