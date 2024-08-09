

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('relation')
export class Relation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    followerId: number;

    @Column()
    followedId: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
