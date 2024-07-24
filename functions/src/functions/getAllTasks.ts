import { CosmosClient, Resource } from "@azure/cosmos";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { config } from "../config";
import { taskFromDb } from "../mapper/task";
import { Task } from "../schema/task";

export async function getAllTasks(
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

  const { resources } = await container.items
    .readAll<Task & Resource>()
    .fetchAll();
  const mappedTasks = resources.map((r) => taskFromDb(r));

  return { status: 200, jsonBody: mappedTasks };
}
