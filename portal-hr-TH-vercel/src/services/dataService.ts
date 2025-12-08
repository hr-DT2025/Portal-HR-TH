import { User, Role, Project, Request, RequestStatus, RequestType } from '../types';

// Mock Data Store
const MOCK_USER: User = {
  id: 'user-123',
  email: 'colaborador@empresa.com',
  fullName: 'Ana García',
  role: Role.COLLABORATOR,
  department: 'Desarrollo de Producto',
  leader: 'Carlos Rodríguez',
  startDate: '2022-03-15T00:00:00Z',
  ptoTotal: 15,
  ptoTaken: 4,
  skills: ['React', 'TypeScript', 'UI/UX', 'Comunicación Asertiva'],
  avatarUrl: 'https://picsum.photos/200/200'
};

const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Redesign Portal Cliente', role: 'Frontend Lead', status: 'Active' },
  { id: '2', name: 'Migración a Nube', role: 'Support', status: 'Completed' },
  { id: '3', name: 'Hackathon Interno', role: 'Participante', status: 'Active' },
];

const MOCK_REQUESTS: Request[] = [
  { id: '101', userId: 'user-123', type: RequestType.TIME_OFF, details: 'Vacaciones de verano', date: '2023-11-10', status: RequestStatus.APPROVED },
  { id: '102', userId: 'user-123', type: RequestType.CERTIFICATE, details: 'Para trámite bancario', date: '2024-01-15', status: RequestStatus.PENDING },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dataService = {
  login: async (email: string): Promise<User> => {
    await delay(800);
    // Simulating login - in real app, check Supabase Auth
    return { ...MOCK_USER, email };
  },

  register: async (email: string): Promise<User> => {
    await delay(1000);
    return { ...MOCK_USER, email, id: `new-${Date.now()}` };
  },

  getUser: async (): Promise<User> => {
    await delay(500);
    return MOCK_USER;
  },

  getProjects: async (): Promise<Project[]> => {
    await delay(600);
    return MOCK_PROJECTS;
  },

  getRequests: async (): Promise<Request[]> => {
    await delay(600);
    return MOCK_REQUESTS;
  },

  createRequest: async (type: RequestType, details: string): Promise<Request> => {
    await delay(800);
    const newRequest: Request = {
      id: `req-${Date.now()}`,
      userId: MOCK_USER.id,
      type,
      details,
      date: new Date().toISOString(),
      status: RequestStatus.PENDING
    };
    MOCK_REQUESTS.unshift(newRequest); // Add to local mock store
    return newRequest;
  }
};