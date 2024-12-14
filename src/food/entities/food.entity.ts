import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('food')
export class Food {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    enname: string;

    @Column({ type: 'json', nullable: true })
    nutrition: Record<string, any>;
}
