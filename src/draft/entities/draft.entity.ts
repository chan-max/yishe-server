import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BeforeUpdate,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CustomModel } from 'src/custom_model/entities/custom_model.entity';

@Entity('draft')
export class Draft {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 1000, default: '', nullable: true })
    url: string; 

    @Column({ length: 1000, default: '', nullable: true })
    name: string;

    @Column({ length: 1000, default: '', nullable: true })
    description: string;

    @Column({ length: 50, default: 'image', nullable: true })
    type: string; // 'image' 或 'video'

    @Column({ default: null, nullable: true })
    uploaderId: any;

    @Column({ default: null, nullable: true })
    customModelId: string; // 可为空，关联CustomModel

    @Column({ nullable: true, type: 'json' })
    meta: any;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uploaderId' })
    uploader;

    @ManyToOne(() => CustomModel, { nullable: true })
    @JoinColumn({ name: 'customModelId' })
    customModel;

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