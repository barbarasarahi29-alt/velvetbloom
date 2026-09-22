import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { ASSETS } from '../../data/initialData.ts';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { categories, addProduct, updateProduct } = useCatalog();

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Tag / List attributes
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState('');
  
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState('');
  
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Initialize or reset form
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategoryId(productToEdit.categoryId);
      setPrice(productToEdit.price);
      setSku(productToEdit.sku);
      setDescription(productToEdit.description);
      setImages(productToEdit.images || []);
      setColors(productToEdit.colors || []);
      setSizes(productToEdit.sizes || []);
      setFeatures(productToEdit.features || []);
      setAvailable(productToEdit.available);
      setFeatured(productToEdit.featured);
    } else {
      setName('');
      setCategoryId(categories[0]?.id || 'cat-1');
      setPrice('');
      setSku(`VB-${Math.floor(100 + Math.random() * 900)}`);
      setDescription('');
      setImages([ASSETS.catDetalles]);
      setColors(['Lavanda', 'Blanco Cálido']);
      setSizes(['Estándar']);
      setFeatures(['Acabado premium de alta durabilidad', 'Empaque de regalo exclusivo']);
      setAvailable(true);
      setFeatured(false);
    }
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  // Add Image via URL
  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  // Upload image from user device (Base64 DataURL for offline/local storage compatibility)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset file input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Color add & remove
  const handleAddColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors(prev => [...prev, colorInput.trim()]);
      setColorInput('');
    }
  };

  // Size add & remove
  const handleAddSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes(prev => [...prev, sizeInput.trim()]);
      setSizeInput('');
    }
  };

  // Feature add & remove
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === '' || !categoryId) return;

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const productPayload = {
      name,
      slug: slug || `producto-${Date.now()}`,
      categoryId,
      price: Number(price),
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      description,
      images: images.length > 0 ? images : [ASSETS.catAccesorios],
      colors,
      sizes,
      features,
      available,
      featured,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-[#381058]/10 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#381058]/10 shrink-0">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#381058]">
              {productToEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h2>
            <p className="text-xs text-[#6B5B7E]">
              Completa los detalles para actualizar el catálogo de Velvet Bloom en tiempo real.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#381058] rounded-full hover:bg-[#FAF8F5]"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {/* Basic Info: Name, Category, Price, SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Caja Deluxe Rosas Eternas con Collar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
                Categoría *
              </label>
              <select
                required
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8668D8] bg-white cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
                  Precio (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="45.00"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
                  Código SKU
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  placeholder="DET-001"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
              Descripción Completa
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe los materiales, sensaciones, empaque y detalles del producto..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
            />
          </div>

          {/* Image Management with Instant Previews */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#381058]/8">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#381058] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#8668D8]" />
                <span>Fotografías del Producto ({images.length})</span>
              </label>
              <span className="text-[11px] text-gray-500">Múltiples fotos permitidas</span>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 pb-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[#381058]/15 bg-white shadow-xs">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#381058]/80 text-white text-[9px] text-center font-medium py-0.5">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload or Add by URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#381058]/8">
              {/* Device file upload */}
              <div>
                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-[#C3A6FF] hover:border-[#8668D8] text-xs font-medium text-[#381058] cursor-pointer bg-white transition-colors">
                  <Upload className="w-4 h-4 text-[#8668D8]" />
                  <span>Subir foto desde dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL Input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="https://... URL de imagen"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#8668D8]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-2 rounded-xl bg-[#381058] text-white text-xs font-semibold hover:bg-[#4d1877]"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Preset shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#6B5B7E]">
              <span>Presets de marca:</span>
              <button
                type="button"
                onClick={() => setImages(prev => [...prev, ASSETS.catDetalles])}
                className="text-[#8668D8] hover:underline"
              >
                + Detalles
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setImages(prev => [...prev, ASSETS.catAccesorios])}
                className="text-[#8668D8] hover:underline"
              >
                + Joyería
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setImages(prev => [...prev, ASSETS.catBolsos])}
                className="text-[#8668D8] hover:underline"
              >
                + Bolso
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setImages(prev => [...prev, ASSETS.catRelojes])}
                className="text-[#8668D8] hover:underline"
              >
                + Reloj
              </button>
            </div>
          </div>

          {/* Variants: Colors, Sizes, Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Colors */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058]">
                Colores Disponibles
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={e => setColorInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                  placeholder="Ej. Oro Rosa, Lavanda"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#8668D8]"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="p-2 rounded-xl bg-[#FAF8F5] border border-[#381058]/15 hover:bg-[#C3A6FF]/20 text-[#381058]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {colors.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#C3A6FF]/50 text-xs text-[#381058]"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => setColors(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058]">
                Tamaños o Medidas
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={e => setSizeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                  placeholder="Ej. 18cm, Mediana, Única"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#8668D8]"
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="p-2 rounded-xl bg-[#FAF8F5] border border-[#381058]/15 hover:bg-[#C3A6FF]/20 text-[#381058]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sizes.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#C3A6FF]/50 text-xs text-[#381058]"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => setSizes(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Features bullet list */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058]">
              Características y Beneficios (Viñetas)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={e => setFeatureInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="Ej. Rosas naturales tratadas que no requieren riego"
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#8668D8]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#381058]/15 hover:bg-[#C3A6FF]/20 text-[#381058] text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
            <ul className="space-y-1.5 pt-1">
              {features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] text-xs text-[#381058]"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#8668D8]">🌸</span>
                    <span>{feat}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFeatures(prev => prev.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-red-500 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Toggles: Availability & Featured */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#381058]/10">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={e => setAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-[#381058] focus:ring-[#8668D8]"
              />
              <span className="text-xs font-semibold text-[#381058]">
                Producto Disponible en Inventario
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#381058] focus:ring-[#8668D8]"
              />
              <span className="text-xs font-semibold text-[#381058] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8668D8]" />
                <span>Mostrar como Producto Destacado en Inicio</span>
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#381058]/10 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#381058] hover:bg-[#4d1877] text-white text-xs font-semibold transition-all shadow-md active:scale-98"
            >
              {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
