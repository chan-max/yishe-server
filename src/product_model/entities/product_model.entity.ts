/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-02 17:58:18
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-06 07:43:28
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
    BeforeRemove,
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

    @Column({ nullable:true ,default:0 })
    ref_count: number; // 模型引用次数，有多少模型引用了该模型

    @Column({ nullable:true,default:0 })
    like_count: number; // 点赞次数

    @Column({ nullable:true,default:0  })
    save_count: number; // 收藏次数

    @Column({ nullable:true,default:0  })
    link_count: number; //  引用次数

    @Column({ nullable:true,type:'varchar', length: 1000 })
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

    @BeforeRemove()
    async removeCosFiles() {
        if (ProductModel.cosService) {
            try {
                // 删除模型文件
                if (this.url) {
                    await ProductModel.cosService.deleteFile(this.url);
                }
                // 删除缩略图
                if (this.thumbnail) {
                    await ProductModel.cosService.deleteFile(this.thumbnail);
                }
            } catch (error) {
                console.error('删除 COS 文件失败:', error);
                // 这里我们不抛出错误，因为文件删除失败不应该影响模型删除
            }
        }
    }
}
