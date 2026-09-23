import React from 'react';
import { MessageCircle, Sparkles, Send, Heart } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { PetalSilhouette } from '../brand/FloralAccents.tsx';

export const WhatsAppCallout: React.FC = () => {
  const { getWhatsAppCartUrl, openWhatsAppUrl } = useCatalog();

  const handleWhatsAppClick = () => {
    openWhatsAppUrl(getWhatsAppCartUrl());
  };

  return (
    <section id="historia-velvet" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Brand Story / Nuestra Esencia */}
        <div className="relative rounded-3xl bg-white p-8 sm:p-12 lg:p-16 border border-[#381058]/8 shadow-sm overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-15 pointer-events-none">
            <PetalSilhouette className="w-80 h-80 text-[#8668D8]" />
          </div>

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8668D8]">
              <Heart className="w-4 h-4 text-[#8668D8]" />
              <span>Quiénes somos</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#381058] leading-tight">
              Creemos que cada detalle cuenta una historia que merece florecer para siempre.
            </h2>

            <p className="text-sm sm:text-base text-[#5a436e] leading-relaxed">
              En VELVET BLOOM llevamos más de un año seleccionando e importando directamente accesorios para dama y caballero. Nos enfocamos en ofrecer piezas de alta durabilidad, calidad excepcional y diseños exclusivos que complementan tu estilo en cada ocasión.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-[#381058]/8 text-[#381058]">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8668D8]">100%</span>
                <p className="text-xs text-[#6B5B7E] mt-0.5">Importación Directa & Piezas Exclusivas</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8668D8]">1 AÑO</span>
                <p className="text-xs text-[#6B5B7E] mt-0.5">En el mercado ofreciendo la mejor calidad</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8668D8]">1 a 1</span>
                <p className="text-xs text-[#6B5B7E] mt-0.5">Atención Personalizada</p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Callout Action Block */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#381058] via-[#4d1877] to-[#381058] text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
          {/* Subtle floral backdrop elements */}
          <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 opacity-20 pointer-events-none">
            <PetalSilhouette className="w-72 h-72 text-[#C3A6FF]" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#C3A6FF] font-medium tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C3A6FF]" />
              <span>Pedidos directos y sin complicaciones</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
              ¿Tienes una ocasión especial o deseas armar un pedido personalizado?
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Escríbenos directamente a nuestro WhatsApp. Te asesoramos con tu pedido completamente. Sorprende a tu persona amada o regálate a ti mismo, todos los días son una ocasión especial.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleWhatsAppClick}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-base shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-102 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Comprar por WhatsApp</span>
              </button>

              <span className="text-xs text-[#C3A6FF]/80 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Respuesta rápida en minutos
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
