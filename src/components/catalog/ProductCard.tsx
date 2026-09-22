import React, { useState } from 'react';
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

  const category = categories.find(c => c.id === product.categoryId);
  const mainImage = product.images?.[0] || '';

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

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#381058]/8 hover:border-[#8668D8]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Visual Product Media Container (65-75% height feel) */}
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

        {/* Quiet availability & demo text indicator */}
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

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-[#381058] shadow-md transition-colors"
            title="Ver detalles del producto"
            aria-label="Ver detalles del producto"
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
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="text-xs font-medium text-[#8668D8] hover:text-[#381058] transition-colors py-1 px-2 -mr-2"
          >
            Ver producto →
          </button>
        </div>
      </div>
    </article>
  );
};
