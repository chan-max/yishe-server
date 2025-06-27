/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-02 17:58:18
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-27 06:48:31
 * @FilePath: /design-server/src/custom_model/entities/custom_model.entity.ts
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
import { User } from 'src/user/entities/user.entity';


@Entity('custom_model')
export class CustomModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, type: 'varchar', length: 1000 })
    thumbnail: string;

    @Column({ length: 100, default: '', nullable: true })
    keywords: string; // 描述

    @Column({ length: 100, default: '', nullable: true })
    name: string; //名称

    @Column({ length: 100, default: '', nullable: true })
    description: string; // 描述

    @Column({ type: 'json', nullable: true })
    meta: any; // 元数据

    @Column({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createTime: Date;


    @Column({ default: null, nullable: true })
    uploaderId: string; // 作者id

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uploaderId' })
    uploader;


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
