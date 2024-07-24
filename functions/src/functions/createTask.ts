import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { container } from "../db";
import { createTaskDto } from "../dto/createTask";

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

    return {
      status: 201,
      jsonBody: {
        id: resource.id,
        ...result.data,
      },
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
