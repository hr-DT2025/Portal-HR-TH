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
  // --- AUTENTICACIÓN ---

  // Registro de nuevo colaborador
  register: async (email: string, password: string, fullName: string, empresaNombre: string): Promise<{ user: User | null, error: any }> => {
    // 1. Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return { user: null, error: authError };

    if (authData.user) {
      // 2. Crear el perfil en la tabla 'profiles'
      // Nota: En un entorno real, podrías buscar si la empresa ya existe o crearla
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, 
            email, 
            full_name: fullName,
            role: Role.COLLABORATOR // Por defecto entran como colaboradores
          }
        ])
        .select()
        .single();

      if (profileError) return { user: null, error: profileError };
      
      return { 
        user: {
          id: profileData.id,
          email: profileData.email,
          fullName: profileData.full_name,
          role: profileData.role as Role,
        }, 
        error: null 
      };
    }
    
    return { user: null, error: 'Error desconocido' };
  },

  // Inicio de sesión
  login: async (email: string, password: string): Promise<{ user: User | null, error: any }> => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) return { user: null, error: authError };

    // Buscar los datos del perfil asociado
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) return { user: null, error: profileError };

    return {
      user: {
        id: profileData.id,
        email: profileData.email,
        fullName: profileData.full_name,
        role: profileData.role as Role,
        empresaId: profileData.empresa_id,
        area: profileData.area,
        rolPuesto: profileData.rol_puesto,
        fechaIngreso: profileData.fecha_ingreso,
        tipoIdentificacion: profileData.tipo_identificacion,
        numeroIdentificacion: profileData.numero_identificacion,
        correoPersonal: profileData.correo_personal,
        telefonoWhatsapp: profileData.telefono_whatsapp,
      },
      error: null
    };
  },

  // --- EMPRESAS (Para el Autocompletado) ---
  searchCompanies: async (query: string): Promise<Empresa[]> => {
    if (query.length < 3) return [];
    
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .ilike('nombre', `%${query}%`)
      .limit(5);

    if (error) return [];
    return data.map(emp => ({
      id: emp.id,
      nombre: emp.nombre,
      nitIdentificacion: emp.nit_identificacion
    }));
  },

  // --- SOLICITUDES (Constancias/Referencias) ---
  getRequests: async (userId: string): Promise<Solicitud[]> => {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('colaborador_id', userId)
      .order('created_at', { ascending: false });

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
    }));
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
      ]);

    if (error) throw error;
    
    // Aquí es donde se dispararía el Webhook de n8n automáticamente 
    // si configuras un "Database Webhook" en el panel de Supabase.
  },

  // --- PERFIL ---
  updateProfile: async (userId: string, updates: Partial<User>): Promise<void> => {
    const { error } = await supabase
      .from('profiles')
      .update({
        tipo_identificacion: updates.tipoIdentificacion,
        numero_identificacion: updates.numeroIdentificacion,
        correo_personal: updates.correoPersonal,
        telefono_whatsapp: updates.telefonoWhatsapp,
        updated_at: new Date()
      })
      .eq('id', userId);

    if (error) throw error;
  }
};
