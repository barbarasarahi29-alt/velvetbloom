import React, { useState } from 'react';
import { Search, ShoppingBag, Lock, Menu, X, ArrowRight } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Logo } from '../brand/Logo.tsx';

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    activeView,
    setActiveView,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
  } = useCatalog();

  const { isAuthenticated, setIsLoginModalOpen } = useAuth();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'catalog', categorySlug?: string) => {
    setActiveView(view);
    if (categorySlug !== undefined) {
      setSelectedCategorySlug(categorySlug);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('catalog');
      setIsSearchExpanded(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#381058]/8 transition-all">
      {/* Top Bar Contract: Exactly 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element Brand mark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8668D8] rounded-lg"
          aria-label="Ir a página de inicio de Velvet Bloom"
        >
          <Logo variant="dark" size="md" className="h-[48px]" />
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors py-1 relative ${
              activeView === 'home'
                ? 'text-[#381058] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8668D8]'
                : 'text-[#58416c] hover:text-[#381058]'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => handleNavClick('catalog', undefined)}
            className={`transition-colors py-1 relative ${
              activeView === 'catalog'
                ? 'text-[#381058] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8668D8]'
                : 'text-[#58416c] hover:text-[#381058]'
            }`}
          >
            Catálogo
          </button>

          <button
            onClick={() => {
              if (activeView !== 'home') setActiveView('home');
              setTimeout(() => {
                const el = document.getElementById('historia-velvet');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-[#58416c] hover:text-[#381058] transition-colors py-1"
          >
            Quiénes somos
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Search, Cart, Admin) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time search trigger */}
          <div className="relative">
            {isSearchExpanded ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar en el catálogo..."
                  autoFocus
                  className="w-44 sm:w-60 text-xs sm:text-sm pl-8 pr-7 py-2 bg-white rounded-full border border-[#C3A6FF] text-[#381058] placeholder-[#8668D8]/60 focus:outline-none focus:ring-2 focus:ring-[#8668D8] shadow-sm"
                />
                <Search className="w-4 h-4 text-[#8668D8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="p-2 sm:p-2.5 text-[#58416c] hover:text-[#381058] hover:bg-[#C3A6FF]/15 rounded-full transition-colors"
                aria-label="Abrir buscador"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Cart Icon & Button with badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 sm:p-2.5 text-[#381058] bg-[#C3A6FF]/20 hover:bg-[#C3A6FF]/35 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8668D8]"
            aria-label={`Ver carrito con ${cartCount} productos`}
          >
            <ShoppingBag className="w-5 h-5 text-[#381058]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#381058] text-[#FAF8F5] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin shortcut */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                setActiveView('admin');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            className={`p-2 sm:p-2.5 rounded-full transition-colors ${
              activeView === 'admin'
                ? 'bg-[#381058] text-white shadow-sm'
                : 'text-[#8668D8] hover:text-[#381058] hover:bg-[#C3A6FF]/15'
            }`}
            title={isAuthenticated ? 'Panel Administrativo' : 'Acceso Administrador'}
            aria-label="Panel administrativo"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#381058] hover:bg-[#C3A6FF]/15 rounded-lg"
            aria-label="Menú de navegación"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#381058]/10 px-5 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="pt-2 pb-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar accesorios, detalles, bolsos..."
                className="w-full text-sm pl-9 pr-4 py-2.5 bg-white rounded-xl border border-[#C3A6FF]/60 text-[#381058] placeholder-[#8668D8]/60 focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
              />
              <Search className="w-4 h-4 text-[#8668D8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>

          <div className="flex flex-col space-y-1 pt-1 font-medium text-[#381058]">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#C3A6FF]/15 flex items-center justify-between"
            >
              <span>Inicio</span>
              <ArrowRight className="w-4 h-4 text-[#8668D8]" />
            </button>
            <button
              onClick={() => handleNavClick('catalog', undefined)}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#C3A6FF]/15 flex items-center justify-between"
            >
              <span>Catálogo Completo</span>
              <ArrowRight className="w-4 h-4 text-[#8668D8]" />
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (activeView !== 'home') setActiveView('home');
                setTimeout(() => {
                  const el = document.getElementById('historia-velvet');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#C3A6FF]/15 flex items-center justify-between"
            >
              <span>Quiénes somos</span>
              <ArrowRight className="w-4 h-4 text-[#8668D8]" />
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isAuthenticated) {
                  setActiveView('admin');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#C3A6FF]/15 flex items-center justify-between text-xs text-[#6B5B7E]"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                {isAuthenticated ? 'Panel Administrativo (Activo)' : 'Acceso de Administrador'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
