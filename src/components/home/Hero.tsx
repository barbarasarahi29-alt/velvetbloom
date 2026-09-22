import React from 'react';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { PetalSilhouette } from '../brand/FloralAccents.tsx';
import { ASSETS } from '../../data/initialData.ts';

export const Hero: React.FC = () => {
  const { setActiveView, setSelectedCategorySlug, getWhatsAppCartUrl, openWhatsAppUrl } = useCatalog();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#381058] via-[#43146b] to-[#2b0c44] text-[#FAF8F5] pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Delicate botanical background shapes (used with moderation) */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-15 pointer-events-none">
        <PetalSilhouette className="w-96 h-96 text-[#C3A6FF]" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-16 -translate-x-16 opacity-10 pointer-events-none">
        <PetalSilhouette className="w-80 h-80 text-[#FAF8F5]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Statement & Primary CTA */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Delicate Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#C3A6FF] font-medium tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C3A6FF]" />
              <span>Visita nuestro catálogo</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FAF8F5] leading-[1.14]">
                Estilo único, <br />
                <span className="italic font-light text-[#C3A6FF]">detalles</span> que marcan la diferencia.
              </h1>
              <p className="text-sm sm:text-base text-[#FAF8F5]/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Ofrecemos una sección exclusiva de accesorios para dama y caballero: joyería, relojes, bolsos, carteras y complementos diseñados para elevar tu estilo diario.
              </p>
            </div>

            {/* CTAs: Explorar catálogo & Comprar por WhatsApp */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => {
                  setActiveView('catalog');
                  setSelectedCategorySlug(null);
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF8F5] text-[#381058] font-semibold text-sm hover:bg-[#FAF8F5]/90 transition-all shadow-xl hover:shadow-[#C3A6FF]/20 flex items-center justify-center gap-2.5 active:scale-95"
              >
                <span>Explorar catálogo</span>
                <ArrowRight className="w-4 h-4 text-[#8668D8]" />
              </button>

              <button
                onClick={() => openWhatsAppUrl(getWhatsAppCartUrl())}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2.5 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Atención por WhatsApp</span>
              </button>
            </div>

            {/* Subtle trust markers */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#C3A6FF]/90 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3A6FF]" />
                <span>Catálogo en USD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3A6FF]" />
                <span>Accesorios para dama y caballero</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3A6FF]" />
                <span>Envíos coordinados</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Soft glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#8668D8]/30 via-[#C3A6FF]/20 to-transparent rounded-3xl blur-2xl -z-10" />

              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-[4/5] bg-[#381058]/40">
                <img
                  src={ASSETS.hero}
                  alt="Velvet Bloom - Composición de flores eternas y joyería"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Micro-Card 1: Detalles Eternos */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#381058]/85 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#C3A6FF] font-semibold block">
                      Detalle Especial
                    </span>
                    <h3 className="font-serif text-sm sm:text-base font-semibold">
                      New Arrival! Set collares: 1000 Te Amo
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setActiveView('catalog');
                      setSelectedCategorySlug('detalles');
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors shrink-0 text-[#C3A6FF]"
                    aria-label="Ver categoría de detalles"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
