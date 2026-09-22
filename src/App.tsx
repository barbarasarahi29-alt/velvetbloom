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
  const { activeView } = useCatalog();
  const { isAuthenticated, setIsLoginModalOpen } = useAuth();

  // If user navigated to #admin while unauthenticated, open the login modal
  useEffect(() => {
    if (activeView === 'admin' && !isAuthenticated) {
      setIsLoginModalOpen(true);
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

  // Public Catalog & Storefront View
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
