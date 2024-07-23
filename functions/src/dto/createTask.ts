import { z } from "zod";
import { TaskPriority, TaskStatus } from "../schema/task";

export const createTaskDto = z
  .object({
    title: z.string().min(1).max(100),
    status: z.nativeEnum(TaskStatus),
    description: z.string().max(1000).optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    tags: z.array(z.string().max(50)).optional(),
  })
  .strip();
