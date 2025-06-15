/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-15 14:51:58
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-15 15:47:25
 * @FilePath: /design-server/src/design-request/entities/design-request.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

@Entity('design_request')
export class DesignRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100, nullable: false })
    name: string; // 设计请求名称

    @Column({ type: 'text', nullable: true })
    description: string; // 详细描述

    @Column({ length: 20, nullable: true })
    phoneNumber: string; // 电话号码

    @Column({ length: 100, nullable: true })
    email: string; // 邮箱

    @Column({ default: null, nullable: true })
    userId: string; // 用户ID

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

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