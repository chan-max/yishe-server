/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-02 17:51:12
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-02 19:08:56
 * @FilePath: /design-server/src/font-template/entities/font-template.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

    @Column({ length: 1000, default: '', nullable: true })
    thumbnail: string;

    @Column({ length: 1000, default: '', nullable: true })
    name: string;

    @Column({ length: 1000, default: '', nullable: true })
    category: string; // 字体分类

    @Column({ length: 1000, default: '', nullable: true })
    description: string; // 描述

    @Column({ length: 1000, default: '', nullable: true })
    keywords: string; // 关键字

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