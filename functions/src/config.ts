export const config = {
    cosmosDB: {
        connectionString: process.env["CosmosDBConnectionString"] || "",
        databaseId: "Task",
        containerId: "TasksUmar"
    }
};