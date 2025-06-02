/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 19:08:56
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-25 10:04:19
 * @FilePath: /design-server/src/psd-template/entities/psd-template.entity.ts
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

@Entity('psd_template')
export class PsdTemplate {
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
    category: string; // 模板分类

    @Column({ length: 1000, default: '', nullable: true })
    description: string; // 描述

    @Column({default: null, nullable: true })
    uploaderId: any; // 作者id

    @Column({ type: 'boolean', default: false })
    isPublic: boolean; // 是否为公开的资源

    @Column({ nullable: true, type: 'json' })
    meta: any; // 元数据，可以存储PSD文件的特定信息，如尺寸、图层数等

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