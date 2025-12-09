import React, { useState } from 'react';
import { useAuth } from '../App';
import { dataService } from '../services/dataService';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = isRegistering 
        ? await dataService.register(email) 
        : await dataService.login(email);
      login(user);
    } catch (error) {
      console.error("Auth error", error);
      alert("Error en autenticación. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Brand Area */}
        <div className="md:w-1/2 bg-brand-secondary p-12 text-center flex flex-col justify-center items-center relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-turmalina opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

          <div className="relative z-10 mb-8">
            <img src="/icon_light.png" alt="Logo" className="h-20 w-auto mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-2">disruptive<span className="text-brand-primary font-light">talent</span></h1>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">
            {isRegistering ? 'Únete a la Revolución' : 'Bienvenido de nuevo'}
          </h2>
          <p className="text-gray-300 relative z-10 max-w-xs mx-auto leading-relaxed">
            {isRegistering 
              ? 'Regístrate para gestionar tu desarrollo y beneficios en un solo lugar.' 
              : 'Accede a tu portal de colaborador y conecta con tu crecimiento.'}
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">Correo Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors h-5 w-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none bg-gray-50 focus:bg-white"
                  placeholder="nombre@disruptive.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors h-5 w-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-cyan-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/30 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-brand-secondary hover:text-brand-primary font-medium transition-colors"
            >
              {isRegistering 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿Eres nuevo? Regístrate aquí'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
