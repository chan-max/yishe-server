import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Dayrecord } from 'src/dayrecord/entities/dayrecord.entity'; // 根据实际路径调整
const bcrypt = require('bcryptjs');

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 100 })
  username: string; // 用户名

  @Column({ length: 100, default: '', nullable: true })
  name: string; // 昵称

  @Column({ type: 'bigint', nullable: true })
  phone: number; // 手机号

  @Column({ nullable: true })
  gender: number; // 性别 1:男 0:女

  @Column({ nullable: true })
  birthday: Date; // 出生日期

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true, type: 'boolean' })
  isAdmin: boolean;

  @Column({ nullable: true }) // 表示查询时隐藏此列
  @Exclude() // 返回数据时忽略password，配合ClassSerializerInterceptor使用
  password: string; // 密码

  @Column({ nullable: true, type: 'json' }) // 表示查询时隐藏此列
  meta: JSON; // 额外信息

  @Column({ default: '', nullable: true })
  avatar: string; // 头像

  @Column({ default: '', nullable: true })
  email: string;

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

  // 密码加密
  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hashSync(this.password, 10);
  }

  // 与 Dayrecord 的一对多关联
  @OneToMany(() => Dayrecord, (dayRecord: any) => dayRecord.user)
  dayRecords: Dayrecord[];
}
