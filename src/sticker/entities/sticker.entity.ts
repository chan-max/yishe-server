/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:12:19
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-25 08:46:19
 * @FilePath: /yishe-admin/Users/jackie/workspace/design-server/src/sticker/entities/sticker.entity.ts
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
const bcrypt = require('bcryptjs');

@Entity('sticker')
export class Sticker {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 1000, default: '', nullable: true })
    url: string; 

    @Column({ length: 1000, default: '', nullable: true })
    key: string;

    @Column({ length: 1000, default: '', nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
    keywords: string; // 描述

    @Column({ length: 1000, default: '', nullable: true,charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
    name: string; //文件类型

    @Column({ length: 1000, default: '', nullable: true })
    group: string; // 贴纸分组

    @Column({ length: 1000, default: '', nullable: true ,charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    description: string; // 描述

    @Column({ length: 20, default: '', nullable: true })
    suffix: string; // 图片类型后缀，如 png、jpg 等

    @Column({ length: 64, default: '', nullable: true })
    phash: string; // 感知哈希

    @Column({default: null, nullable: true })
    uploaderId: any; // 作者id

    @Column({ type: 'boolean', default: false })
    isPublic: boolean; // 是否为公开的资源

    @Column({ type: 'boolean', default: false })
    isTexture: boolean; // 是否为材质

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
