import React from 'react';
import { MessageCircle, Heart, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Logo } from '../brand/Logo.tsx';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategorySlug, categories, getWhatsAppCartUrl, openWhatsAppUrl } = useCatalog();
  const { isAuthenticated, setIsLoginModalOpen } = useAuth();

  return (
    <footer className="bg-[#230938] text-[#FAF8F5] pt-16 pb-12 border-t border-[#381058]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand highlight banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-[#FAF8F5]/10 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-11 h-11 rounded-full bg-[#8668D8]/20 flex items-center justify-center shrink-0 text-[#C3A6FF]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm tracking-wide text-[#FAF8F5]">Diseños Exclusivos</h4>
              <p className="text-xs text-[#FAF8F5]/60 mt-0.5">Piezas seleccionadas con estética delicada y premium.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-11 h-11 rounded-full bg-[#8668D8]/20 flex items-center justify-center shrink-0 text-[#C3A6FF]">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm tracking-wide text-[#FAF8F5]">Detalles Inolvidables</h4>
              <p className="text-xs text-[#FAF8F5]/60 mt-0.5">Flores preservadas eternas y collares con significado.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-11 h-11 rounded-full bg-[#8668D8]/20 flex items-center justify-center shrink-0 text-[#C3A6FF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm tracking-wide text-[#FAF8F5]">Atención Directa</h4>
              <p className="text-xs text-[#FAF8F5]/60 mt-0.5">Asesoría personalizada y pedidos fáciles vía WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Navigation & Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 leading-relaxed max-w-sm">
              Una experiencia pensada para regalar momentos y lucir con distinción. Descubre nuestra colección de accesorios, flores eternas, bolsos y relojes.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openWhatsAppUrl(getWhatsAppCartUrl())}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba59] transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>+58 412 645 7391</span>
              </button>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="font-serif text-base tracking-wider uppercase text-[#C3A6FF] font-semibold mb-4">
              Categorías
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FAF8F5]/70">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setActiveView('catalog');
                      setSelectedCategorySlug(cat.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#C3A6FF] transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Boutique Assistance */}
          <div>
            <h3 className="font-serif text-base tracking-wider uppercase text-[#C3A6FF] font-semibold mb-4">
              Atención al Cliente
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FAF8F5]/70">
              <li>
                <span className="text-white block font-medium">Horario de Respuestas:</span>
                <span className="text-[#FAF8F5]/60">Lunes a Domingo · 8:00 AM – 9:00 PM</span>
              </li>
              <li>
                <span className="text-white block font-medium">Moneda del Catálogo:</span>
                <span className="text-[#FAF8F5]/60">USD ($) · Consultar tasa de cambio al ordenar</span>
              </li>
              <li>
                <span className="text-white block font-medium">Envíos y Entregas:</span>
                <span className="text-[#FAF8F5]/60">Envíos a todo el país y entregas coordinadas</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Boutique Commitment */}
          <div className="space-y-4">
            <h3 className="font-serif text-base tracking-wider uppercase text-[#C3A6FF] font-semibold mb-4">
              Pedidos por WhatsApp
            </h3>
            <p className="text-xs text-[#FAF8F5]/70 leading-relaxed">
              Agrega tus productos favoritos al carrito y con un solo clic envíanos tu orden detallada a nuestro chat oficial para coordinar pago y entrega inmediata.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#C3A6FF]">
              🌸 ¿Buscas un detalle personalizado para una fecha especial? Escríbenos y preparamos tu sorpresa.
            </div>
          </div>
        </div>

        {/* Bottom copyright and admin */}
        <div className="pt-8 border-t border-[#FAF8F5]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/50">
          <p>© {new Date().getFullYear()} VELVET BLOOM. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setActiveView('admin');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="hover:text-[#C3A6FF] transition-colors inline-flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Panel Administrativo' : 'Portal de Administración'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
