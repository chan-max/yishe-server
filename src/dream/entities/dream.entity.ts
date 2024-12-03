import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dream') // 表名
export class Dream {
  @PrimaryGeneratedColumn()
  id: number;


  // 标题
  @Column({ length: 100 })
  title: string;

  // 标题英文
  @Column({ length: 100 })
  title_en: string;

  // 消息英文
  @Column('text')
  message_en: string;

  // 消息
  @Column('text')
  message: string;

  @Column({ length: 20 })
  biglx: string;

  @Column({ length: 20 })
  smalllx: string;

  @Column({ length: 3 })
  zm: string;
}
