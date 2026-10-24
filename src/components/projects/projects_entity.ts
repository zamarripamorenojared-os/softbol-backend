import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Users } from '../users/users_entity';
import { Tasks } from '../tasks/tasks_entity';

@Entity('projects')
export class Projects {
  @PrimaryGeneratedColumn('uuid')
  project_id!: string;

  @Column({ length: 60, nullable: false, unique: true })
  name!: string;

  @Column({ length: 500, nullable: true })
  description!: string;

  @Column({ default: 'active', nullable: true })
  status!: string;

  @Column({ type: 'uuid', nullable: true })
  owner_id!: string;

  @ManyToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner?: Users;

  @Column('text', { array: true, default: '{}' })
  user_ids!: string[];

  @Column({ type: 'timestamp', nullable: true })
  start_time!: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time!: Date;

  @OneToMany(() => Tasks, (task) => task.project)
  tasks?: Tasks[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export { Projects as Project };
