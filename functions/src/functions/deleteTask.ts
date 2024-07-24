import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { container } from "../db";

export async function deleteTask(
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

  try {
    await container.item(taskId).delete();

    return {
      status: 204,
    };
  } catch (err: unknown) {
    const error = err as Error;
    context.error(`Error delete task with id ${taskId}: ${error.message}`);

    return {
      status: 500,
      jsonBody: {
        error: `Failed to delete task with id ${taskId}`,
      },
    };
  }
}
