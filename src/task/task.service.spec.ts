import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './schema/task.schema';
import { TaskStatusEnum } from './task.enum';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: TaskRepository;

  const mockTaskRepo = {
    createTask: jest.fn(),
  };

  const mockTask = {
    id: '96941e06-6069-46fd-bcfe-46ecdce3ed0d',
    status: 'todo',
    title: 'test',
  } as Task;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TaskService,
        TaskRepository,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskRepo,
        },
      ],
    }).compile();

    taskService = moduleRef.get<TaskService>(TaskService);
    taskRepository = moduleRef.get<TaskRepository>(TaskRepository);
  });

  describe('createTask', () => {
    it('should return created task', async () => {
      const dto = {
        title: 'test',
        status: TaskStatusEnum.TODO,
      } as CreateTaskDto;

      jest.spyOn(taskRepository, 'createTask').mockResolvedValueOnce(mockTask);

      const createdTask = await taskService.createTask(dto);

      expect(createdTask).toEqual(mockTask);
    });
  });
});