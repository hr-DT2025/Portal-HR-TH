import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, User, LogOut, HeartHandshake } from 'lucide-react';
import { useAuth } from '../App';

export default function Sidebar() {
  const { logout, user } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-6 py-3 transition-colors ${
      isActive 
        ? 'bg-indigo-800 border-r-4 border-indigo-400 text-white' 
        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
    }`;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 hidden lg:block">
        <div className="flex items-center space-x-2 text-white mb-6">
          <HeartHandshake size={32} className="text-indigo-400" />
          <span className="text-2xl font-bold tracking-tight">CollabConnect</span>
        </div>
        <div className="text-xs text-indigo-300 uppercase tracking-wider font-semibold">
          Portal del Colaborador
        </div>
      </div>

      <nav className="flex-1 mt-4">
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard size={20} />
          <span>Inicio</span>
        </NavLink>
        <NavLink to="/requests" className={navClass}>
          <FileText size={20} />
          <span>Solicitudes</span>
        </NavLink>
        <NavLink to="/profile" className={navClass}>
          <User size={20} />
          <span>Mi Perfil</span>
        </NavLink>
      </nav>

      <div className="p-6 border-t border-indigo-800">
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src={user?.avatarUrl} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border-2 border-indigo-400"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-indigo-300 truncate">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center space-x-2 text-indigo-300 hover:text-white transition-colors text-sm w-full"
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}