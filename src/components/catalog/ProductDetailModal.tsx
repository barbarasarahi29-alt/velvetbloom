import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, MessageCircle, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, categories, addToCart, getWhatsAppProductUrl, openWhatsAppUrl } = useCatalog();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
      setQuantity(1);
      setSelectedColor(selectedProduct.colors?.[0] || '');
      setSelectedSize(selectedProduct.sizes?.[0] || '');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const category = categories.find(c => c.id === selectedProduct.categoryId);
  const images = selectedProduct.images?.length > 0 ? selectedProduct.images : [''];

  const handleAddToCart = () => {
    if (!selectedProduct.available) return;
    addToCart(selectedProduct, quantity, selectedColor || undefined, selectedSize || undefined);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2000);
  };

  const handleWhatsAppConsult = () => {
    const url = getWhatsAppProductUrl(selectedProduct);
    openWhatsAppUrl(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={() => setSelectedProduct(null)} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-[#381058]/10 flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#381058] shadow-md transition-all hover:scale-105 active:scale-95"
          aria-label="Cerrar detalles del producto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery Module */}
        <div className="w-full md:w-1/2 bg-[#FAF8F5] p-4 sm:p-6 flex flex-col justify-between shrink-0">
          {/* Main Visual Display */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-[#381058]/5">
            {images[activeImageIndex] ? (
              <img
                src={images[activeImageIndex]}
                alt={`${selectedProduct.name} - Imagen ${activeImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#8668D8]">
                <Sparkles className="w-10 h-10 mb-2 opacity-60" />
                <span className="font-serif text-sm text-[#381058]">{selectedProduct.name}</span>
              </div>
            )}

            {/* Navigation arrows if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#381058] shadow-md transition-all"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#381058] shadow-md transition-all"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Availability Badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm ${
                  selectedProduct.available
                    ? 'bg-[#25D366] text-white'
                    : 'bg-[#381058] text-white'
                }`}
              >
                {selectedProduct.available ? 'Disponible' : 'Agotado'}
              </span>
            </div>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#381058] scale-102 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module & Information */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            {/* Category and SKU */}
            <div className="flex items-center justify-between text-xs text-[#8668D8] font-medium tracking-wider uppercase">
              <span>{category?.name || 'Colección Velvet Bloom'}</span>
              <span className="font-mono text-gray-400">SKU: {selectedProduct.sku}</span>
            </div>

            {/* Product Title */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#381058] leading-tight">
                {selectedProduct.name}
              </h2>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-[#381058] tabular-nums">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-gray-500">USD</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-[#463654] leading-relaxed border-t border-b border-[#381058]/8 py-3.5">
              <p>{selectedProduct.description}</p>
            </div>

            {/* Color Selector */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#381058] uppercase tracking-wider block">
                  Color / Tono: <span className="font-normal text-[#8668D8]">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedColor === color
                          ? 'bg-[#381058] text-white shadow-sm ring-2 ring-[#C3A6FF]'
                          : 'bg-[#FAF8F5] text-[#381058] border border-[#381058]/10 hover:border-[#8668D8]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#381058] uppercase tracking-wider block">
                  Tamaño / Medida: <span className="font-normal text-[#8668D8]">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-[#381058] text-white shadow-sm ring-2 ring-[#C3A6FF]'
                          : 'bg-[#FAF8F5] text-[#381058] border border-[#381058]/10 hover:border-[#8668D8]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Features Checklist */}
            {selectedProduct.features && selectedProduct.features.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#381058] uppercase tracking-wider block">
                  Detalles y Características:
                </span>
                <ul className="space-y-1.5 text-xs text-[#523d63]">
                  {selectedProduct.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#8668D8] mt-0.5 shrink-0">🌸</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-semibold text-[#381058] uppercase tracking-wider">
                Cantidad:
              </span>
              <div className="flex items-center bg-[#FAF8F5] border border-[#381058]/15 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-[#381058] hover:bg-[#C3A6FF]/20 font-bold text-sm transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className="px-3.5 py-1 text-sm font-semibold text-[#381058] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-[#381058] hover:bg-[#C3A6FF]/20 font-bold text-sm transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons: Add to Cart + Consult via WhatsApp */}
          <div className="mt-8 pt-5 border-t border-[#381058]/10 space-y-2.5">
            <button
              onClick={handleAddToCart}
              disabled={!selectedProduct.available}
              className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 ${
                selectedProduct.available
                  ? isAddedToast
                    ? 'bg-[#25D366] text-white'
                    : 'bg-[#381058] hover:bg-[#4d1877] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAddedToast ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>¡Agregado al Carrito!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>{selectedProduct.available ? 'Agregar al Carrito' : 'Producto Agotado'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppConsult}
              className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <MessageCircle className="w-5 h-5 fill-[#25D366] text-white" />
              <span>Consultar por WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
