import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useCatalog } from '../../context/CatalogContext.tsx';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { categories, addToCart, setSelectedProduct } = useCatalog();
  const [imageError, setImageError] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  const category = categories.find(c => c.id === product.categoryId);
  const mainImage = product.images?.[0] || '';

  // Deactivate card if user clicks/taps outside
  useEffect(() => {
    if (!isActive) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isActive]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;
    
    addToCart(
      product,
      1,
      product.colors?.[0] || undefined,
      product.sizes?.[0] || undefined
    );

    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1400);
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Touch screen detection for fluid mobile UX
    const isTouchScreen =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

    // On touch screens: first tap reveals options/expands description smoothly
    if (isTouchScreen && window.innerWidth < 1024 && !isActive) {
      e.preventDefault();
      setIsActive(true);
      return;
    }

    // On PC or second tap on mobile: open full product modal
    setSelectedProduct(product);
  };

  return (
    <article
      ref={cardRef}
      onClick={handleCardClick}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
        isActive
          ? 'border-[#8668D8] shadow-xl ring-2 ring-[#8668D8]/20'
          : 'border-[#381058]/8 hover:border-[#8668D8]/30 hover:shadow-lg'
      }`}
    >
      {/* Visual Product Media Container */}
      <div className="relative aspect-[4/4.2] sm:aspect-[4/4.5] w-full bg-[#FAF8F5] overflow-hidden">
        {!imageError && mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Zero-broken-image styled fallback container */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#FAF8F5] via-[#C3A6FF]/15 to-[#8668D8]/10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#C3A6FF]/25 flex items-center justify-center text-[#8668D8] mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-serif text-[#381058] font-medium max-w-[180px] line-clamp-2">
              {product.name}
            </span>
          </div>
        )}

        {/* Quiet availability & demo indicator */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {!product.available && (
            <span className="text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#381058]/90 text-white backdrop-blur-sm shadow-sm">
              Agotado
            </span>
          )}
          {product.featured && product.available && (
            <span className="text-[10px] font-medium tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#FAF8F5]/95 text-[#381058] border border-[#C3A6FF]/50 backdrop-blur-sm shadow-sm">
              Destacado
            </span>
          )}
          {product.isDemo && (
            <span className="text-[9px] tracking-wider uppercase px-2 py-0.5 rounded bg-black/40 text-white/90 backdrop-blur-xs">
              Demo
            </span>
          )}
        </div>

        {/* Subtle bottom scrim (max 20% opacity at bottom edge) for action buttons contrast without darkening the product photo */}
        <div
          className={`absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
          }`}
        />

        {/* Quick Actions Bar - visible on hover (desktop) or on active tap (mobile) */}
        <div
          className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-300 z-10 ${
            isActive
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none sm:pointer-events-auto sm:group-hover:opacity-100 sm:group-hover:translate-y-0'
          }`}
        >
          <button
            onClick={handleQuickAdd}
            disabled={!product.available}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              product.available
                ? isAddedRecently
                  ? 'bg-[#25D366] text-white'
                  : 'bg-[#381058] hover:bg-[#4d1877] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label={product.available ? 'Agregar al carrito' : 'Producto agotado'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAddedRecently ? '¡Agregado!' : 'Agregar'}</span>
          </button>

          <button
            onClick={handleOpenModal}
            className="p-2.5 rounded-xl bg-white/95 hover:bg-white text-[#381058] shadow-md transition-colors"
            title="Ver detalles completos del producto"
            aria-label="Ver detalles completos del producto"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between">
        <div>
          {/* Category - clean unboxed metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#8668D8] font-medium tracking-wider uppercase mb-1">
            <span>{category?.name || 'Velvet Bloom'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[10px] text-gray-400">{product.sku}</span>
          </div>

          {/* Title in refined serif */}
          <h3 className="font-serif text-base sm:text-lg font-semibold text-[#381058] line-clamp-2 leading-snug group-hover:text-[#8668D8] transition-colors">
            {product.name}
          </h3>

          {/* Mini Description: Clear & legible on mobile, fluid animated expansion on touch / desktop hover */}
          {product.description && (
            <div className="mt-2">
              <p
                className={`text-xs text-[#6B5B7E] leading-relaxed transition-all duration-300 ${
                  isActive
                    ? 'line-clamp-none text-[#381058] font-normal'
                    : 'line-clamp-2 group-hover:text-[#381058]'
                }`}
              >
                {product.description}
              </p>

              {/* Discreet touch indicator for mobile users */}
              <div className="block sm:hidden mt-1.5">
                {isActive ? (
                  <span className="text-[10px] font-semibold text-[#8668D8] flex items-center gap-1">
                    <span>Toca de nuevo para abrir modal</span>
                    <span>→</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-[#8668D8]/70 font-medium">
                    Toca para opciones rápidas
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price & availability footer */}
        <div className="mt-3 pt-3 border-t border-[#FAF8F5] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Precio</span>
            <span className="font-sans font-bold text-lg sm:text-xl text-[#381058] tabular-nums">
              ${product.price.toFixed(2)} <span className="text-xs font-normal text-gray-500">USD</span>
            </span>
          </div>

          <button
            onClick={handleOpenModal}
            className="text-xs font-medium text-[#8668D8] hover:text-[#381058] transition-colors py-1.5 px-2.5 rounded-lg hover:bg-[#8668D8]/10 flex items-center gap-1 group/btn"
          >
            <span>Ver producto</span>
            <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </article>
  );
};
