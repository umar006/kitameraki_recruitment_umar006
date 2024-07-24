import { Resource } from "@azure/cosmos";
import { Task } from "../schema/task";

export function taskFromDb(raw: Task & Resource): Task {
  const id = raw.id;
  const title = raw.title;
  const status = raw.status;
  const description = raw.description;
  const dueDate = raw.dueDate;
  const priority = raw.priority;
  const tags = raw.tags;

  return {
    id,
    title,
    status,
    description,
    dueDate,
    priority,
    tags,
  };
}
