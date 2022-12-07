import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { createTaskDto } from './DTOs/create-task.dto';
import { filterTaskDto } from './DTOs/filter-task.dto';
import { UpdateTaskStatusDto } from './DTOs/update-task.dto';
import { TasksService } from './tasks.service';
import { Tasks } from './entity/tasks.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async createTask(@Body() createtaskdto: createTaskDto): Promise<Tasks> {
    const task = await this.tasksService.createTask(createtaskdto);
    return task;
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Tasks> {
    const task = await this.tasksService.getTaskById(id);
    return task;
  }
  @Get()
  async getfilteredtasks(
    @Query() filtertaskdto: filterTaskDto,
  ): Promise<Tasks[]> {
    const tasks = await this.tasksService.getTasks(filtertaskdto);
    return tasks;
  }
  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string) {
    await this.tasksService.deleteTaskById(id);
  }
  @Patch('/:id/status')
  async updateTaskByStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskStatusDto,
  ): Promise<Tasks> {
    const { status } = updateTaskDto;
    return this.tasksService.updateTaskByStatus(id, status);
  }
}
