export enum Role {
  COLLABORATOR = 'Collaborator',
  ADMIN = 'Admin',
  MANAGER = 'Manager'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  department: string;
  leader: string;
  startDate: string; // ISO Date
  avatarUrl?: string;
  ptoTotal: number;
  ptoTaken: number;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Completed' | 'On Hold';
}

export enum RequestType {
  TIME_OFF = 'Día Libre (TPP)',
  CERTIFICATE = 'Constancia Laboral',
  RECOMMENDATION = 'Recomendación Laboral'
}

export enum RequestStatus {
  PENDING = 'Pendiente',
  APPROVED = 'Aprobado',
  REJECTED = 'Rechazado'
}

export interface Request {
  id: string;
  userId: string;
  type: RequestType;
  details: string;
  date: string;
  status: RequestStatus;
}

export enum Mood {
  HAPPY = 'Happy',
  NEUTRAL = 'Neutral',
  STRESSED = 'Stressed',
  TIRED = 'Tired',
  EXCITED = 'Excited'
}

export interface EmotionalLog {
  date: string;
  mood: Mood;
  aiFeedback?: string;
}