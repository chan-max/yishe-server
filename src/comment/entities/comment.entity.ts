
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToOne,
    JoinColumn,
    BeforeUpdate,
    ManyToOne
} from 'typeorm';



@Entity('comment')
export class Comment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100, default: '', nullable: true })
    relationId: string; // 关系id，即关联该评论的id

    @Column({ nullable: true, type: 'json' })
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
