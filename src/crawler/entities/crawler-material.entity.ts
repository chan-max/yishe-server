/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-07-19 07:26:34
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-19 07:57:18
 * @FilePath: /design-server/src/crawler/entities/crawler-material.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeUpdate,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('crawler_material')
export class CrawlerMaterial {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 1000, default: '', nullable: true })
    url: string;


    @Column({ length: 1000, default: '', nullable: true })
    keywords: string;

    @Column({ length: 1000, default: '', nullable: true })
    name: string;

    @Column({ length: 1000, default: '', nullable: true })
    description: string;

    @Column({ length: 20, default: '', nullable: true })
    suffix: string;

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