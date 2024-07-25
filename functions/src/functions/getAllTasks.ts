import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { container } from "../db";
import { taskFromDb } from "../mapper/task";

export async function getAllTasks(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  let page = Number(request.query.get("page"));
  if (isNaN(page) || page < 1) page = 1;

  let limit = Number(request.query.get("limit"));
  if (isNaN(limit) || limit < 1) limit = 10;

  // calculate offset
  const skip = (page - 1) * limit;

  try {
    const { resources } = await container.items
      .query({
        query: "select * from TasksUmar offset @offset limit @limit",
        parameters: [
          { name: "@offset", value: skip },
          { name: "@limit", value: limit },
        ],
      })
      .fetchAll();
    const mappedTasks = resources.map((r) => taskFromDb(r));

    return { status: 200, jsonBody: mappedTasks };
  } catch (err: unknown) {
    const error = err as Error;
    context.error(`Error get all tasks: ${error.message}`);

    return {
      status: 500,
      jsonBody: {
        error: "Failed to get all tasks",
      },
    };
  }
}
