import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, CartItem, ViewMode } from '../types/index.ts';
import { INITIAL_CATEGORIES } from '../data/initialData.ts';
import { supabase } from '../lib/supabase.ts';

const STORAGE_KEYS = {
  CATEGORIES: 'velvet_bloom_categories_v1',
  CART: 'velvet_bloom_cart_v1',
};

const WHATSAPP_NUMBER = '584126457391';

interface CatalogContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Supabase state
  isLoadingProducts: boolean;
  supabaseError: string | null;
  isTableMissing: boolean;
  refreshProducts: () => Promise<void>;

  // Product CRUD (Live with Supabase)
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  clearDemoProducts: () => void;
  restoreDemoProducts: () => void;

  // Cart Actions
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // WhatsApp Link Helpers
  getWhatsAppProductUrl: (product: Product) => string;
  getWhatsAppCartUrl: () => string;
  openWhatsAppUrl: (url: string) => void;
}

const sanitizeImagePath = (url: string): string => {
  if (!url) return url;
  if (url.includes('1611591475817-062e08fbca4b')) {
    return '/images/cat_accesorios_caballero_1790186191750.jpg';
  }
  if (url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/images/');
  }
  if (url.startsWith('src/assets/images/')) {
    return url.replace('src/assets/images/', '/images/');
  }
  if (url.startsWith('/src/assets/')) {
    return url.replace('/src/assets/', '/');
  }
  return url;
};

const sanitizeProduct = (p: Product): Product => ({
  ...p,
  images: Array.isArray(p.images) ? p.images.map(sanitizeImagePath) : [],
});

const sanitizeCategory = (c: Category): Category => ({
  ...c,
  image: sanitizeImagePath(c.image),
});

const normalizeCategories = (rawCats: Category[]): Category[] => {
  const hasNewSchema = rawCats.some(c => c.id === 'cat-dama' || c.id === 'cat-caballero');
  if (!hasNewSchema) {
    return INITIAL_CATEGORIES;
  }
  const catMap = new Map<string, Category>();
  INITIAL_CATEGORIES.forEach(c => catMap.set(c.id, c));
  rawCats.forEach(c => {
    if (!catMap.has(c.id)) {
      catMap.set(c.id, sanitizeCategory(c));
    }
  });
  return Array.from(catMap.values());
};

