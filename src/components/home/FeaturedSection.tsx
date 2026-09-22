import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { ProductCard } from '../catalog/ProductCard.tsx';

export const FeaturedSection: React.FC = () => {
  const { products, setActiveView, setSelectedCategorySlug } = useCatalog();

  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#381058]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8668D8] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DESCUBRE NUESTROS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#381058]">
              Productos Destacados
            </h2>
          </div>

          <button
            onClick={() => {
              setActiveView('catalog');
              setSelectedCategorySlug(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#381058] hover:text-[#8668D8] transition-colors py-2 group"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
