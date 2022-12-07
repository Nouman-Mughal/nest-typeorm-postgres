import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { createTaskDto } from './DTOs/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { Tasks } from './entity/tasks.entity';
import { filterTaskDto } from './DTOs/filter-task.dto';

@Injectable()
export class TasksRepository extends Repository<Tasks> {
  //remember to provide the constructor and super constructor here for compatibility.
  constructor(dataSource: DataSource) {
    super(Tasks, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: createTaskDto): Promise<Tasks> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.in_progress,
    });
    await this.save(task);
    return task;
  }
  async getTaskById(id: string): Promise<Tasks> {
    const task = await this.findOneBy({ id: id });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }
  async deleteTaskById(id: string): Promise<void> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
  async updateTaskByStatus(id: string, status: TaskStatus): Promise<Tasks> {
    const task = await this.getTaskById(id);
    task.status = status;
    this.save(task);
    return task;
  }
  async getTasks(filtertaskdto: filterTaskDto): Promise<Tasks[]> {
    const { status, search } = filtertaskdto;
    const query = this.createQueryBuilder('task');
    if (status) {
      query.where('task.status=:status', { status });
    }
    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
}
