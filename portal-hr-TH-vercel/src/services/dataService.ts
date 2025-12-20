import { supabase } from './supabaseClient';
import { User, Role } from '../types';

export const dataService = {
  // 1. Obtener la sesión actual y el perfil
  getCurrentProfile: async (): Promise<{ user: User | null, needsProfile: boolean }> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return { user: null, needsProfile: false };

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // Si no hay error y tenemos datos, el perfil existe
    if (profile && !error) {
      return { 
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          role: profile.role as Role,
          empresaId: profile.empresa_id,
          // ... otros campos
        }, 
        needsProfile: false 
      };
    }

    // Si no hay perfil en la tabla 'profiles', pero sí hay sesión de Auth
    return { user: null, needsProfile: true };
  },

  // 2. Crear el perfil inicial (El "Login para nuevos usuarios" del punto 1)
  completeRegistration: async (userData: Partial<User> & { password?: string }) => {
    // Aquí el usuario ya se autenticó o se está registrando. 
    // Insertamos en la tabla profiles
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) throw new Error("No hay sesión activa");

    const { error } = await supabase
      .from('profiles')
      .insert([{
        id: authUser.id,
        email: authUser.email,
        full_name: userData.fullName,
        empresa_id: userData.empresaId, // ID obtenido del autocompletado
        role: Role.COLLABORATOR,
        // Los campos del punto 2 se llenarán aquí o en el perfil
        area: userData.area,
        rol_puesto: userData.rolPuesto
      }]);

    if (error) throw error;
  }
};
