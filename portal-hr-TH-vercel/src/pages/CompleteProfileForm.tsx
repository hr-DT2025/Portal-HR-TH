import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../App'; // Asegúrate de exportar useAuth en App.tsx
import { Empresa } from '../types';

const CompleteProfileForm = () => {
  const { checkAuth } = useAuth();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    fullName: '',
    empresaId: '', // Cambiado de empresaNombre a empresaId
    rolPuesto: '',
    area: ''
  });

  // Estados para el autocompletado de empresas
  const [empresaSearch, setEmpresaSearch] = useState('');
  const [empresasSugeridas, setEmpresasSugeridas] = useState<Empresa[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // Efecto para buscar empresas mientras el usuario escribe
  useEffect(() => {
    const search = async () => {
      if (empresaSearch.length >= 3) {
        // Necesitas asegurarte de tener esta función en tu dataService V2
        const resultados = await dataService.searchCompanies(empresaSearch);
        setEmpresasSugeridas(resultados);
        setMostrarSugerencias(true);
      } else {
        setEmpresasSugeridas([]);
        setMostrarSugerencias(false);
      }
    };
    
    // Pequeño delay para no saturar la BD (debounce simple)
    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [empresaSearch]);

  const seleccionarEmpresa = (empresa: Empresa) => {
    setFormData({ ...formData, empresaId: empresa.id });
    setEmpresaSearch(empresa.nombre); // Muestra el nombre visualmente
    setMostrarSugerencias(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empresaId) {
      alert("Por favor selecciona una empresa válida de la lista");
      return;
    }

    try {
      // Ahora sí enviamos el empresaId que espera el backend
      await dataService.completeRegistration(formData);
      await checkAuth(); // Actualiza el contexto y redirige
    } catch (err) {
      console.error(err);
      alert("Error al guardar perfil. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Finaliza tu registro en el Portal
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input 
              type="text" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          {/* Buscador de Empresa con Autocompletado */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Empresa</label>
            <input 
              type="text" 
              required 
              placeholder="Escribe para buscar..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={empresaSearch}
              onChange={(e) => {
                setEmpresaSearch(e.target.value);
                // Si el usuario borra, limpiamos el ID seleccionado
                if (formData.empresaId) setFormData({...formData, empresaId: ''});
              }}
            />
            
            {mostrarSugerencias && empresasSugeridas.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto mt-1">
                {empresasSugeridas.map((emp) => (
                  <li 
                    key={emp.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => seleccionarEmpresa(emp)}
                  >
                    {emp.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Área</label>
            <input 
              type="text" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: e.target.value})}
            />
          </div>

          {/* Rol / Puesto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Puesto / Cargo</label>
            <input 
              type="text" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={formData.rolPuesto}
              onChange={(e) => setFormData({...formData, rolPuesto: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Completar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileForm;
