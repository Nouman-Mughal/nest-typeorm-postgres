import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { createTaskDto } from './DTOs/create-task.dto';
import { filterTaskDto } from './DTOs/filter-task.dto';
import { UpdateTaskStatusDto } from './DTOs/update-task.dto';
import { TasksService } from './tasks.service';
import { Tasks } from './entity/tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { getUser } from '../auth/get-user.decorator';

@Controller('tasks')
//Remember to give strategy inside the authGuard even if you tell about your default strategy in Module.
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body() createtaskdto: createTaskDto,
    @getUser() user: User,
  ): Promise<Tasks> {
    const task = await this.tasksService.createTask(createtaskdto, user);
    return task;
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @getUser() user: User,
  ): Promise<Tasks> {
    const task = await this.tasksService.getTaskById(id, user);
    return task;
  }
  @Get()
  async getfilteredtasks(
    @Query() filtertaskdto: filterTaskDto,
    @getUser() user: User,
  ): Promise<Tasks[]> {
    const tasks = await this.tasksService.getTasks(filtertaskdto, user);
    return tasks;
  }
  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string, @getUser() user: User) {
    await this.tasksService.deleteTaskById(id, user);
  }
  @Patch('/:id/status')
  async updateTaskByStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskStatusDto,
    @getUser() user: User,
  ): Promise<Tasks> {
    const { status } = updateTaskDto;
    return this.tasksService.updateTaskByStatus(id, status, user);
  }
}
