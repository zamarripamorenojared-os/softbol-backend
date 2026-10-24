import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('clean_tasks')
export class TaskOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  projectId!: string;

  @Column()
  assignedUserId!: string;

  @Column({ default: 'PENDING' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
