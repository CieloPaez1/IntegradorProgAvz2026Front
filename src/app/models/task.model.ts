export interface Task {
  id?: number;
  projectId?: number;
  title: string;
  estimateHours: number;
  assignee?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  finishedAt?: string;
  createdAt?: string;
}