import React from 'react';
import { ArrowUpRight } from 'lucide-react';
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
            const count = products.filter(p => p.categoryId === cat.id).length;
            
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-[#381058]"
              >
                {/* Image backdrop */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-85 group-hover:opacity-95"
                />

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
