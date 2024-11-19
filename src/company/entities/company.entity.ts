
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToOne,
    JoinColumn,
    BeforeUpdate,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

@Entity('company')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, })
    name: string;

    @Column({ nullable: true, })
    inviteCode: string;

    @Column({ nullable: true, })
    description: string;

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
