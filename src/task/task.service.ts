import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './create-task.dto';
import { Task } from './task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const createdTask = new this.taskModel(createTaskDto);
    await createdTask.save();
  }

  async getAllTasks(): Promise<Task[]> {
    const taskList = await this.taskModel.find();
    return taskList;
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ id: taskId });
    if (!task) {
      throw new NotFoundException('task is not found');
    }

    return task;
  }
}