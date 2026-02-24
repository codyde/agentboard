export type TaskStatus = "backlog" | "todo" | "in_progress" | "done" | "failed";

export type TaskPriority = "urgent" | "high" | "medium" | "low" | "none";

export interface Task {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  output: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  identifier: string;
  tasks: Task[];
  createdAt: string;
  status: "idle" | "executing" | "completed" | "failed";
}

export interface ExecutionLogEntry {
  id: string;
  projectId?: string;
  taskId: string;
  timestamp: string;
  type: "info" | "tool_use" | "result" | "error" | "progress";
  content: string;
}

export interface ExecuteRequest {
  projectId: string;
  tasks: { id: string; title: string; description: string }[];
}

export interface SSEEvent {
  type:
    | "task_start"
    | "task_progress"
    | "task_complete"
    | "task_failed"
    | "log"
    | "done"
    | "error";
  taskId?: string;
  content?: string;
  output?: string;
}
