import React, { useEffect } from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { WhatsAppFloatingButton } from './components/common/WhatsAppButton.tsx';
import { Hero } from './components/home/Hero.tsx';
import { CategorySection } from './components/home/CategorySection.tsx';
import { FeaturedSection } from './components/home/FeaturedSection.tsx';
import { WhatsAppCallout } from './components/home/WhatsAppCallout.tsx';
import { CatalogView } from './components/catalog/CatalogView.tsx';
import { ProductDetailModal } from './components/catalog/ProductDetailModal.tsx';
import { CartDrawer } from './components/cart/CartDrawer.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { AdminLoginModal } from './components/admin/AdminLoginModal.tsx';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView } = useCatalog();
  const { isAuthenticated, setIsLoginModalOpen } = useAuth();

  // Listen to browser URL routing (specifically /admin)
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isAdminRoute = path === '/admin' || path === '/admin/' || hash === '#admin';

      if (isAdminRoute) {
        if (activeView !== 'admin') {
          setActiveView('admin');
        }
        if (!isAuthenticated) {
          setIsLoginModalOpen(true);
        }
      } else if (activeView === 'admin' && !isAdminRoute) {
        setActiveView('home');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);

    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, [activeView, setActiveView, isAuthenticated, setIsLoginModalOpen]);

  // Keep browser address bar in sync when navigating to admin
  useEffect(() => {
    if (activeView === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
      if (!isAuthenticated) {
        setIsLoginModalOpen(true);
      }
    }
  }, [activeView, isAuthenticated, setIsLoginModalOpen]);

  // If in admin view and authenticated, show full admin dashboard
  if (activeView === 'admin' && isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#241432]">
        <AdminDashboard />
        <ProductDetailModal />
        <AdminLoginModal />
      </div>
    );
  }

  // If accessed directly via /admin but not yet logged in, show protected portal entry
  const isDirectAdmin =
    typeof window !== 'undefined' &&
    (window.location.pathname.toLowerCase() === '/admin' ||
      window.location.pathname.toLowerCase() === '/admin/' ||
      window.location.hash.toLowerCase() === '#admin' ||
      activeView === 'admin');

  if (isDirectAdmin && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] px-4 selection:bg-[#C3A6FF]/40">
        <div className="text-center max-w-sm mx-auto space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-[#381058]/10 text-[#381058]">
            <span className="font-serif font-bold text-xl tracking-tight">VELVET BLOOM</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#381058]">
            Portal de Administración
          </h1>
          <p className="text-xs text-[#6B5B7E]">
            Se requiere autenticación para acceder al panel de inventario y configuración.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#381058] hover:bg-[#4d1877] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setActiveView('home');
              }}
              className="w-full py-2 px-4 rounded-xl text-xs text-[#5a436e] hover:text-[#381058] hover:bg-[#381058]/5 transition-colors cursor-pointer"
            >
              ← Ir a la Tienda Pública
            </button>
          </div>
        </div>
        <AdminLoginModal />
      </div>
    );
  }

  // Public Catalog & Storefront View (Clients Only)
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#241432] selection:bg-[#C3A6FF]/40 selection:text-[#381058]">
      {/* Top Bar Navigation */}
      <Header />

      {/* Main Page Content depending on activeView */}
      <main className="flex-1">
        {activeView === 'catalog' ? (
          <CatalogView />
        ) : (
          <>
            <Hero />
            <CategorySection />
            <FeaturedSection />
            <WhatsAppCallout />
          </>
        )}
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* Floating Always-Accessible WhatsApp Action */}
      <WhatsAppFloatingButton />

      {/* Overlays / Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <AdminLoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <MainLayout />
      </CatalogProvider>
    </AuthProvider>
  );
}
