export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'CLOSED';

export interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  description?: string;
}


