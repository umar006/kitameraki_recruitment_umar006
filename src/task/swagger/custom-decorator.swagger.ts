import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Task } from '../schema/task.schema';

export const ApiCreateTaskResponse = () => {
  return applyDecorators(
    ApiCreatedResponse({
      type: Task,
      description: 'Success create a new task',
    }),
    ApiBadRequestResponse({ description: 'Validation Error' }),
  );
};

export const ApiGetAllTasksResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      type: Task,
      isArray: true,
      description: 'Success get all tasks',
    }),
  );
};
