// Define la estructura de un Proyecto tal como lo devuelve el backend
export interface Project {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'CLOSED';
  description: string;
}