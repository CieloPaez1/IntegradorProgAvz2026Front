export interface Task {
  id?: number;
  projectId?: number;
  projectName?: string;
  title: string;
  estimateHours: number;
  assignee?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  finishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
