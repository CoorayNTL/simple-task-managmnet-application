export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: TaskPriority;
  dueDate?: string;
}

export interface TaskFilter {
  isCompleted?: boolean | null;
  priority?: TaskPriority | '';
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
}
