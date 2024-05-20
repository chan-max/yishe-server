
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

@Entity('image')
export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    url: string; // 文件路径

    @Column({ length: 100, default: '', nullable: true })
    name: string; //文件类型

    @Column({ length: 100, default: '', nullable: true })
    description: string; // 描述


    @Column({  nullable: true ,type:'json'})
    meta: any; // 元数据

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
