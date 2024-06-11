
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToOne,
    JoinColumn,
    BeforeUpdate,
} from 'typeorm';

@Entity('custom_model')
export class CustomModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100,default: '', nullable: true })
    uploader_id: string; // 作者id

    @Column({ length: 100 })
    thumbnail: string; // 缩略图

    @Column({ length: 100, default: '', nullable: true })
    keywords: string; // 描述

    @Column({ length: 100, default: '', nullable: true })
    name: string; //名称

    @Column({ length: 100, default: '', nullable: true })
    description: string; // 描述

    @Column({  nullable: true ,type:'json'})
    meta: any; // 元数据

    @Column({  nullable: true,type:'double' })
    custom_price: any; // 用户自定义的价格

    @Column({  nullable: true,type:'boolean' })
    is_public: any; //  是否为公开的模型

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
