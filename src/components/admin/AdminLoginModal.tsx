import React, { useState } from 'react';
import { X, Lock, Sparkles, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth, DEFAULT_ADMIN } from '../../context/AuthContext.tsx';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { Logo } from '../brand/Logo.tsx';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
  const { setActiveView } = useCatalog();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(email, password);
    if (res.success) {
      setActiveView('admin');
      setIsLoginModalOpen(false);
      setEmail('');
      setPassword('');
    } else {
      setErrorMsg(res.error || 'Credenciales no válidas');
    }
  };

  const handleUseDemoCredentials = () => {
    setEmail(DEFAULT_ADMIN.email);
    setPassword(DEFAULT_ADMIN.password);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={() => setIsLoginModalOpen(false)} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-[#381058]/10 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#381058] rounded-full hover:bg-[#FAF8F5] transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#C3A6FF]/25 text-[#381058] mb-1">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#381058]">
            Panel de Administración
          </h2>
          <p className="text-xs text-[#6B5B7E]">
            Acceso exclusivo para gestión de productos, inventario y catálogo.
          </p>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1.5">
              Usuario o Correo
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@velvetbloom.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#381058] focus:outline-none focus:ring-2 focus:ring-[#8668D8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#381058] focus:outline-none focus:ring-2 focus:ring-[#8668D8] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#381058] hover:bg-[#4d1877] text-white text-sm font-semibold transition-all shadow-md active:scale-98"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Demo Credentials Auto-Fill box */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C3A6FF]/40 text-xs text-[#381058] space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5 text-[#8668D8]">
              <KeyRound className="w-3.5 h-3.5" />
              Credenciales de Administrador:
            </span>
            <button
              type="button"
              onClick={handleUseDemoCredentials}
              className="text-[#381058] hover:underline font-bold text-[11px] bg-white px-2 py-0.5 rounded border border-[#C3A6FF]"
            >
              Autollenar
            </button>
          </div>
          <div className="text-[11px] font-mono text-[#5a436e] space-y-0.5">
            <div>Usuario: <span className="text-[#381058] font-bold">{DEFAULT_ADMIN.email}</span></div>
            <div>Contraseña: <span className="text-[#381058] font-bold">{DEFAULT_ADMIN.password}</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};
