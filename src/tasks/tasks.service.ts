import { Injectable } from '@nestjs/common';
// import { TaskStatus } from './tasks-status.enum';
import { createTaskDto } from './DTOs/create-task.dto';
// import { filterTaskDto } from './DTOs/filter-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Tasks } from './entity/tasks.entity';
import { TaskStatus } from './tasks-status.enum';
import { filterTaskDto } from './DTOs/filter-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async createTask(createTaskDto: createTaskDto): Promise<Tasks> {
    console.log('this.tasksRepository', this.tasksRepository);
    return this.tasksRepository.createTask(createTaskDto);
  }
  async getTaskById(id: string): Promise<Tasks> {
    return await this.tasksRepository.getTaskById(id);
  }

  async getTasks(filtertaskdto: filterTaskDto): Promise<Tasks[]> {
    const allTasks = await this.tasksRepository.getTasks(filtertaskdto);
    return allTasks;
  }

  deleteTaskById(id: string) {
    return this.tasksRepository.deleteTaskById(id);
  }

  async updateTaskByStatus(id: string, status: TaskStatus): Promise<Tasks> {
    const task = await this.tasksRepository.updateTaskByStatus(id, status);
    return task;
  }
}
