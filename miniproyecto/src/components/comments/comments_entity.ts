import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../users/users_entity';
import { Tasks } from '../tasks/tasks_entity';

@Entity('comments')
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  comment_id!: string;

  @Column({ type: 'text', nullable: false })
  comment!: string;

  @ManyToOne(() => Tasks, (task) => task.comments, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task?: Tasks;

  @Column({ type: 'uuid', nullable: true })
  task_id!: string;

  @ManyToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @Column({ type: 'uuid', nullable: true })
  user_id!: string;

  @Column({ type: 'text', nullable: true })
  supported_files!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export { Comments as Comment };
