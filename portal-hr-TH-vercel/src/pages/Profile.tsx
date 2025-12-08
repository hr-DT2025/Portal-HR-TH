import React from 'react';
import { useAuth } from '../App';
import { User as UserIcon, Shield, Briefcase, Mail, Key } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-indigo-100 mb-4">
             <img src={user.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
          <p className="text-indigo-600 font-medium text-sm">{user.role}</p>
          <div className="mt-6 w-full pt-6 border-t border-gray-100 flex flex-col gap-2 text-sm text-gray-500">
             <div className="flex items-center justify-between">
                <span>Departamento</span>
                <span className="font-medium text-gray-800">{user.department}</span>
             </div>
             <div className="flex items-center justify-between">
                <span>Líder</span>
                <span className="font-medium text-gray-800">{user.leader}</span>
             </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Shield className="text-indigo-500" size={20} />
            Información de Cuenta
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    disabled
                    value={user.fullName}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Key className="text-gray-400" size={16} />
                Seguridad
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Actualizar Contraseña
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}