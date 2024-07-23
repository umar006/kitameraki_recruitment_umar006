import { CosmosClient } from "@azure/cosmos";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { config } from "../config";
import { createTaskDto } from "../dto/createTask";

export async function createTask(
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

  const body = await request.json();
  const result = createTaskDto.safeParse(body);
  if (!result.success) {
    return {
      status: 400,
      jsonBody: result.error.flatten().fieldErrors,
    };
  }

  const { resource } = await container.items.create(result.data);

  return {
    status: 201,
    jsonBody: resource,
  };
}
