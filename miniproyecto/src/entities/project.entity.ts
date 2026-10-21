import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity('projects_advanced')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'Proyecto' })
  name!: string;

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks?: TaskEntity[];
}
