import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  projectId: number;

  @Column()
  clientAddress: string;

  @Column()
  freelancerAddress: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('bigint')
  totalAmount: number;

  @Column()
  tokenAddress: string;

  @Column({ default: 'active' })
  status: string;

  @Column('bigint', { default: 0 })
  releasedAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}