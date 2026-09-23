import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  LogOut,
  Sparkles,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  Star,
  RefreshCw,
  FolderTree,
  AlertTriangle,
} from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { ProductFormModal } from './ProductFormModal.tsx';
import { Logo } from '../brand/Logo.tsx';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    deleteProduct,
    toggleAvailability,
    toggleFeatured,
    clearDemoProducts,
    restoreDemoProducts,
    setSelectedProduct,
    setActiveView,
  } = useCatalog();

  const { logout, user } = useAuth();

  // State
  const [searchAdmin, setSearchAdmin] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  // Stats Counters
  const totalProducts = products.length;
  const availableCount = products.filter(p => p.available).length;
  const outOfStockCount = totalProducts - availableCount;
  const featuredCount = products.filter(p => p.featured).length;
  const categoriesCount = categories.length;
  const demoCount = products.filter(p => p.isDemo).length;

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCatFilter === 'all' || p.categoryId === selectedCatFilter;
    const q = searchAdmin.toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-[#381058]/10 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setActiveView('home');
              }}
              className="text-left focus:outline-none cursor-pointer"
              title="Volver a la tienda"
            >
              <Logo size="sm" showSubtitle={false} />
            </button>
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#381058] text-white">
              Panel Administrativo
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setActiveView('catalog');
              }}
              className="text-xs font-medium text-[#381058] hover:text-[#8668D8] px-3 py-1.5 rounded-lg border border-[#381058]/10 bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              Ver Catálogo Público →
            </button>

            <button
              onClick={() => {
                logout();
                window.history.pushState({}, '', '/');
                setActiveView('home');
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Welcome & Quick Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#381058]">
              Dashboard de Inventario
            </h1>
            <p className="text-xs text-[#6B5B7E] mt-1">
              Hola, <span className="font-medium text-[#381058]">{user?.name || 'Administrador'}</span>. Administra productos, inventario, precios y fotografías en tiempo real.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#381058] hover:bg-[#4d1877] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar Producto</span>
          </button>
        </div>

        {/* Dashboard Stat Metric Cards (Mandatory from prompt) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {/* Total Products */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#381058]/8 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Productos</span>
              <Package className="w-4 h-4 text-[#8668D8]" />
            </div>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-[#381058] tabular-nums">
              {totalProducts}
            </p>
          </div>

          {/* Available */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#381058]/8 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Disponibles</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-emerald-600 tabular-nums">
              {availableCount}
            </p>
          </div>

          {/* Out of Stock */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#381058]/8 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Agotados</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-rose-600 tabular-nums">
              {outOfStockCount}
            </p>
          </div>

          {/* Featured */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#381058]/8 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Destacados</span>
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-amber-600 tabular-nums">
              {featuredCount}
            </p>
          </div>

          {/* Categories Count */}
          <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white border border-[#381058]/8 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Categorías</span>
              <Layers className="w-4 h-4 text-[#C3A6FF]" />
            </div>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-[#381058] tabular-nums">
              {categoriesCount}
            </p>
          </div>
        </div>

        {/* Demo Data Management Alert Banner */}
        {demoCount > 0 ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#C3A6FF]/20 border border-[#8668D8]/30 text-[#381058]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#8668D8] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Datos de Demostración Activos</h4>
                <p className="text-xs text-[#523d63]">
                  Hay {demoCount} productos creados como demostración visual. Puedes eliminarlos en cualquier momento para ingresar tus productos reales.
                </p>
              </div>
            </div>

            <button
              onClick={clearDemoProducts}
              className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 text-red-600 text-xs font-semibold border border-red-200 transition-colors shadow-2xs whitespace-nowrap"
            >
              Eliminar Todos los Productos Demo
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-gray-200 text-xs text-gray-600">
            <span>No hay productos de demostración en el catálogo. Todo el contenido es personalizado.</span>
            <button
              onClick={restoreDemoProducts}
              className="inline-flex items-center gap-1.5 text-xs text-[#8668D8] font-semibold hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Catálogo Demo Inicial</span>
            </button>
          </div>
        )}

        {/* Tabs: Productos / Categorías */}
        <div className="flex items-center gap-2 border-b border-[#381058]/10 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#381058] text-white shadow-xs'
                : 'text-[#5a436e] hover:bg-[#FAF8F5]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos ({totalProducts})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-[#381058] text-white shadow-xs'
                : 'text-[#5a436e] hover:bg-[#FAF8F5]'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categorías ({categoriesCount})</span>
          </button>
        </div>

        {/* Tab 1: Products Management Table */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#381058]/8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchAdmin}
                  onChange={e => setSearchAdmin(e.target.value)}
                  placeholder="Filtrar por nombre, SKU o descripción..."
                  className="w-full text-xs pl-9 pr-4 py-2 bg-[#FAF8F5] rounded-xl border border-gray-200 text-[#381058] focus:outline-none focus:ring-1 focus:ring-[#8668D8]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">Categoría:</span>
                <select
                  value={selectedCatFilter}
                  onChange={e => setSelectedCatFilter(e.target.value)}
                  className="bg-[#FAF8F5] border border-gray-200 text-xs rounded-xl px-3 py-2 text-[#381058] focus:outline-none font-medium"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table (Desktop & Mobile Responsive) */}
            <div className="bg-white rounded-3xl border border-[#381058]/8 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#381058]/8 bg-[#FAF8F5] text-[11px] uppercase tracking-wider text-[#6B5B7E]">
                      <th className="py-3.5 px-4 font-semibold">Producto</th>
                      <th className="py-3.5 px-4 font-semibold">Categoría</th>
                      <th className="py-3.5 px-4 font-semibold">Precio (USD)</th>
                      <th className="py-3.5 px-4 font-semibold">Disponibilidad</th>
                      <th className="py-3.5 px-4 font-semibold">Destacado</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#381058]/6 text-xs">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => {
                        const cat = categories.find(c => c.id === product.categoryId);
                        const img = product.images?.[0];

                        return (
                          <tr
                            key={product.id}
                            className="hover:bg-[#FAF8F5]/60 transition-colors group"
                          >
                            {/* Product Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-gray-200">
                                  {img ? (
                                    <img
                                      src={img}
                                      alt={product.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#8668D8]">
                                      <Sparkles className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-sm text-[#381058] truncate block">
                                      {product.name}
                                    </span>
                                    {product.isDemo && (
                                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                                        demo
                                      </span>
                                    )}
                                  </div>
                                  <span className="font-mono text-[10px] text-gray-400">
                                    SKU: {product.sku}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4 text-[#523d63] font-medium">
                              {cat?.name || 'General'}
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4 font-bold text-[#381058] tabular-nums text-sm">
                              ${product.price.toFixed(2)}
                            </td>

                            {/* Availability Toggle */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => toggleAvailability(product.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                                  product.available
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                }`}
                              >
                                {product.available ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Disponible</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3" />
                                    <span>Agotado</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Featured Toggle */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => toggleFeatured(product.id)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  product.featured
                                    ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                    : 'text-gray-300 hover:text-gray-400'
                                }`}
                                title={product.featured ? 'Destacado en inicio' : 'Marcar como destacado'}
                              >
                                <Star
                                  className={`w-4 h-4 ${product.featured ? 'fill-amber-400' : ''}`}
                                />
                              </button>
                            </td>

                            {/* Actions: View, Edit, Delete */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedProduct(product)}
                                  className="p-1.5 text-gray-400 hover:text-[#381058] hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Ver ficha de producto"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="p-1.5 text-[#8668D8] hover:text-[#381058] hover:bg-[#C3A6FF]/20 rounded-lg transition-colors"
                                  title="Editar producto"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setProductToDelete(product)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar producto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          No se encontraron productos con los filtros seleccionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Categories Overview */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl p-5 border border-[#381058]/8 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#8668D8]">0{idx + 1}</span>
                      <h3 className="font-serif text-lg font-bold text-[#381058] leading-tight">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#6B5B7E] mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#8668D8]">{count} productos vinculados</span>
                    <button
                      onClick={() => {
                        setSelectedCatFilter(cat.id);
                        setActiveTab('products');
                      }}
                      className="text-[#381058] hover:underline font-medium"
                    >
                      Ver productos →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Product Create / Edit Modal Form */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setProductToDelete(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 border border-red-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-gray-900">
                ¿Eliminar producto?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                ¿Estás seguro de que deseas eliminar permanentemente <strong>{productToDelete.name}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
