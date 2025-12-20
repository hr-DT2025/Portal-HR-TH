import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { dataService } from './services/dataService';
import { User } from './types';

// Importa tus componentes
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Profile from './pages/Profile';
import CompleteProfileForm from './components/CompleteProfileForm'; // Asegúrate de tener este import
import Sidebar from './components/Sidebar'; // Si usas el Layout interno
import { Menu, X } from 'lucide-react'; // Si usas íconos en Layout

// --- Context definition ---
interface AuthContextType {
  user: User | null;
  needsProfile: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

// ¡IMPORTANTE! Exportar el hook para usarlo en CompleteProfileForm
export const useAuth = () => useContext(AuthContext); [cite_start]// [cite: 5]

// --- Layout Component (Opcional, basado en tu V1) ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... (Tu código de Layout existente con Sidebar)
  // Por brevedad, asumo que usas el mismo Layout de V1
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
       <Sidebar /> 
       <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
       </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false); [cite_start]// [cite: 44]
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    // setLoading(true); // Opcional: dependerá de si quieres mostrar spinner en cada refresh
    const { user, needsProfile } = await dataService.getCurrentProfile();
    setUser(user);
    setNeedsProfile(needsProfile); [cite_start]// [cite: 45-46]
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNeedsProfile(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Cargando...</div>; [cite_start]// [cite: 47]

  return (
    <AuthContext.Provider value={{ user, needsProfile, checkAuth, logout }}>
      <HashRouter>
        <Routes>
          {/* 1. Login: Solo si no hay usuario ni perfil pendiente */}
          <Route path="/login" element={
            !user && !needsProfile ? <Login /> : <Navigate to="/" />
          } />

          {/* 2. Completar Registro: Si tiene sesión pero falta perfil */}
          <Route path="/completar-registro" element={
            needsProfile ? <CompleteProfileForm /> : <Navigate to="/" />
          [cite_start]} /> // [cite: 48]

          {/* 3. Rutas Protegidas: Solo si user existe completo */}
          <Route path="/" element={
            user ? <Layout><Dashboard /></Layout> : <Navigate to={needsProfile ? "/completar-registro" : "/login"} />
          } />
          
          <Route path="/dashboard" element={
            user ? <Layout><Dashboard /></Layout> : <Navigate to="/" />
          } />

          <Route path="/requests" element={
             user ? <Layout><Requests /></Layout> : <Navigate to="/" />
          } />

          <Route path="/profile" element={
             user ? <Layout><Profile /></Layout> : <Navigate to="/" />
          } />

        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}
