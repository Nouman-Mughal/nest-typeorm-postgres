import { Tasks } from '../tasks/entity/tasks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @OneToMany((_type) => Tasks, (task) => task.user, { eager: true })
  tasks: Tasks[];
}
