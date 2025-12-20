import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { dataService } from './services/dataService';
import { User } from './types';

// Extendemos el contexto
interface AuthContextType {
  user: User | null;
  needsProfile: boolean;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    const { user, needsProfile } = await dataService.getCurrentProfile();
    setUser(user);
    setNeedsProfile(needsProfile);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

  return (
    <AuthContext.Provider value={{ user, needsProfile, checkAuth }}>
      <HashRouter>
        <Routes>
          {/* Si no está logueado -> Login */}
          <Route path="/login" element={!user && !needsProfile ? <Login /> : <Navigate to="/" />} />

          {/* Si está logueado pero falta perfil -> Registro de Datos */}
          <Route path="/completar-registro" element={
            needsProfile ? <CompleteProfileForm /> : <Navigate to="/" />
          } />

          {/* Rutas Protegidas (Solo si user existe y perfil está completo) */}
          <Route path="/" element={
            user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />
          } />
          
          {/* ... otras rutas */}
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}
