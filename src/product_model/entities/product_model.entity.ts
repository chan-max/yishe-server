/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-02 17:58:18
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-16 05:12:49
 * @FilePath: /design-server/src/product_model/entities/product_model.entity.ts
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
} from 'typeorm';
import { CosService } from 'src/common/cos.service';

@Entity('product_model')

/*
    所有商品的基础模型，可以用来自定义
*/
export class ProductModel {
    private static cosService: CosService;

    static setCosService(service: CosService) {
        ProductModel.cosService = service;
    }

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

    @Column({ nullable:true,default:0  })
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
