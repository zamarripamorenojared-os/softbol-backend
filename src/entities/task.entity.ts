import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

@Entity('tasks_advanced')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'varchar', default: TaskStatus.IN_PROGRESS })
  status!: TaskStatus | string;

  @ManyToOne(() => ProjectEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @Column({ type: 'jsonb', nullable: true })
  assignedUser!: { id: string } | null;
}
