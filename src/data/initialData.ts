import { Category, Product } from '../types/index.ts';

// Generated brand assets
export const ASSETS = {
  hero: '/images/vb_hero_lifestyle_1790107630695.jpg',
  catDetalles: '/images/vb_cat_detalles_1790107641321.jpg',
  catAccesorios: '/images/vb_cat_accesorios_1790107653497.jpg',
  catCaballero: '/images/cat_accesorios_caballero_1790186191750.jpg',
  catBolsos: '/images/vb_cat_bolsos_1790107663208.jpg',
  catRelojes: '/images/vb_cat_relojes_1790107673114.jpg',
  catCarteras: '/images/vb_cat_carteras_1790107682929.jpg',
  catGorras: '/images/vb_cat_gorras_1790107690742.jpg',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-dama',
    name: 'Accesorios de Dama',
    slug: 'accesorios-dama',
    description: 'Brillo y tendencia para tu día a día. Diseños en acero inoxidable, rodio y oro chino pensados para durar y hacerte destacar.',
    image: ASSETS.catAccesorios,
  },
  {
    id: 'cat-caballero',
    name: 'Accesorios de Caballero',
    slug: 'accesorios-caballero',
    description: 'Estilo y resistencia. Piezas masculinas en acero inoxidable, rodio y oro chino que aportan el toque perfecto a tu look.',
    image: ASSETS.catCaballero,
  },
  {
    id: 'cat-detalles',
    name: 'Obsequios y Detalles',
    slug: 'obsequios-detalles',
    description: 'Gestos especiales que dejan huella. La selección perfecta para regalar a esa persona favorita o consentirte a ti misma.',
    image: ASSETS.catDetalles,
  },
  {
    id: 'cat-bolsos',
    name: 'Bolsos y Carteras',
    slug: 'bolsos-carteras',
    description: 'Versatilidad para cada ocasión. Encuentra desde modelos elegantes hasta opciones sportswear para llevar tus esenciales siempre contigo.',
    image: ASSETS.catBolsos,
  },
  {
    id: 'cat-gorras',
    name: 'Gorras',
    slug: 'gorras',
    description: 'Actitud y estilo urbano. Diseños cómodos y en tendencia para darle un giro único a tu outfit diario.',
    image: ASSETS.catGorras,
  },
  {
    id: 'cat-relojes',
    name: 'Relojes',
    slug: 'relojes',
    description: 'Diseños modernos y funcionales para dama y caballero. El complemento ideal para marcar el tiempo con actitud y estilo.',
    image: ASSETS.catRelojes,
  },
  {
    id: 'cat-moda',
    name: 'Moda Velvet',
    slug: 'moda-velvet',
    description: 'Estilo urbano, fresco y auténtico. Prendas de vestir cómodas e importadas para armar outfits del día a día sin complicaciones.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-pijamas',
    name: 'Pijamas y Lencería',
    slug: 'pijamas-lenceria',
    description: 'Suavidad, comodidad y delicadeza. Piezas femeninas pensadas para consentirte y hacerte sentir cómoda en tu espacio.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  },
];

export const INITIAL_PRODUCTS: Product[] = [];

