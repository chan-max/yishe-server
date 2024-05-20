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
    
    @Column({ length: 100 ,nullable:true })
    name: string; // 模型地址

    @Column({ length: 100 ,nullable:true })
    description: string; // 模型地址

    @Column({ length: 100 ,nullable:true })
    price: string; // 价格

    @Column({ length: 100 ,nullable:true })
    url: string; // 模型地址

    @Column({ length: 100,nullable:true })
    thumbnail: string; // 缩略图地址 , 用作该模型的封面图 ， 不同于实物图

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