const mapRowToProduct = (row: any): Product => {
  const imageUrl = row.image_url || '';
  let images: string[] = [];

  if (Array.isArray(row.images) && row.images.length > 0) {
    images = row.images.filter(Boolean);
    if (imageUrl && !images.includes(imageUrl)) {
      images.unshift(imageUrl);
    }
  } else if (imageUrl) {
    images = [imageUrl];
  }

  const categoryId = row.category || 'cat-dama';
  const rawId = String(row.id);
  const slug =
    (row.name || 'producto')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${rawId.slice(0, 4)}`;

  return {
    id: rawId,
    name: row.name || 'Sin nombre',
    slug,
    description: row.description || '',
    price: Number(row.price) || 0,
    sku: row.sku || `VB-${rawId.slice(0, 6).toUpperCase()}`,
    categoryId,
    images: images.map(sanitizeImagePath),
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    features: Array.isArray(row.features) ? row.features : [],
    available: row.available !== false,
    featured: Boolean(row.featured),
    isDemo: false,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  };
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live products from Supabase (starts with 0 products)
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isTableMissing, setIsTableMissing] = useState<boolean>(false);

  // Load categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeCategories(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load categories from localStorage', e);
    }
    return INITIAL_CATEGORIES;
  });

  // Load cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            ...item,
            product: sanitizeProduct(item.product),
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Persist categories
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  // Handle URL hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        setActiveView('admin');
      } else if (hash.startsWith('#catalogo')) {
        setActiveView('catalog');
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const catSlug = params.get('categoria');
        if (catSlug) {
          setSelectedCategorySlug(catSlug);
        }
      } else {
        setActiveView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Update hash when activeView changes
  useEffect(() => {
    if (activeView === 'admin') {
      window.location.hash = '#admin';
    } else if (activeView === 'catalog') {
      window.location.hash = selectedCategorySlug ? `#catalogo?categoria=${selectedCategorySlug}` : '#catalogo';
    } else {
      window.location.hash = '#inicio';
    }
  }, [activeView, selectedCategorySlug]);

  // Fetch products from Supabase
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase products query returned error:', error);
        if (
          error.code === 'PGRST205' ||
          error.message?.toLowerCase().includes('could not find the table') ||
          error.message?.toLowerCase().includes('relation "public.products" does not exist')
        ) {
          setIsTableMissing(true);
          setSupabaseError('La tabla "products" aún no ha sido creada en tu base de datos de Supabase.');
        } else {
          setSupabaseError(error.message);
        }
        setProducts([]);
        return;
      }

      setIsTableMissing(false);
      setSupabaseError(null);

      if (Array.isArray(data)) {
        const mapped = data.map(mapRowToProduct);
        setProducts(mapped);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Error fetching products from Supabase:', err);
      setSupabaseError(err.message || 'Error de conexión con Supabase');
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Initialize and subscribe to Supabase Realtime changes
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('velvet_bloom_products_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Realtime change event from Supabase products:', payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  // Product CRUD (Live with Supabase)
  const addProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const imageUrl = data.images?.[0] || '';

    // Full schema payload
    const fullPayload = {
      name: data.name,
      description: data.description || '',
      price: Number(data.price) || 0,
      category: data.categoryId,
      image_url: imageUrl,
      sku: data.sku,
      available: data.available !== false,
      featured: Boolean(data.featured),
      colors: data.colors || [],
      sizes: data.sizes || [],
      features: data.features || [],
      images: data.images || [],
    };

    const { data: insertedData, error } = await supabase
      .from('products')
      .insert([fullPayload])
      .select()
      .single();

    if (error) {
      console.warn('Full payload insert failed, checking column fallback:', error);
      // Fallback if table only has standard 7 columns (id, name, description, price, category, image_url, created_at)
      if (error.code === 'PGRST204' || error.message?.includes('column')) {
        const corePayload = {
          name: data.name,
          description: data.description || '',
          price: Number(data.price) || 0,
          category: data.categoryId,
          image_url: imageUrl,
        };
        const { data: coreData, error: coreErr } = await supabase
          .from('products')
          .insert([corePayload])
          .select()
          .single();

        if (coreErr) {
          console.error('Error inserting product in Supabase:', coreErr);
          throw coreErr;
        }

        const newProd = mapRowToProduct(coreData);
        setProducts(prev => [newProd, ...prev.filter(p => p.id !== newProd.id)]);
        return newProd;
      }
      throw error;
    }

    const newProd = mapRowToProduct(insertedData);
    setProducts(prev => [newProd, ...prev.filter(p => p.id !== newProd.id)]);
    return newProd;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.categoryId !== undefined) payload.category = updates.categoryId;
    if (updates.images !== undefined) {
      payload.image_url = updates.images[0] || '';
      payload.images = updates.images;
    }
    if (updates.sku !== undefined) payload.sku = updates.sku;
    if (updates.available !== undefined) payload.available = updates.available;
    if (updates.featured !== undefined) payload.featured = updates.featured;
    if (updates.colors !== undefined) payload.colors = updates.colors;
    if (updates.sizes !== undefined) payload.sizes = updates.sizes;
    if (updates.features !== undefined) payload.features = updates.features;

    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST204' || error.message?.includes('column')) {
        // Fallback with only the core fields
        const corePayload: Record<string, any> = {};
        if (updates.name !== undefined) corePayload.name = updates.name;
        if (updates.description !== undefined) corePayload.description = updates.description;
        if (updates.price !== undefined) corePayload.price = Number(updates.price);
        if (updates.categoryId !== undefined) corePayload.category = updates.categoryId;
        if (updates.images !== undefined) corePayload.image_url = updates.images[0] || '';

        const { error: coreErr } = await supabase
          .from('products')
          .update(corePayload)
          .eq('id', id);

        if (coreErr) {
          console.error('Error updating product in Supabase:', coreErr);
          throw coreErr;
        }
      } else {
        console.error('Error updating product in Supabase:', error);
        throw error;
      }
    }

    // Local optimistic update
    setProducts(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item))
    );
    if (selectedProduct?.id === id) {
      setSelectedProduct(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product in Supabase:', error);
      throw error;
    }
    setProducts(prev => prev.filter(item => item.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  const toggleAvailability = async (id: string): Promise<void> => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const newAvail = !target.available;

    setProducts(prev =>
      prev.map(item => (item.id === id ? { ...item, available: newAvail } : item))
    );

    try {
      await supabase.from('products').update({ available: newAvail }).eq('id', id);
    } catch (e) {
      console.warn('Could not toggle availability on Supabase', e);
    }
  };

  const toggleFeatured = async (id: string): Promise<void> => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const newFeatured = !target.featured;

    setProducts(prev =>
      prev.map(item => (item.id === id ? { ...item, featured: newFeatured } : item))
    );

    try {
      await supabase.from('products').update({ featured: newFeatured }).eq('id', id);
    } catch (e) {
      console.warn('Could not toggle featured on Supabase', e);
    }
  };

  const clearDemoProducts = () => {
    setProducts(prev => prev.filter(item => !item.isDemo));
  };

  const restoreDemoProducts = () => {
    setCategories(INITIAL_CATEGORIES);
    fetchProducts();
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    const cartItemId = `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`;
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          quantity,
          selectedColor,
          selectedSize,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Exact WhatsApp link for single product
  const getWhatsAppProductUrl = (product: Product) => {
    const message = `Hola Velvet Bloom 🌸\n\nEstoy interesada/o en este producto:\n\nProducto: ${product.name}\nCódigo: ${product.sku}\nPrecio: $${product.price.toFixed(2)}\n\n¿Podrían darme más información sobre disponibilidad?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  // Exact WhatsApp link for Cart
  const getWhatsAppCartUrl = () => {
    if (cart.length === 0) {
      const emptyMsg = `Hola Velvet Bloom 🌸\n\nQuisiera información sobre el catálogo y disponibilidad de productos.`;
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(emptyMsg)}`;
    }

    const itemsText = cart
      .map(item => {
        const variantInfo = [item.selectedColor, item.selectedSize].filter(Boolean).join(' / ');
        const variantSuffix = variantInfo ? ` (${variantInfo})` : '';
        return `• ${item.product.name}${variantSuffix} — cantidad ${item.quantity}`;
      })
      .join('\n');

    const message = `Hola Velvet Bloom 🌸\n\nQuiero realizar el siguiente pedido:\n\n${itemsText}\n\nTotal: $${cartTotal.toFixed(2)}\n\nQuedo atenta/o para confirmar disponibilidad y entrega.`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const openWhatsAppUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        categories,
        cart,
        isCartOpen,
        setIsCartOpen,
        activeView,
        setActiveView,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        isLoadingProducts,
        supabaseError,
        isTableMissing,
        refreshProducts: fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleAvailability,
        toggleFeatured,
        clearDemoProducts,
        restoreDemoProducts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        getWhatsAppProductUrl,
        getWhatsAppCartUrl,
        openWhatsAppUrl,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
