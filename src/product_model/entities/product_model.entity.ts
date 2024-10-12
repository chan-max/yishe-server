import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToOne,
    JoinColumn,
    BeforeUpdate,
} from 'typeorm';

@Entity('product_model')

/*
    所有商品的基础模型，可以用来自定义
*/
export class ProductModel {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ length: 1000 ,nullable:true })
    name: string; // 模型名称

    @Column({ length: 1000 ,nullable:true })
    description: string; // 模型描述

    @Column({ length: 1000 ,nullable:true })
    price: string; // 价格

    @Column({ length: 1000 ,nullable:true })
    url: string; // 模型地址

    @Column({ length: 1000, default: '', nullable: true })
    keywords: string; // 描述

    @Column({ nullable:true ,default:0 })
    ref_count: number; // 模型引用次数，有多少模型引用了该模型

    @Column({ nullable:true,default:0 })
    like_count: number; // 点赞次数

    @Column({ nullable:true,default:0  })
    save_count: number; // 收藏次数

    @Column({ nullable:true,default:0  })
    link_count: number; //  引用次数

    @Column({ nullable:true,type:'json' })
    thumbnail: any; // 缩略图地址 , 用作该模型的封面图 ， 不同于实物图

    @Column({ type:'json',nullable:true })
    meta: JSON; // 模型图片

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
