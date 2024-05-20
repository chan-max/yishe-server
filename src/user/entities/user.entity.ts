import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { OrganizationEntity } from 'src/organization/entities/organization.entity';
import { RoleEntity } from 'src/role/entities/role.entity';
const bcrypt = require('bcryptjs');

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  account: string; // 用户名

  @Column({ length: 100, default: '', nullable: true })
  nickname: string; //昵称

  @Column({ type: 'bigint', nullable: true })
  phone: number; // 手机号

  @Column({ type: 'boolean', nullable: true })
  sex: number; // 性别 1:男 0:女

  @Column({ nullable: true })
  birthday: Date; // 出生日期

  @Column({ nullable: true })
  status: string; // 出生日期


  @Column({ nullable: true }) // 表示查询时隐藏此列
  @Exclude() // 返回数据时忽略password，配合ClassSerializerInterceptor使用
  password: string; // 密码

  @Column({ nullable: true ,type:'json'}) // 表示查询时隐藏此列
  meta: JSON; // 密码

  @Column({ default: '', nullable: true })
  avatar: string; //头像

  @Column({ default: '', nullable: true })
  email: string;

  @Column({ default: '', nullable: true })
  organizationId: string;

  @Column({ default: '', nullable: true })
  roleId: string;

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

  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
}
