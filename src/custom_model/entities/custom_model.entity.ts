
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

    @Column({ length: 100 })
    thumbnail: string; // 缩略图

    @Column({ length: 100, default: '', nullable: true })
    keywords: string; // 描述

    @Column({ length: 100, default: '', nullable: true })
    name: string; //名称

    @Column({ length: 100, default: '', nullable: true })
    description: string; // 描述

    @Column({ nullable: true, type: 'json' })
    meta: any; // 元数据

    @Column({ nullable: true, type: 'double' })
    customPrice: any; // 用户自定义的价格

    @Column({ nullable: true, type: 'boolean' })
    isPublic: any; //  是否为公开的模型

    @Column({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createTime: Date;


    @Column({ default: null, nullable: true })
    uploaderId: any; // 作者id

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
