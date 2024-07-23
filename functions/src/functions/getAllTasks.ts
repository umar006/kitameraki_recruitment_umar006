import { CosmosClient, SqlQuerySpec } from "@azure/cosmos";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { config } from "../config";

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
      body: "CosmosDB connection string is missing.",
    };
  }
  const client = new CosmosClient(connectionString);
  const db = client.database(dbId);
  const container = db.container(containerId);

  const query: SqlQuerySpec = {
    query: "SELECT * FROM TasksUmar",
  };

  const { resources } = await container.items.query(query).fetchAll();

  return { status: 200, jsonBody: resources };
}

app.http("getAllTasks", {
  methods: ["GET"],
  route: "tasks",
  authLevel: "anonymous",
  handler: getAllTasks,
});
