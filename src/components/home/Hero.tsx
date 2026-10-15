import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Star,
  ShoppingBag,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { PetalSilhouette } from '../brand/FloralAccents.tsx';
import { Product } from '../../types/index.ts';

export const Hero: React.FC = () => {
  const {
    products,
    categories,
    isLoadingProducts,
    setActiveView,
    setSelectedCategorySlug,
    setSelectedProduct,
    getWhatsAppCartUrl,
    openWhatsAppUrl,
  } = useCatalog();

  // 1. Determine candidate products from Supabase:
  // Prefer products with featured: true; fallback to up to 5 most recent products if none are marked featured.
  const displayProducts = useMemo(() => {
    const featured = products.filter(p => p.featured);
    if (featured.length > 0) {
      return featured;
    }
    return products.slice(0, 5);
  }, [products]);

  const hasLiveProducts = displayProducts.length > 0;
  const slideCount = hasLiveProducts ? displayProducts.length : 1;

  // Active slide state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);

  // Monitor preloading of first image to guarantee smooth fade-in without flash
  useEffect(() => {
    if (displayProducts.length > 0) {
      const firstImg = displayProducts[0].images?.[0] || '';
      if (firstImg) {
        const img = new Image();
        img.src = firstImg;
        if (img.complete) {
          setFirstImageLoaded(true);
        } else {
          img.onload = () => setFirstImageLoaded(true);
          img.onerror = () => setFirstImageLoaded(true);
        }
      } else {
        setFirstImageLoaded(true);
      }
    } else if (!isLoadingProducts) {
      setFirstImageLoaded(true);
    }
  }, [displayProducts, isLoadingProducts]);

  // The carousel is loading while querying Supabase or waiting for the first real photo
  const isCarouselLoading = isLoadingProducts || (hasLiveProducts && !firstImageLoaded);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Clamp index if list changes in real time
  useEffect(() => {
    if (currentIndex >= slideCount) {
      setCurrentIndex(0);
    }
  }, [currentIndex, slideCount]);

  // 7-second automatic carousel rotation
  useEffect(() => {
    if (slideCount <= 1 || isHovered || isCarouselLoading) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slideCount);
    }, 7000);

    return () => clearInterval(timer);
  }, [slideCount, isHovered, isCarouselLoading, currentIndex]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slideCount);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + slideCount) % slideCount);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (diff > minSwipeDistance) {
      handleNext();
    } else if (diff < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Get active product or fallback data
  const currentProduct: Product | null = hasLiveProducts ? displayProducts[currentIndex] : null;

  // Resolve category name for current product
  const currentCategory = useMemo(() => {
    if (!currentProduct) return null;
    return categories.find(c => c.id === currentProduct.categoryId);
  }, [currentProduct, categories]);

  // Handle click on product (image or floating card)
  const handleItemClick = () => {
    if (currentProduct) {
      setSelectedProduct(currentProduct);
    } else {
      setActiveView('catalog');
      setSelectedCategorySlug(null);
    }
  };

  const getSlideImage = (p: Product | null): string => {
    if (p && Array.isArray(p.images) && p.images.length > 0 && p.images[0]?.trim()) {
      return p.images[0];
    }
    return '';
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#381058] via-[#43146b] to-[#2b0c44] text-[#FAF8F5] pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Delicate botanical background shapes */}
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#C3A6FF] font-medium tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C3A6FF]" />
              <span>HECHO PARA BRILLAR COMO TÚ</span>
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
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF8F5] text-[#381058] font-semibold text-sm hover:bg-[#FAF8F5]/90 transition-all shadow-xl hover:shadow-[#C3A6FF]/20 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
              >
                <span>Explorar catálogo</span>
                <ArrowRight className="w-4 h-4 text-[#8668D8]" />
              </button>

              <button
                onClick={() => openWhatsAppUrl(getWhatsAppCartUrl())}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Atención por WhatsApp</span>
              </button>
            </div>

            {/* Subtle trust markers */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-[#C3A6FF]/90 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3A6FF]" />
                <span>Accesorios para dama y caballero</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3A6FF]" />
                <span>Moda importada exclusiva</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3A6FF]" />
                <span>Envíos Nacionales y Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Showcase / Dynamic Real-Time Carousel */}
          <div className="lg:col-span-5 relative">
            <div
              className="relative mx-auto max-w-md lg:max-w-none group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              
              {/* Soft glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#8668D8]/30 via-[#C3A6FF]/20 to-transparent rounded-3xl blur-2xl -z-10" />

              {/* Main Image Frame & Slides Container */}
              <div
                onClick={handleItemClick}
                className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-[4/5] bg-gradient-to-br from-[#2D0A43] via-[#381058] to-[#1E052B] cursor-pointer select-none group/card"
                title={currentProduct ? `Ver detalle de ${currentProduct.name}` : 'Ver colección en el catálogo'}
              >
                {/* 1. Live Product Slides (Cross-fading with smooth transition) */}
                {hasLiveProducts &&
                  displayProducts.map((prod, idx) => {
                    const isActive = idx === currentIndex;
                    const imgUrl = getSlideImage(prod);
                    if (!imgUrl) return null;

                    return (
                      <div
                        key={prod.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          isActive && !isCarouselLoading
                            ? 'opacity-100 z-10'
                            : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          onLoad={() => {
                            if (idx === 0) setFirstImageLoaded(true);
                          }}
                          onError={() => {
                            if (idx === 0) setFirstImageLoaded(true);
                          }}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/card:scale-105"
                        />
                      </div>
                    );
                  })}

                {/* 2. Elegant Branded Standby view if Supabase returns 0 products (No static rose photo) */}
                {!isLoadingProducts && !hasLiveProducts && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#2D0A43] via-[#381058] to-[#1a0528] text-center text-[#FAF8F5]">
                    <div className="relative mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-[#C3A6FF]/30 flex items-center justify-center shadow-2xl">
                        <Sparkles className="w-8 h-8 text-[#C3A6FF]" />
                      </div>
                      <div className="absolute -inset-2 bg-[#C3A6FF]/20 rounded-2xl blur-xl -z-10" />
                    </div>
                    <span className="text-[11px] uppercase tracking-widest text-[#C3A6FF] font-semibold mb-1.5">
                      Colección Velvet Bloom
                    </span>
                    <h3 className="font-serif text-2xl font-normal text-[#FAF8F5] mb-2">
                      Próximos Ingresos
                    </h3>
                    <p className="text-xs text-[#FAF8F5]/70 max-w-xs leading-relaxed mb-5">
                      Accesorios y piezas exclusivas seleccionadas para ti. Explora las colecciones en nuestro catálogo.
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveView('catalog');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF8F5] text-[#381058] text-xs font-semibold hover:bg-[#FAF8F5]/90 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>Explorar catálogo</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8668D8]" />
                    </button>
                  </div>
                )}

                {/* 3. Soft and subtle protective bottom gradient overlay for text readability */}
                <div className="absolute inset-0 z-15 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

                {/* 4. Top Overlay Badge & Slide Progress Indicator */}
                {!isCarouselLoading && (
                  <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none transition-opacity duration-700">
                    {currentProduct?.featured ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#381058]/80 backdrop-blur-md border border-[#C3A6FF]/40 text-[#FAF8F5] text-[10px] font-semibold tracking-wider uppercase shadow-md">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>Destacado</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FAF8F5] text-[10px] font-semibold tracking-wider uppercase shadow-md">
                        <Sparkles className="w-3 h-3 text-[#C3A6FF]" />
                        <span>{hasLiveProducts ? 'Colección Exclusiva' : 'Detalle Especial'}</span>
                      </span>
                    )}

                    {/* Dot Indicators */}
                    {slideCount > 1 && (
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/15 pointer-events-auto">
                        {Array.from({ length: slideCount }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentIndex(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              idx === currentIndex
                                ? 'w-5 bg-[#C3A6FF]'
                                : 'w-1.5 bg-white/40 hover:bg-white/75'
                            }`}
                            aria-label={`Ir al producto ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Discrete Left & Right Navigation Arrows */}
                {!isCarouselLoading && slideCount > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#381058]/90 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-70 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                      aria-label="Producto anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#381058]/90 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-70 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                      aria-label="Siguiente producto"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* 6. Floating Synchronized Micro-Card */}
                <div
                  className={`absolute bottom-4 left-4 right-4 z-20 transition-opacity duration-700 ${
                    isCarouselLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick();
                    }}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#381058]/90 hover:bg-[#381058] backdrop-blur-md border border-white/20 text-white shadow-2xl flex items-center justify-between gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] tracking-widest uppercase text-[#C3A6FF] font-semibold">
                          {currentProduct?.featured
                            ? '★ Destacado'
                            : currentProduct
                            ? 'New Arrival'
                            : 'Colección'}
                        </span>
                        <span className="text-[10px] text-white/40">•</span>
                        <span className="text-[10px] text-[#FAF8F5]/80 font-medium truncate">
                          {currentCategory?.name || (hasLiveProducts ? 'Accesorios' : 'Velvet Bloom')}
                        </span>
                      </div>

                      <h3 className="font-serif text-sm sm:text-base font-semibold text-[#FAF8F5] truncate transition-colors">
                        {currentProduct?.name || 'Explora el catálogo Velvet Bloom'}
                      </h3>

                      <div className="flex items-center gap-2.5 mt-1">
                        {currentProduct ? (
                          <>
                            <span className="text-sm font-bold text-[#FAF8F5] font-sans">
                              ${currentProduct.price.toFixed(2)}
                            </span>
                            {currentProduct.available ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Disponible
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-rose-300">
                                Agotado
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#C3A6FF]">
                            <Sparkles className="w-3 h-3" />
                            Colección Exclusiva
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick();
                      }}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-[#8668D8] text-white transition-all shrink-0 hover:scale-105 shadow-xs cursor-pointer flex items-center justify-center"
                      title={currentProduct ? 'Ver fotos y pedir por WhatsApp' : 'Ver en catálogo'}
                      aria-label="Ver producto"
                    >
                      {currentProduct ? (
                        <Eye className="w-4 h-4 text-[#C3A6FF]" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-[#C3A6FF]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 7. Velvet Bloom Luxury Skeleton Shimmer Overlay */}
                <div
                  className={`absolute inset-0 z-30 bg-gradient-to-br from-[#2D0A43] via-[#381058] to-[#1E052B] flex flex-col justify-between p-6 transition-opacity duration-700 ease-in-out pointer-events-none ${
                    isCarouselLoading ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Diagonal Shimmer Sheen */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="w-[200%] h-full -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-[#C3A6FF]/15 to-transparent" />
                  </div>

                  {/* Soft background floral accent */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <PetalSilhouette className="w-64 h-64 text-[#C3A6FF] animate-pulse" />
                  </div>

                  {/* Top Badge Skeleton */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="h-6 w-28 rounded-full bg-white/10 backdrop-blur-md border border-white/15 animate-pulse" />
                    <div className="flex gap-1.5">
                      <div className="w-5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  {/* Center subtle branding loader */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-[#C3A6FF]/30 flex items-center justify-center shadow-lg animate-pulse">
                      <Sparkles className="w-6 h-6 text-[#C3A6FF]" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-serif text-base text-[#FAF8F5]/90 tracking-wide">Velvet Bloom</p>
                      <p className="text-[11px] text-[#C3A6FF]/70 tracking-widest uppercase font-medium">Cargando colección...</p>
                    </div>
                  </div>

                  {/* Bottom Micro-Card Skeleton */}
                  <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-[#381058]/80 backdrop-blur-md border border-white/15 shadow-xl flex items-center justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="h-2.5 w-24 bg-white/20 rounded-full animate-pulse" />
                      <div className="h-4 w-44 sm:w-56 bg-white/25 rounded-md animate-pulse" />
                      <div className="h-3 w-16 bg-[#C3A6FF]/30 rounded-full animate-pulse" />
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 animate-pulse shrink-0" />
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
