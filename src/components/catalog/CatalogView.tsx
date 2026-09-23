import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { ProductCard } from './ProductCard.tsx';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export const CatalogView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
  } = useCatalog();

  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Active Category Object
  const activeCategory = categories.find(c => c.slug === selectedCategorySlug);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategorySlug) {
      const cat = categories.find(c => c.slug === selectedCategorySlug);
      if (cat) {
        result = result.filter(p => p.categoryId === cat.id);
      }
    }

    // Filter by Availability
    if (onlyAvailable) {
      result = result.filter(p => p.available);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colors.some(c => c.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, categories, selectedCategorySlug, onlyAvailable, searchQuery, sortOption]);

  const handleClearFilters = () => {
    setSelectedCategorySlug(null);
    setSearchQuery('');
    setOnlyAvailable(false);
    setSortOption('featured');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 pt-8 sm:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-8 sm:mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8668D8] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colecciones Velvet Bloom</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#381058]">
            {activeCategory ? activeCategory.name : 'Nuestro Catálogo'}
          </h1>
          <p className="text-sm text-[#6B5B7E] mt-3">
            {activeCategory
              ? activeCategory.description
              : 'Explora nuestra gama de accesorios para dama y caballero, obsequios y detalles, bolsos, gorras, relojes, moda velvet y lencería. Selecciona tus favoritos y haz tu pedido directamente por WhatsApp.'}
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-[#381058]/8 mb-10 space-y-5">
          
          {/* Top row: Search input + Availability switch + Sort selector */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8668D8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, código SKU o color..."
                className="w-full text-xs sm:text-sm pl-10 pr-9 py-2.5 bg-[#FAF8F5] rounded-xl border border-[#381058]/10 text-[#381058] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter controls row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Only Available Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#381058] bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#381058]/10 hover:border-[#8668D8] transition-colors select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={e => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-[#381058] focus:ring-[#8668D8] border-gray-300"
                />
                <span>Solo disponibles</span>
              </label>

              {/* Sort selector */}
              <div className="flex items-center gap-2 bg-[#FAF8F5] px-3.5 py-2 rounded-xl border border-[#381058]/10 text-xs font-medium text-[#381058]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8668D8]" />
                <span className="text-gray-400 hidden sm:inline">Ordenar por:</span>
                <select
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-semibold text-[#381058] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name-asc">Nombre: A - Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs: Functional Segmented Controls */}
          <div className="pt-2 border-t border-[#381058]/6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategorySlug(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategorySlug === null
                    ? 'bg-[#381058] text-white shadow-sm'
                    : 'bg-[#FAF8F5] text-[#5a436e] hover:text-[#381058] hover:bg-[#C3A6FF]/20'
                }`}
              >
                Todas las Colecciones ({products.length})
              </button>

              {categories.map(cat => {
                const isSelected = selectedCategorySlug === cat.slug;
                const count = products.filter(p => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-[#381058] text-white shadow-sm'
                        : 'bg-[#FAF8F5] text-[#5a436e] hover:text-[#381058] hover:bg-[#C3A6FF]/20'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="ml-1.5 opacity-70 font-normal">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Active Filters Summary */}
        {(selectedCategorySlug || searchQuery || onlyAvailable) && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B5B7E]">
            <div className="flex items-center gap-2">
              <span>Mostrando {filteredProducts.length} resultados con filtros aplicados</span>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-[#8668D8] font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-20 text-center bg-white rounded-3xl border border-[#381058]/8 p-8 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#C3A6FF]/30 mx-auto flex items-center justify-center text-[#8668D8]">
              <Search className="w-7 h-7 opacity-50" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#381058]">
              No encontramos productos coincidentes
            </h3>
            <p className="text-xs text-[#6B5B7E] leading-relaxed">
              Intenta buscar con otros términos o limpia los filtros activos para ver todo el catálogo.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 rounded-full bg-[#381058] text-white text-xs font-semibold hover:bg-[#4d1877] transition-all"
            >
              Mostrar todos los productos
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
