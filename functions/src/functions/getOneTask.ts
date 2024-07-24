import { CosmosClient } from "@azure/cosmos";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { config } from "../config";
import { taskFromDb } from "../mapper/task";
import { Task } from "../schema/task";

export async function getOneTask(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const connectionString = config.cosmosDB.connectionString;
  const dbId = config.cosmosDB.databaseId;
  const containerId = config.cosmosDB.containerId;
  if (!connectionString) {
    return {
      status: 500,
      jsonBody: {
        error: "CosmosDB connection string is missing.",
      },
    };
  }
  const client = new CosmosClient(connectionString);
  const db = client.database(dbId);
  const container = db.container(containerId);

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
    const { resource } = await container.item(taskId).read<Task>();
    const mappedTask = taskFromDb(resource);

    return { status: 200, jsonBody: mappedTask };
  } catch (err: unknown) {
    const error = err as Error;
    context.error(`Error get task with id ${taskId}}: ${error.message}`);

    return {
      status: 500,
      jsonBody: {
        error: `Failed to get task with id ${taskId}`,
      },
    };
  }
}
