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
  Database,
  Code2,
  Loader2,
} from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { ProductFormModal } from './ProductFormModal.tsx';
import { SupabaseSqlModal } from './SupabaseSqlModal.tsx';
import { Logo } from '../brand/Logo.tsx';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    deleteProduct,
    toggleAvailability,
    toggleFeatured,
    setSelectedProduct,
    setActiveView,
    isLoadingProducts,
    supabaseError,
    isTableMissing,
    refreshProducts,
  } = useCatalog();

  const { logout, user } = useAuth();

  // State
  const [searchAdmin, setSearchAdmin] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats Counters
  const totalProducts = products.length;
  const availableCount = products.filter(p => p.available).length;
  const outOfStockCount = totalProducts - availableCount;
  const featuredCount = products.filter(p => p.featured).length;
  const categoriesCount = categories.length;

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

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (e) {
      console.error('Delete failed:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProducts();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Supabase Connection Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 px-4 rounded-2xl bg-white border border-[#381058]/10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#3ECF8E]" />
              <span className="text-xs font-bold text-[#381058]">Supabase Conectado en Tiempo Real</span>
              <span className="hidden md:inline font-mono text-[11px] text-gray-400 px-2 py-0.5 rounded bg-gray-100">
                eaortvuyhraehgoymohh
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing || isLoadingProducts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors cursor-pointer disabled:opacity-50"
              title="Refrescar sincronización con Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#8668D8] ${isRefreshing || isLoadingProducts ? 'animate-spin' : ''}`} />
              <span>Sincronizar</span>
            </button>

            <button
              onClick={() => setIsSqlModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#381058]/5 hover:bg-[#381058]/10 text-xs font-semibold text-[#381058] transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-[#8668D8]" />
              <span>Script SQL Supabase</span>
            </button>
          </div>
        </div>

        {/* Missing Table or Database Warning Banner */}
        {isTableMissing && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Acción requerida en Supabase
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  La tabla <code className="font-mono font-bold">products</code> aún no ha sido creada en tu base de datos de Supabase. Copia el script SQL y ejecútalo en el editor SQL de Supabase para habilitar el guardado y el bucket de imágenes.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSqlModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap shadow-xs"
            >
              Ver Script SQL de Supabase
            </button>
          </div>
        )}

        {/* Welcome & Quick Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#381058]">
              Dashboard de Inventario
            </h1>
            <p className="text-xs text-[#6B5B7E] mt-1">
              Hola, <span className="font-medium text-[#381058]">{user?.name || 'Administrador'}</span>. Administra productos, inventario, precios y fotografías en tiempo real sincronizados con Supabase.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#381058] hover:bg-[#4d1877] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar Producto</span>
          </button>
        </div>

        {/* Dashboard Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {/* Total Products */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#381058]/8 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Productos</span>
              <Package className="w-4 h-4 text-[#8668D8]" />
            </div>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-[#381058] tabular-nums">
              {isLoadingProducts ? '...' : totalProducts}
            </p>
          </div>

          {/* Available */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#381058]/8 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Disponibles</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-emerald-600 tabular-nums">
              {isLoadingProducts ? '...' : availableCount}
            </p>
          </div>

          {/* Out of Stock */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#381058]/8 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Agotados</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-rose-600 tabular-nums">
              {isLoadingProducts ? '...' : outOfStockCount}
            </p>
          </div>

          {/* Featured */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#381058]/8 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Destacados</span>
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-amber-600 tabular-nums">
              {isLoadingProducts ? '...' : featuredCount}
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

        {/* Tabs: Productos / Categorías */}
        <div className="flex items-center gap-2 border-b border-[#381058]/10 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
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
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#381058] text-white shadow-xs'
                : 'text-[#5a436e] hover:bg-[#FAF8F5]'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Portadas de Categorías ({categoriesCount})</span>
          </button>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-[#381058]/8 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchAdmin}
                  onChange={e => setSearchAdmin(e.target.value)}
                  placeholder="Buscar por nombre, SKU o palabra clave..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8668D8] bg-gray-50/50"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:inline">Filtrar:</span>
                <select
                  value={selectedCatFilter}
                  onChange={e => setSelectedCatFilter(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-white text-[#381058] font-medium focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
                >
                  <option value="all">Todas las categorías ({totalProducts})</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({products.filter(p => p.categoryId === cat.id).length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table Card */}
            <div className="bg-white rounded-2xl border border-[#381058]/8 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-[#FAF8F5] border-b border-[#381058]/8 text-[#381058] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Producto</th>
                      <th className="py-3.5 px-4">Categoría</th>
                      <th className="py-3.5 px-4">Precio</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4">Destacado</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {isLoadingProducts ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-[#8668D8]" />
                            <span className="text-xs font-medium">Cargando productos desde Supabase...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map(product => {
                        const cat = categories.find(c => c.id === product.categoryId);
                        const img = product.images?.[0];

                        return (
                          <tr key={product.id} className="hover:bg-purple-50/20 transition-colors">
                            {/* Product Info + Thumbnail */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-[#381058]/10 overflow-hidden shrink-0 flex items-center justify-center">
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
                                  <span className="font-semibold text-sm text-[#381058] truncate block">
                                    {product.name}
                                  </span>
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
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
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
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
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
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    window.history.pushState({}, '', '/');
                                    setActiveView('home');
                                  }}
                                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#381058] transition-colors cursor-pointer"
                                  title="Ver en tienda"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="p-2 rounded-lg hover:bg-[#8668D8]/10 text-gray-500 hover:text-[#8668D8] transition-colors cursor-pointer"
                                  title="Editar producto"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setProductToDelete(product)}
                                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
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
                        <td colSpan={6} className="py-16 text-center text-gray-400">
                          <div className="max-w-md mx-auto space-y-3">
                            <div className="w-12 h-12 rounded-full bg-purple-50 text-[#8668D8] flex items-center justify-center mx-auto">
                              <Package className="w-6 h-6" />
                            </div>
                            <p className="font-semibold text-sm text-[#381058]">
                              0 productos registrados en la base de datos de Supabase
                            </p>
                            <p className="text-xs text-[#6B5B7E]">
                              El inventario está listo. Haz clic en "Agregar Producto" para registrar tu primer artículo o subir su foto directamente a Supabase Storage.
                            </p>
                            <button
                              onClick={handleCreateNew}
                              className="px-5 py-2 rounded-xl bg-[#381058] text-white text-xs font-semibold hover:bg-[#4d1877] transition-all cursor-pointer shadow-xs"
                            >
                              + Agregar Primer Producto
                            </button>
                          </div>
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
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#381058]/8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6B5B7E]">
              <div>
                <span className="font-semibold text-[#381058]">Portadas Dinámicas e Inteligentes:</span> Cada tarjeta de categoría muestra automáticamente la fotografía del producto más reciente registrado en Supabase. Si no hay productos, luce el diseño Velvet Bloom de respaldo.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => {
                const categoryProducts = products.filter(p => p.categoryId === cat.id);
                const count = categoryProducts.length;

                const latestProductWithImage = [...categoryProducts]
                  .sort((a, b) => {
                    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
                    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
                    return timeB - timeA;
                  })
                  .find(p => Array.isArray(p.images) && p.images.length > 0 && Boolean(p.images[0]?.trim()));

                const displayImage = latestProductWithImage?.images?.[0] || (count > 0 ? cat.image : null);

                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl p-5 border border-[#381058]/8 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#381058] shrink-0 flex items-center justify-center">
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={cat.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/vb_cat_accesorios_1790107653497.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Sparkles className="w-6 h-6 text-[#C3A6FF]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-serif font-bold text-base text-[#381058] truncate">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-[#6B5B7E] line-clamp-2 mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#381058]">
                        {count} {count === 1 ? 'producto' : 'productos'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCatFilter(cat.id);
                          setActiveTab('products');
                        }}
                        className="text-[#8668D8] font-semibold hover:underline cursor-pointer"
                      >
                        Ver productos →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Create / Edit Modal with Supabase Integration */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        productToEdit={editingProduct}
      />

      {/* Supabase SQL Setup Modal */}
      <SupabaseSqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 border border-[#381058]/10 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#381058]">
                ¿Eliminar Producto de Supabase?
              </h3>
              <p className="text-xs text-[#6B5B7E] mt-1 leading-relaxed">
                Estás a punto de eliminar <strong className="text-[#381058]">"{productToDelete.name}"</strong> de forma permanente de tu base de datos de Supabase. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Eliminando...' : 'Eliminar Definitivamente'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
