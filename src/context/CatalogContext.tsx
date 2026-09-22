import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, ViewMode } from '../types/index.ts';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/initialData.ts';

const STORAGE_KEYS = {
  PRODUCTS: 'velvet_bloom_products_v1',
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
  
  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleAvailability: (id: string) => void;
  toggleFeatured: (id: string) => void;
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

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or fallback to INITIAL_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Load categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load categories from localStorage', e);
    }
    return INITIAL_CATEGORIES;
  });

  // Load cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    return [];
  });

  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Persist categories
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Handle URL hash changes for deep linking (e.g. #catalogo, #admin, #inicio)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#admin')) {
        setActiveView('admin');
      } else if (hash.startsWith('#catalogo')) {
        setActiveView('catalog');
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const cat = params.get('categoria');
        if (cat) setSelectedCategorySlug(cat);
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

  // Product CRUD
  const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = `prod-custom-${Date.now()}`;
    const newProduct: Product = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      isDemo: false,
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const now = new Date().toISOString();
    setProducts(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates, updatedAt: now } : item))
    );
    if (selectedProduct?.id === id) {
      setSelectedProduct(prev => (prev ? { ...prev, ...updates, updatedAt: now } : null));
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(item => item.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  const toggleAvailability = (id: string) => {
    setProducts(prev =>
      prev.map(item => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const toggleFeatured = (id: string) => {
    setProducts(prev =>
      prev.map(item => (item.id === id ? { ...item, featured: !item.featured } : item))
    );
  };

  const clearDemoProducts = () => {
    setProducts(prev => prev.filter(item => !item.isDemo));
  };

  const restoreDemoProducts = () => {
    setProducts(INITIAL_PRODUCTS);
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
