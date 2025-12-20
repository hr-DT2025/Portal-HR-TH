import { supabase } from './services/supabaseClient'; // Añade esta línea
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { dataService } from './services/dataService';
import { User } from './types';

// Importación de Páginas y Componentes
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Profile from './pages/Profile';
import CompleteProfileForm from './pages/CompleteProfileForm'; // Asegúrate de que esté en 'pages'
import Sidebar from './components/Sidebar';
import { Menu, X } from 'lucide-react';

// --- Definición del Contexto de Autenticación ---
interface AuthContextType {
  user: User | null;
  needsProfile: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

// --- Componente de Diseño (Layout) ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex items-center lg:hidden">
          <button onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <span className="ml-4 font-bold text-slate-800">Portal Colaborador</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

// --- Componente Principal App ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { user, needsProfile } = await dataService.getCurrentProfile();
      setUser(user);
      setNeedsProfile(needsProfile);
    } catch (error) {
      console.error("Error en checkAuth:", error);
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
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, needsProfile, checkAuth, logout }}>
      <HashRouter>
        <Routes>
          {/* Ruta Raíz: Decide a dónde enviar al usuario según su estado */}
          <Route path="/" element={
            user ? <Navigate to="/dashboard" /> : 
            (needsProfile ? <Navigate to="/completar-registro" /> : <Navigate to="/login" />)
          } />

          {/* Login */}
          <Route path="/login" element={!user && !needsProfile ? <Login /> : <Navigate to="/" />} />

          {/* Onboarding: Si tiene cuenta Auth pero no datos en la tabla profiles */}
          <Route path="/completar-registro" element={
            needsProfile ? <CompleteProfileForm /> : <Navigate to="/" />
          } />

          {/* Rutas Privadas */}
          <Route path="/dashboard" element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/" />} />
          <Route path="/requests" element={user ? <Layout><Requests /></Layout> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Layout><Profile /></Layout> : <Navigate to="/" />} />
          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}
