import { supabase } from './supabaseClient';
import { 
  User, 
  Role, 
  Solicitud, 
  RequestType, 
  RequestStatus, 
  Empresa 
} from '../types';

export const dataService = {
  // --- AUTENTICACIÓN Y PERFIL (Lógica V2) ---

  // 1. Obtener la sesión actual y verificar si tiene perfil
  getCurrentProfile: async (): Promise<{ user: User | null, needsProfile: boolean }> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { user: null, needsProfile: false }; [cite_start]// [cite: 53-54]

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // Si existe el perfil, retornamos el usuario completo
    if (profile && !error) {
      return { 
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          role: profile.role as Role,
          empresaId: profile.empresa_id,
          area: profile.area,
          rolPuesto: profile.rol_puesto,
          // Mapea aquí el resto de campos si es necesario
        }, 
        needsProfile: false 
      };
    [cite_start]} // [cite: 55-56]

    // Si hay sesión pero no perfil en BD, necesita completar registro
    return { user: null, needsProfile: true }; [cite_start]// [cite: 57]
  },

  // 2. Completar el registro (Crear perfil en BD)
  completeRegistration: async (userData: Partial<User>) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error("No hay sesión activa"); [cite_start]// [cite: 59-60]

    const { error } = await supabase
      .from('profiles')
      .insert([{
        id: authUser.id,
        email: authUser.email,
        full_name: userData.fullName,
        empresa_id: userData.empresaId, // ID vital para la relación
        role: Role.COLLABORATOR,
        area: userData.area,
        rol_puesto: userData.rolPuesto,
        created_at: new Date()
      }]); [cite_start]// [cite: 60-61]

    if (error) throw error;
  },

  // --- EMPRESAS (Funcionalidad V1 necesaria para el formulario) ---
  searchCompanies: async (query: string): Promise<Empresa[]> => {
    if (query.length < 3) return [];
    
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .ilike('nombre', `%${query}%`)
      .limit(5); [cite_start]// [cite: 31]

    if (error) return [];
    
    return data.map(emp => ({
      id: emp.id,
      nombre: emp.nombre,
      nitIdentificacion: emp.nit_identificacion
    })); [cite_start]// [cite: 32]
  },

  // --- SOLICITUDES (Funcionalidad V1 conservada para el Dashboard) ---
  getRequests: async (userId: string): Promise<Solicitud[]> => {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('colaborador_id', userId)
      .order('created_at', { ascending: false }); [cite_start]// [cite: 33]

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      colaboradorId: item.colaborador_id,
      empresaId: item.empresa_id,
      tipo: item.tipo as RequestType,
      estatus: item.estatus as RequestStatus,
      detalles: item.detalles,
      archivoUrl: item.archivo_url,
      createdAt: item.created_at
    })); [cite_start]// [cite: 34]
  },

  createRequest: async (userId: string, empresaId: string, tipo: RequestType, detalles: string): Promise<void> => {
    const { error } = await supabase
      .from('solicitudes')
      .insert([
        { 
          colaborador_id: userId, 
          empresa_id: empresaId,
          tipo, 
          detalles,
          estatus: RequestStatus.PENDING 
        }
      ]); [cite_start]// [cite: 35-36]

    if (error) throw error;
  }
};
