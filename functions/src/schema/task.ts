export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TaskStatus {
  TODO = "todo",
  INPROGRESS = "in-progress",
  COMPLETED = "completed",
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  tags?: string[];
}
