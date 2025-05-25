import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('font_template')
export class FontTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  fontFamily: string;

  @Column({ length: 255 })
  fontPath: string;

  @Column({ type: 'json', nullable: true })
  metadata: {
    version: string;
    author: string;
    license: string;
    description: string;
    tags: string[];
    [key: string]: any;
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 