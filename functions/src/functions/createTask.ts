import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { container } from "../db";
import { createTaskDto } from "../dto/createTask";
import { taskFromDb } from "../mapper/task";

export async function createTask(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const body = await request.json();
  const result = createTaskDto.safeParse(body);
  if (!result.success) {
    return {
      status: 400,
      jsonBody: result.error.flatten().fieldErrors,
    };
  }

  try {
    const { resource } = await container.items.create(result.data);
    if (!resource) {
      return {
        status: 404,
        jsonBody: {
          error: "Task not found",
        },
      };
    }
    const mappedTask = taskFromDb(resource);

    return {
      status: 201,
      jsonBody: mappedTask,
    };
  } catch (err: unknown) {
    const error = err as Error;
    context.error(`Error create new task: ${error.message}`);

    return {
      status: 500,
      jsonBody: {
        error: "Failed to create new task",
      },
    };
  }
}
