import { app } from "@azure/functions";
import { createTask } from "./functions/createTask";
import { deleteTask } from "./functions/deleteTask";
import { getAllTasks } from "./functions/getAllTasks";
import { getOneTask } from "./functions/getOneTask";
import { updateTask } from "./functions/updateTask";

app.http("getAllTasks", {
  methods: ["GET"],
  route: "tasks",
  authLevel: "anonymous",
  handler: getAllTasks,
});

app.http("createTask", {
  methods: ["POST"],
  route: "tasks",
  authLevel: "anonymous",
  handler: createTask,
});

app.http("updateTask", {
  methods: ["PATCH"],
  route: "tasks/{id}",
  authLevel: "anonymous",
  handler: updateTask,
});

app.http("deleteTask", {
  methods: ["DELETE"],
  route: "tasks/{id}",
  authLevel: "anonymous",
  handler: deleteTask,
});

app.http("getOneTasks", {
  methods: ["GET"],
  route: "tasks/{id}",
  authLevel: "anonymous",
  handler: getOneTask,
});

app.setup({
  enableHttpStream: true,
});
