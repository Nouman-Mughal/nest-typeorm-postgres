import { Injectable } from '@nestjs/common';
// import { TaskStatus } from './tasks-status.enum';
import { createTaskDto } from './DTOs/create-task.dto';
// import { filterTaskDto } from './DTOs/filter-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Tasks } from './entity/tasks.entity';
import { TaskStatus } from './tasks-status.enum';
import { filterTaskDto } from './DTOs/filter-task.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async createTask(createTaskDto: createTaskDto, user: User): Promise<Tasks> {
    // console.log('this.tasksRepository', this.tasksRepository);
    return this.tasksRepository.createTask(createTaskDto, user);
  }
  async getTaskById(id: string, user: User): Promise<Tasks> {
    return await this.tasksRepository.getTaskById(id, user);
  }

  async getTasks(filtertaskdto: filterTaskDto, user: User): Promise<Tasks[]> {
    const allTasks = await this.tasksRepository.getTasks(filtertaskdto, user);
    return allTasks;
  }

  deleteTaskById(id: string, user: User) {
    return this.tasksRepository.deleteTaskById(id, user);
  }

  async updateTaskByStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Tasks> {
    const task = await this.tasksRepository.updateTaskByStatus(
      id,
      status,
      user,
    );
    return task;
  }
}
