import { CosmosClient } from "@azure/cosmos";
import { config } from "./config";

const connectionString = config.cosmosDB.connectionString;
const dbId = config.cosmosDB.databaseId;
const containerId = config.cosmosDB.containerId;

const client = new CosmosClient(connectionString);
const db = client.database(dbId);
const container = db.container(containerId);

export { container };
