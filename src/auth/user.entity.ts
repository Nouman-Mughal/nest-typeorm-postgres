import { Tasks } from '../tasks/entity/tasks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
export enum Roles {
  user = 'user',
  admin = 'admin',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column()
  email: string;
  @Column({ type: 'enum', enum: Roles, default: Roles.user })
  role: Roles;
  @OneToMany(() => Tasks, (task) => task.user, { eager: true })
  tasks: Tasks[];
}
