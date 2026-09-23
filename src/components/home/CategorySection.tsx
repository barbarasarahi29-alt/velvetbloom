import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export const CategorySection: React.FC = () => {
  const { categories, products, setActiveView, setSelectedCategorySlug } = useCatalog();

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8668D8] mb-2">
              <span>Categorías</span>
              <span className="w-8 h-px bg-[#8668D8]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#381058]">
              Explora Nuestro Universo
            </h2>
          </div>
          <p className="text-sm text-[#6B5B7E] max-w-md leading-relaxed">
            Explora nuestras categorías seleccionadas: desde accesorios y piezas de moda hasta detalles, relojes y lencería. Opciones pensadas para elevar tu estilo en el día a día o en ocasiones especiales.
          </p>
        </div>

        {/* 8 Categories Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const categoryProducts = products.filter(p => p.categoryId === cat.id);
            const count = categoryProducts.length;

            // Dynamically select the image of the first / most recently updated product in this category
            const latestProductWithImage = [...categoryProducts]
              .sort((a, b) => {
                const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
                const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
                return timeB - timeA;
              })
              .find(p => Array.isArray(p.images) && p.images.length > 0 && Boolean(p.images[0]?.trim()));

            // Product image takes priority; if products exist with cat.image fallback; if empty, null for fallback UI
            const coverImage = latestProductWithImage?.images?.[0] || (count > 0 ? cat.image : null);

            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-[#381058]"
              >
                {/* Image backdrop or elegant Velvet Bloom fallback */}
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/vb_cat_accesorios_1790107653497.jpg';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-85 group-hover:opacity-95"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#381058] via-[#522578] to-[#1E052B] flex flex-col items-center justify-center relative overflow-hidden transition-transform duration-700 group-hover:scale-105">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(195,166,255,0.2),transparent_70%)]" />
                    <div className="relative z-10 flex flex-col items-center text-center px-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-[#C3A6FF] mb-3 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] uppercase tracking-widest text-[#C3A6FF]/80 font-medium">
                        Colección en Preparación
                      </span>
                    </div>
                  </div>
                )}

                {/* Subtle dark gradient scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#26073d]/90 via-[#381058]/35 to-transparent transition-opacity" />

                {/* Content Box */}
                <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between text-white z-10">
                  {/* Top: index and arrow */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#C3A6FF] font-medium tracking-wider">
                      0{index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#FAF8F5] group-hover:text-[#381058] transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Bottom: Title & Description */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider text-[#C3A6FF] font-semibold">
                        {count} {count === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight text-white group-hover:text-[#C3A6FF] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-white/90 line-clamp-3 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
