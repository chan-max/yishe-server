import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dream') // 表名
export class Dream {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column('text')
  message: string;

  @Column({ length: 20 })
  biglx: string;

  @Column({ length: 20 })
  smalllx: string;

  @Column({ length: 3 })
  zm: string;
}
