
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToOne,
    JoinColumn,
    BeforeUpdate,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
const bcrypt = require('bcryptjs');

@Entity('resource')
export class Resource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, type: 'json' })
    meta: any; // 元数据

    @Column({ nullable: true, })
    name: string;

    // 价格
    @Column({ nullable: true, })
    price: string;

    @Column({ nullable: true, type: 'json' })
    thumbnails: any;

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
