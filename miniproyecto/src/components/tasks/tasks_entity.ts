import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Users } from '../users/users_entity';
import { Projects } from '../projects/projects_entity';
import { Comments } from '../comments/comments_entity';

export enum Status {
  NotStarted = 'Not-Started',
  InProgress = 'In-Progress',
  Completed = 'Completed'
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

@Entity('tasks')
export class Tasks {
  @PrimaryGeneratedColumn('uuid')
  task_id!: string;

  @Column({ length: 100, nullable: false, unique: true })
  name!: string;

  @Column({ length: 500, nullable: true })
  description!: string;

  @ManyToOne(() => Projects, (project) => project.tasks, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project?: Projects;

  @Column({ type: 'uuid', nullable: true })
  project_id!: string;

  @ManyToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  assignedUser?: Users;

  @Column({ type: 'uuid', nullable: true })
  user_id!: string;

  @Column({ type: 'timestamp', nullable: true })
  estimated_start_time!: Date;

  @Column({ type: 'timestamp', nullable: true })
  estimated_end_time!: Date;

  @Column({ type: 'timestamp', nullable: true })
  actual_start_time!: Date;

  @Column({ type: 'timestamp', nullable: true })
  actual_end_time!: Date;

  @Column({ type: 'varchar', default: Priority.Medium })
  priority!: Priority | string;

  @Column({ type: 'varchar', default: Status.NotStarted })
  status!: Status | string;

  @Column({ type: 'text', nullable: true })
  supported_files!: string;

  @OneToMany(() => Comments, (comment) => comment.task)
  comments?: Comments[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export { Tasks as Task };
