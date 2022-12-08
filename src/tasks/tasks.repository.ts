import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { createTaskDto } from './DTOs/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { Tasks } from './entity/tasks.entity';
import { filterTaskDto } from './DTOs/filter-task.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Tasks> {
  //remember to provide the constructor and super constructor here for compatibility.
  constructor(dataSource: DataSource) {
    super(Tasks, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: createTaskDto, user: User): Promise<Tasks> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.in_progress,
      user,
    });
    await this.save(task);
    return task;
  }
  async getTaskById(id: string, user: User): Promise<Tasks> {
    const task = await this.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }
  async deleteTaskById(id: string, user: User): Promise<void> {
    //One can user where clause but I am confident this will work without using wher.
    const result = await this.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
  async updateTaskByStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Tasks> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    this.save(task);
    return task;
  }
  async getTasks(filtertaskdto: filterTaskDto, user: User): Promise<Tasks[]> {
    const { status, search } = filtertaskdto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.where('task.status=:status', { status });
    }
    if (search) {
      query.andWhere(
        //So the bug we face here is that single user can fetch all the tasks by querieing the search result
        //So we need to put string inside the parentheses.So whole condition act in appropriate way.
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
}
