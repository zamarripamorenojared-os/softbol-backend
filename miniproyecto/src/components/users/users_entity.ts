import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Roles } from '../roles/roles_entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ length: 50, nullable: true })
  fullname!: string;

  @Column({ length: 30, nullable: false, unique: true })
  username!: string;

  @Column({ length: 60, nullable: false, unique: true })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ type: 'uuid', nullable: true })
  role_id!: string;

  @ManyToOne(() => Roles, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role?: Roles;

  @Column('text', { array: true, default: '{}' })
  role_ids!: string[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export { Users as User };
