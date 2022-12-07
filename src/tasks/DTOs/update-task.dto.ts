import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks-status.enum';

export class UpdateTaskStatusDto {
  //of which object you want to check the enumeration.
  //put that is arguments of IsEnum
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
