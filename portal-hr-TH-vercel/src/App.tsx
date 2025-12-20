import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import { dataService } from './services/dataService';
import { User } from './types';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Profile from './pages/Profile';
import CompleteProfileForm from './pages/CompleteProfileForm'; // Verifica que la ruta sea correcta
import Sidebar from './components/Sidebar';

// Iconos
import { Menu, X } from 'lucide-react';

// --- Contexto de Autenticación ---
interface AuthContextType {
  user: User | null;
  needsProfile: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

// --- Layout Principal (Mantiene tu diseño visual) ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Cerrar sidebar al cambiar de ruta en móviles
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Colores según tu marca */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <span className="text-xl font-bold tracking-wider text-white">PORTAL</span>
            <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <Sidebar />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex items-center lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-800">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-lg text-slate-800">Disruptive Talent</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// --- Componente Raíz App ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para validar sesión y perfil
  const checkAuth = async () => {
    setLoading(true);
    try {
      const { user: profileUser, needsProfile: profilePending } = await dataService.getCurrentProfile();
      setUser(profileUser);
      setNeedsProfile(profilePending);
    } catch (error) {
      console.error("Error validando sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNeedsProfile(false);
  };

  useEffect(() => {
    checkAuth();

    // Escuchar cambios de estado en Supabase (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setNeedsProfile(false);
      } else {
        checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-slate-600">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="font-medium">Cargando portal...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, needsProfile, checkAuth, logout }}>
      <HashRouter>
        <Routes>
          {/* Lógica de redirección inicial */}
          <Route path="/" element={
            user ? <Navigate to="/dashboard" /> : 
            (needsProfile ? <Navigate to="/completar-registro" /> : <Navigate to="/login" />)
          } />

          {/* Rutas Públicas */}
          <Route path="/login" element={
            !user && !needsProfile ? <Login /> : <Navigate to="/" />
          } />

          {/* Registro de Perfil (Onboarding) */}
          <Route path="/completar-registro" element={
            needsProfile ? <CompleteProfileForm /> : <Navigate to="/" />
          } />

          {/* Rutas Privadas Protegidas */}
          <Route path="/dashboard" element={
            user ? <Layout><Dashboard /></Layout> : <Navigate to="/" />
          } />
          
          <Route path="/requests" element={
            user ? <Layout><Requests /></Layout> : <Navigate to="/" />
          } />
          
          <Route path="/profile" element={
            user ? <Layout><Profile /></Layout> : <Navigate to="/" />
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}
