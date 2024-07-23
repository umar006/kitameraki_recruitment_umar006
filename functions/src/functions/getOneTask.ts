import { CosmosClient } from "@azure/cosmos";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { config } from "../config";

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

  const { resource } = await container.item(taskId).read();

  return { status: 200, jsonBody: resource };
}

app.http("getOneTasks", {
  methods: ["GET"],
  route: "tasks/{id}",
  authLevel: "anonymous",
  handler: getOneTask,
});
