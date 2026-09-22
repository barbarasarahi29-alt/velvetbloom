export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  categoryId: string;
  images: string[];
  colors: string[];
  sizes: string[];
  features: string[];
  available: boolean;
  featured: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  token: string;
}

export type ViewMode = 'home' | 'catalog' | 'admin';
