import { PatchOperation } from "@azure/cosmos";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { container } from "../db";
import { updateTaskDto } from "../dto/updateTask";
import { taskFromDb } from "../mapper/task";
import { Task } from "../schema/task";

export async function updateTask(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const taskId = request.params.id;
  if (!taskId) {
    return {
      status: 404,
      jsonBody: {
        error: "Task not found",
      },
    };
  }

  const body = await request.json();
  const result = updateTaskDto.safeParse(body);
  if (!result.success) {
    return {
      status: 400,
      jsonBody: result.error.flatten().fieldErrors,
    };
  }

  const operations: PatchOperation[] = [];
  for (const [key, value] of Object.entries(result.data)) {
    const operation: PatchOperation = {
      op: "replace",
      path: `/${key}`,
      value: value,
    };
    operations.push(operation);
  }

  try {
    const { resource } = await container.item(taskId).patch<Task>(operations);
    const mappedTask = taskFromDb(resource);

    return {
      status: 200,
      jsonBody: mappedTask,
    };
  } catch (err: unknown) {
    const error = err as Error;
    context.error(`Error update task with id ${taskId}: ${error.message}`);

    return {
      status: 500,
      jsonBody: {
        error: `Failed to update task with id ${taskId}`,
      },
    };
  }
}
