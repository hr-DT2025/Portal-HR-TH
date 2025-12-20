import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../App';

const CompleteProfileForm = () => {
  const { checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    empresaNombre: '',
    rolPuesto: '',
    area: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataService.completeRegistration(formData);
      checkAuth(); // Refresca el estado global y lo lleva al Dashboard
    } catch (err) {
      alert("Error al guardar perfil");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Finaliza tu registro en el Portal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Aquí van los inputs: Nombre, Empresa (Autocompletado), etc. */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Colaborador</label>
            <input 
              type="text" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          {/* ... Resto de campos del punto 1 ... */}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Registrarse al Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileForm;
