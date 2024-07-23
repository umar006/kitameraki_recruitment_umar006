import { z } from "zod";
import { TaskPriority, TaskStatus } from "../schema/task";

export const updateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  description: z.string().max(1000).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  tags: z.array(z.string().max(50)).optional(),
});
