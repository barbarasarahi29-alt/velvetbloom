import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { uploadProductImage } from '../../lib/supabase.ts';

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

  // Upload and Submit States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setUploadError(null);
    setSubmitError(null);

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
      setCategoryId(categories[0]?.id || 'cat-dama');
      setPrice('');
      setSku(`VB-${Math.floor(100 + Math.random() * 900)}`);
      setDescription('');
      setImages([]);
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

  // Upload image to Supabase Storage bucket 'product-images'
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const fileList = Array.from(files);
      for (const file of fileList) {
        const publicUrl = await uploadProductImage(file);
        setImages(prev => [...prev, publicUrl]);
      }
    } catch (err: any) {
      console.error('Error al subir imagen a Supabase:', err);
      const msg = err.message || '';
      if (msg.includes('Bucket not found') || msg.includes('NoSuchBucket')) {
        setUploadError(
          'El bucket "product-images" no existe aún en tu proyecto de Supabase. Ejecuta el script SQL en el Editor SQL de Supabase para crearlo.'
        );
      } else {
        setUploadError(`Error al subir imagen: ${msg || 'Verifica la conexión con Supabase'}`);
      }
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === '' || !categoryId) return;

    setIsSubmitting(true);
    setSubmitError(null);

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
      sku: sku || `VB-${Math.floor(100 + Math.random() * 900)}`,
      description,
      images,
      colors,
      sizes,
      features,
      available,
      featured,
    };

    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, productPayload);
      } else {
        await addProduct(productPayload);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving product to Supabase:', err);
      const msg = err.message || '';
      if (msg.includes('Could not find the table') || msg.includes('does not exist')) {
        setSubmitError(
          'La tabla "products" aún no ha sido creada en Supabase. Ejecuta el script SQL en el Editor SQL de tu panel de Supabase.'
        );
      } else {
        setSubmitError(`Error al guardar en Supabase: ${msg || 'Verifica la conexión'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-[#381058]/10 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#381058]/10 shrink-0">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#381058]">
              {productToEdit ? 'Editar Producto en Supabase' : 'Nuevo Producto en Supabase'}
            </h2>
            <p className="text-xs text-[#6B5B7E] mt-0.5">
              Los cambios se guardan y sincronizan en tiempo real con la base de datos de Supabase.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Error Banner */}
        {submitError && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">
              <span className="font-semibold">Error al guardar: </span>
              {submitError}
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-6 pt-4 flex-1">
          {/* Row: Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Collar Choker Perlas 18K"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
                Categoría *
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Price & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
                Precio (USD $) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
                Código / SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="VB-101"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#8668D8]"
              />
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

          {/* Image Management with Supabase Storage */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#381058]/8">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#381058] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#8668D8]" />
                <span>Fotografías del Producto ({images.length})</span>
              </label>
              <span className="text-[11px] text-gray-500">Almacenamiento en Supabase Storage</span>
            </div>

            {/* Upload Error Banner */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 ? (
              <div className="flex flex-wrap gap-3 pb-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[#381058]/15 bg-white shadow-xs"
                  >
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
            ) : (
              <div className="p-3 text-center border border-dashed border-[#8668D8]/20 rounded-xl text-xs text-[#6B5B7E]">
                Sin imágenes todavía. Sube una fotografía o ingresa un enlace para la portada del producto.
              </div>
            )}

            {/* Upload or Add by URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#381058]/8">
              {/* Supabase Storage Device File Upload */}
              <div>
                <label
                  className={`flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border-2 border-dashed ${
                    isUploadingImage
                      ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-[#C3A6FF] hover:border-[#8668D8] text-[#381058] cursor-pointer bg-white'
                  } text-xs font-medium transition-colors`}
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#8668D8] animate-spin" />
                      <span>Subiendo a Supabase Storage...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-[#8668D8]" />
                      <span>Subir foto a Supabase</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isUploadingImage}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </>
                  )}
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
          </div>

          {/* Color Variations */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
              Variaciones de Color
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={colorInput}
                onChange={e => setColorInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
                placeholder="Ej. Lavanda Imperial, Dorado, Plata..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#8668D8]"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#381058] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {colors.map(col => (
                <span
                  key={col}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#381058]/5 text-xs text-[#381058] font-medium"
                >
                  {col}
                  <button
                    type="button"
                    onClick={() => setColors(colors.filter(c => c !== col))}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Size Variations */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
              Tallas o Medidas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={sizeInput}
                onChange={e => setSizeInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
                placeholder="Ej. Única, S, M, L, 45cm..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#8668D8]"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#381058] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map(sz => (
                <span
                  key={sz}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#381058]/5 text-xs text-[#381058] font-medium"
                >
                  {sz}
                  <button
                    type="button"
                    onClick={() => setSizes(sizes.filter(s => s !== sz))}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Key Features Bullet Points */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#381058] mb-1">
              Características Clave (Bullet points)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={e => setFeatureInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Ej. Acero inoxidable grado quirúrgico 316L..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#8668D8]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#381058] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
            <ul className="space-y-1 text-xs text-gray-700">
              {features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <span className="flex-1 pr-2">• {feat}</span>
                  <button
                    type="button"
                    onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
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
              disabled={isSubmitting}
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="px-7 py-2.5 rounded-xl bg-[#381058] hover:bg-[#4d1877] text-white text-xs font-semibold transition-all shadow-md active:scale-98 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {isSubmitting
                  ? 'Guardando en Supabase...'
                  : productToEdit
                  ? 'Guardar Cambios'
                  : 'Crear Producto'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
