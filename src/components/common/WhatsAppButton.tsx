import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export const WhatsAppFloatingButton: React.FC = () => {
  const { getWhatsAppCartUrl, openWhatsAppUrl } = useCatalog();
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    openWhatsAppUrl(getWhatsAppCartUrl());
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-end flex-col gap-2">
      {/* Friendly delicate tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#381058] px-3.5 py-2 rounded-xl shadow-lg border border-[#C3A6FF]/40 text-xs font-medium animate-fadeIn">
          <span>¿Deseas atención personalizada? Escríbenos</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-gray-400 hover:text-gray-600 p-0.5"
            aria-label="Cerrar sugerencia"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
        aria-label="Contactar por WhatsApp a Velvet Bloom"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white relative z-10 transition-transform group-hover:rotate-6" />
      </button>
    </div>
  );
};
