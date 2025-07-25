/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 12:42:30
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-21 19:44:18
 * @FilePath: /design-server/src/product/entities/product.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { CustomModel } from 'src/custom_model/entities/custom_model.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 ,default:''})
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 1000, default: '', nullable: true })
  description: string;

  @Column({ length: 1000, default: '', nullable: true })
  type: string; // 商品类型：服装、鼠标垫、挂毯等

  @Column({ type: 'json',  nullable: true })
  images: string[]; // 商品图片数组

  @Column({ type: 'json', nullable: true })
  videos: string[]; // 商品视频数组

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ length: 1000, default: '', nullable: true })
  specifications: string; // 商品规格，JSON字符串

  @Column({ length: 1000, default: '', nullable: true })
  tags: string; // 标签，多个标签用逗号分隔

  @Column({ length: 1000, default: '', nullable: true })
  keywords: string; // 关键词，用于搜索

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, comment: '是否发布：false-未发布，true-已发布' })
  isPublish: boolean;

  @Column({ type: 'tinyint', default: 0, comment: '是否绝版：0-否，1-是' })
  isLimitedEdition: number;

  @Column({ type: 'json', nullable: true })
  meta: any; // 元数据

  @Column({ type: 'uuid', nullable: true, comment: '关联定制模型ID' })
  customModelId: string;

  @ManyToOne(() => CustomModel, { nullable: true })
  @JoinColumn({ name: 'customModelId' })
  customModel: CustomModel;

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