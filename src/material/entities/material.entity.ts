import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToMany,
    BeforeUpdate,
  } from 'typeorm';

  @Entity('material')
  export class Material {
    @PrimaryGeneratedColumn()
    id: string;
  
    @Column({ length: 100 })
    name: string; // 用户名
  
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
  