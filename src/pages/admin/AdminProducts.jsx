import { useState, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, GripVertical, X, Search, Image as ImageIcon, 
  UploadCloud, Sparkles, Gift
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProductStore } from '../../store/useProductStore';

const BADGE_THEMES = {
  gold: { label: 'Gold Sunrise', bg: 'from-amber-500 to-orange-500', text: 'text-slate-950' },
  flame: { label: 'Flame Crimson', bg: 'from-rose-600 to-red-600', text: 'text-white' },
  cyan: { label: 'Electric Cyan', bg: 'from-cyan-500 to-blue-600', text: 'text-white' },
  emerald: { label: 'Emerald Deal', bg: 'from-emerald-500 to-teal-600', text: 'text-white' },
  purple: { label: 'Royal Violet', bg: 'from-purple-600 to-indigo-600', text: 'text-white' }
};

// Sortable Table Row Component
function SortableItem({ id, product, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const discountPercent = product.price > product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const theme = BADGE_THEMES[product.offerBadgeColor] || BADGE_THEMES.gold;

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-200 hover:bg-amber-50/30 bg-white text-xs transition-colors">
      <td className="px-3 py-3 whitespace-nowrap w-10">
        <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-slate-700 p-1">
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=100&q=80'}
            alt=""
            className="w-11 h-11 object-contain rounded-lg bg-gray-50 p-1 border border-gray-200 flex-shrink-0"
          />
          <div className="max-w-xs sm:max-w-sm">
            <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
              <span>{product.name}</span>
              {product.hasOffer && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-gradient-to-r ${theme.bg} ${theme.text} shadow-2xs flex-shrink-0`}>
                  🏷️ {product.offerBadgeText || 'OFFER'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
              <span>SKU: <strong className="text-slate-700">{product.sku || 'N/A'}</strong></span>
              {discountPercent > 0 && (
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="font-bold text-slate-800 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
          {product.brand}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-600">
        {product.category}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="font-black text-slate-900">
          ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
        </div>
        {product.price > product.salePrice && (
          <div className="text-[10px] text-gray-400 line-through">
            MRP: ₹{product.price.toLocaleString('en-IN')}
          </div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
          (product.stock || 0) > 5
            ? 'bg-emerald-100 text-emerald-800'
            : (product.stock || 0) > 0
            ? 'bg-amber-100 text-amber-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {(product.stock || 0) > 0 ? `${product.stock} in stock` : 'Out of Stock'}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right font-medium">
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors font-bold text-[10px]"
            title="Edit Product"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors font-bold text-[10px]"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminProducts() {
  const { 
    products, categories, brands, addProduct, updateProduct, deleteProduct, 
    reorderProducts, addCategory, addBrand, isSupabaseConfigured 
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Dynamic Custom Category & Brand creation state
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Drag & Drop File Zone state
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: 'Apple',
    category: 'Smartphones',
    price: 49999,
    salePrice: 44999,
    stock: 15,
    description: '',
    images: [],
    features: ['1-Year Official Brand Warranty', 'Free Doorstep Delivery in Prayagraj'],
    specifications: [
      { key: 'Display', value: '6.7 inch OLED 120Hz' },
      { key: 'Processor', value: 'Flagship Octa-Core Processor' },
      { key: 'Battery', value: '5000 mAh Fast Charging' },
      { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
    ],
    isFlashSale: false,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    // Offer & Promotion fields
    hasOffer: false,
    offerTitle: '',
    offerDiscountPercent: 0,
    offerBadgeText: 'SPECIAL OFFER',
    offerBadgeColor: 'gold',
    offerValidUntil: '',
    offerFreebie: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);
      reorderProducts(arrayMove(products, oldIndex, newIndex));
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setIsCustomCategory(false);
    setIsCustomBrand(false);
    setFormData({
      name: '',
      sku: 'AD-' + Math.floor(1000 + Math.random() * 9000),
      brand: brands[0]?.name || 'Apple',
      category: categories[0]?.name || 'Smartphones',
      price: 49999,
      salePrice: 44999,
      stock: 15,
      description: '',
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        '100% Genuine Brand Product',
        '1-Year Official Manufacturer Warranty',
        'Free Express Delivery Across Prayagraj'
      ],
      specifications: [
        { key: 'Display', value: '6.7 inch FHD+ AMOLED 120Hz' },
        { key: 'Storage & RAM', value: '8GB RAM + 128GB Storage' },
        { key: 'Battery', value: '5000 mAh with Fast Charge' },
        { key: 'Warranty', value: '1 Year Official Warranty' }
      ],
      isFlashSale: false,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      hasOffer: false,
      offerTitle: '',
      offerDiscountPercent: 0,
      offerBadgeText: 'SPECIAL OFFER',
      offerBadgeColor: 'gold',
      offerValidUntil: '',
      offerFreebie: ''
    });
    setUrlInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    const specsArray = p.specifications
      ? Object.entries(p.specifications).map(([key, value]) => ({ key, value }))
      : [
          { key: 'Display', value: 'High Definition Display' },
          { key: 'Warranty', value: '1 Year Brand Warranty' }
        ];

    setFormData({
      name: p.name,
      sku: p.sku || 'AD-' + Math.floor(1000 + Math.random() * 9000),
      brand: p.brand || 'Apple',
      category: p.category || 'Smartphones',
      price: p.price,
      salePrice: p.salePrice || p.price,
      stock: p.stock !== undefined ? p.stock : 10,
      description: p.description || '',
      images: p.images && p.images.length > 0 ? p.images : [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
      ],
      features: p.features && p.features.length > 0 ? p.features : ['1-Year Manufacturer Warranty'],
      specifications: specsArray,
      isFlashSale: !!p.isFlashSale,
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
      isNewArrival: !!p.isNewArrival,
      hasOffer: !!p.hasOffer,
      offerTitle: p.offerTitle || '',
      offerDiscountPercent: p.offerDiscountPercent || 0,
      offerBadgeText: p.offerBadgeText || 'SPECIAL OFFER',
      offerBadgeColor: p.offerBadgeColor || 'gold',
      offerValidUntil: p.offerValidUntil || '',
      offerFreebie: p.offerFreebie || ''
    });
    setUrlInput('');
    setIsModalOpen(true);
  };

  // Drag & Drop File Handlers
  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, e.target.result]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, urlInput.trim()]
      }));
      setUrlInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData((prev) => {
      const selected = prev.images[index];
      const rest = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: [selected, ...rest]
      };
    });
  };

  // Dynamic Bullet Points
  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleUpdateFeature = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[index] = value;
      return { ...prev, features: updated };
    });
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Dynamic Specifications
  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const handleUpdateSpec = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.specifications];
      updated[index][field] = value;
      return { ...prev, specifications: updated };
    });
  };

  const handleRemoveSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // Submit Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Convert specs array to object
    const specObj = {};
    formData.specifications.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specObj[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      brand: formData.brand.trim() || 'Generic',
      category: formData.category.trim() || 'Electronics',
      price: Number(formData.price),
      salePrice: Number(formData.salePrice),
      stock: Number(formData.stock),
      description: formData.description,
      images: formData.images.length > 0 ? formData.images : [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
      ],
      features: formData.features.filter(Boolean),
      specifications: specObj,
      isFlashSale: formData.isFlashSale,
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      isNewArrival: formData.isNewArrival,
      hasOffer: !!formData.hasOffer,
      offerTitle: formData.offerTitle || '',
      offerDiscountPercent: Number(formData.offerDiscountPercent || 0),
      offerBadgeText: formData.offerBadgeText || 'SPECIAL OFFER',
      offerBadgeColor: formData.offerBadgeColor || 'gold',
      offerValidUntil: formData.offerValidUntil || '',
      offerFreebie: formData.offerFreebie || ''
    };

    // Auto-create category in store if not present
    if (payload.category) {
      const catExists = categories.some(
        (c) => c.name.toLowerCase() === payload.category.toLowerCase()
      );
      if (!catExists && addCategory) {
        addCategory({
          name: payload.category,
          slug: payload.category.toLowerCase().replace(/\s+/g, '-'),
          image: payload.images[0]
        });
      }
    }

    // Auto-create brand in store if not present
    if (payload.brand) {
      const brandExists = brands.some(
        (b) => b.name.toLowerCase() === payload.brand.toLowerCase()
      );
      if (!brandExists && addBrand) {
        addBrand({
          name: payload.brand
        });
      }
    }

    if (editingId) {
      updateProduct(editingId, payload);
      setToastMessage(`✓ "${payload.name}" updated successfully in Real-Time!`);
    } else {
      addProduct(payload);
      setToastMessage(`✓ "${payload.name}" added to inventory & published live to Frontend!`);
    }

    setTimeout(() => setToastMessage(''), 5000);
    setIsModalOpen(false);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCategory = filterCategory ? p.category.toLowerCase() === filterCategory.toLowerCase() : true;
    const matchBrand = filterBrand ? p.brand.toLowerCase() === filterBrand.toLowerCase() : true;

    return matchSearch && matchCategory && matchBrand;
  });

  const calculatedDiscount = formData.price > formData.salePrice
    ? Math.round(((formData.price - formData.salePrice) / formData.price) * 100)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="p-1 rounded hover:bg-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              Product Inventory Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Realtime Active
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Add new electronics, manage stock, upload photos via drag & drop, and add custom categories or brands.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, brand, SKU..."
            className="w-full px-3.5 py-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>

          {(searchTerm || filterCategory || filterBrand) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
                setFilterBrand('');
              }}
              className="text-blue-600 hover:underline font-bold px-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 3. Products Table with Dnd Reordering */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left w-10">Sort</th>
                  <th scope="col" className="px-4 py-3 text-left">Product / SKU</th>
                  <th scope="col" className="px-4 py-3 text-left">Brand</th>
                  <th scope="col" className="px-4 py-3 text-left">Category</th>
                  <th scope="col" className="px-4 py-3 text-left">Selling Price</th>
                  <th scope="col" className="px-4 py-3 text-left">Stock</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <SortableContext items={filteredProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  {filteredProducts.map((product) => (
                    <SortableItem
                      key={product.id}
                      id={product.id}
                      product={product}
                      onEdit={openEditModal}
                      onDelete={deleteProduct}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </div>
        </DndContext>
      </div>

      {/* 4. MODAL: ADD / EDIT PRODUCT WITH DRAG & DROP MULTI-IMAGE UPLOAD & ALL OPTIONS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-heading font-black text-slate-900">
                  {editingId ? 'Edit Product Details' : 'Add New Product to Inventory'}
                </h3>
                <p className="text-xs text-gray-500">
                  All fields are updated in real-time across the customer storefront.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
              
              {/* SECTION A: IMAGES (DRAG & DROP + MULTI-IMAGE PREVIEWS) */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    Product Images (Drag & Drop or Upload)
                  </label>
                  <span className="text-[11px] text-gray-500">{formData.images.length} images added</span>
                </div>

                {/* Drag and drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDraggingFile 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-gray-300 hover:border-slate-400 bg-white'
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">
                    Drag & Drop image files here, or <span className="text-blue-600 underline">browse files</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Supports PNG, JPG, WEBP. Instant real-time preview.
                  </p>
                </div>

                {/* Add Image by URL option */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Or paste external image URL (e.g. Unsplash, CDN)..."
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-1.5 bg-slate-900 text-amber-400 font-bold rounded-lg flex-shrink-0"
                  >
                    Add URL
                  </button>
                </div>

                {/* Image Thumbnails Gallery */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative group aspect-square rounded-lg border-2 overflow-hidden bg-white p-1 flex items-center justify-center ${
                          idx === 0 ? 'border-amber-500 shadow-xs' : 'border-gray-200'
                        }`}
                      >
                        <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                        
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-black text-[8px] px-1 rounded uppercase">
                            Cover
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded-full bg-red-600 text-white"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION B: CORE PRODUCT DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Product Title / Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Apple iPhone 16 Pro Max 256GB - Desert Titanium"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-semibold text-slate-900"
                  />
                </div>

                {/* SKU with Auto-Generator */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-700 font-bold">SKU / Model Number *</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sku: 'AD-' + Math.floor(1000 + Math.random() * 9000) })}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                    >
                      Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Brand Selector with Custom Type option */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-700 font-bold">Brand *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomBrand(!isCustomBrand);
                        if (!isCustomBrand) setFormData({ ...formData, brand: '' });
                        else setFormData({ ...formData, brand: brands[0]?.name || 'Apple' });
                      }}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                    >
                      {isCustomBrand ? 'Select Existing Brand' : '+ Type New Brand'}
                    </button>
                  </div>
                  {isCustomBrand ? (
                    <input
                      type="text"
                      required
                      placeholder="Type brand name (e.g. Sony, Marshall, Boat)..."
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg bg-blue-50/40 focus:outline-none focus:border-amber-500 font-bold text-slate-900"
                    />
                  ) : (
                    <select
                      value={formData.brand}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCustomBrand(true);
                          setFormData({ ...formData, brand: '' });
                        } else {
                          setFormData({ ...formData, brand: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 font-semibold"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                      <option value="__NEW__">+ Type New Custom Brand...</option>
                    </select>
                  )}
                </div>

                {/* Category Selector with Custom Type option */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-700 font-bold">Category *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        if (!isCustomCategory) setFormData({ ...formData, category: '' });
                        else setFormData({ ...formData, category: categories[0]?.name || 'Smartphones' });
                      }}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                    >
                      {isCustomCategory ? 'Select Existing Category' : '+ Type New Category'}
                    </button>
                  </div>
                  {isCustomCategory ? (
                    <input
                      type="text"
                      required
                      placeholder="Type category (e.g. Tablets, Gaming, Smart Watch)..."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg bg-blue-50/40 focus:outline-none focus:border-amber-500 font-bold text-slate-900"
                    />
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCustomCategory(true);
                          setFormData({ ...formData, category: '' });
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                      <option value="__NEW__">+ Type New Custom Category...</option>
                    </select>
                  )}
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                {/* MRP Original Price */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Original MRP (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>

                {/* Selling Offer Price */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-700 font-bold">Selling Price (₹) *</label>
                    {calculatedDiscount > 0 && (
                      <span className="text-emerald-700 font-black text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                        {calculatedDiscount}% Discount
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-black text-slate-900"
                  />
                </div>
              </div>

              {/* SECTION C: DESCRIPTION */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">Product Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Official marketing overview and product summary..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              {/* SECTION D: DYNAMIC BULLET POINTS */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-900">Key Highlights / Features</label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Highlight
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                        placeholder="e.g. 6.9-inch Super Retina XDR OLED Display"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION E: DYNAMIC SPECIFICATIONS TABLE BUILDER */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-900">Technical Specifications Table</label>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Spec Row
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.specifications.map((spec, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                        placeholder="Feature Key (e.g. RAM)"
                        className="col-span-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white font-semibold"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. 12GB LPDDR5X)"
                        className="col-span-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-500 justify-self-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: SPECIAL PRODUCT OFFER & HIGHLIGHTED DEAL PROMOTION */}
              <div className={`p-5 rounded-2xl border-2 transition-all space-y-4 shadow-xs ${
                formData.hasOffer 
                  ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border-amber-400/80 ring-2 ring-amber-400/30' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      formData.hasOffer ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-1.5">
                        Special Product Offer & Deal Promotion
                        {formData.hasOffer && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                            Active Highlight
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Highlight this product with glowing badges, promotional ribbons, savings tags & free gift banners.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.hasOffer}
                      onChange={(e) => setFormData({ ...formData, hasOffer: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    <span className="ml-2.5 text-xs font-bold text-slate-800">
                      {formData.hasOffer ? 'Offer Active' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {formData.hasOffer && (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Offer Headline / Title */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">
                          Offer Headline / Deal Title *
                        </label>
                        <input
                          type="text"
                          value={formData.offerTitle}
                          onChange={(e) => setFormData({ ...formData, offerTitle: e.target.value })}
                          placeholder="e.g. Festive Bonanza: Flat ₹5,000 Off + Free Gifts"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 font-bold"
                        />
                      </div>

                      {/* Badge Tag Text */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">
                          Badge Tag Text (Short & Punchy) *
                        </label>
                        <input
                          type="text"
                          value={formData.offerBadgeText}
                          onChange={(e) => setFormData({ ...formData, offerBadgeText: e.target.value })}
                          placeholder="e.g. SPECIAL OFFER, HOT DEAL, SAVE ₹5,000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 font-black uppercase text-slate-900"
                        />
                      </div>

                      {/* Badge Theme Color Selector */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-1.5">
                          Badge Highlight Color Theme
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {Object.entries(BADGE_THEMES).map(([key, t]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setFormData({ ...formData, offerBadgeColor: key })}
                              className={`py-1.5 px-1 rounded-lg text-[10px] font-black uppercase truncate transition-all text-center bg-gradient-to-r ${t.bg} ${t.text} ${
                                formData.offerBadgeColor === key ? 'ring-2 ring-slate-900 scale-105 shadow-xs' : 'opacity-80 hover:opacity-100'
                              }`}
                            >
                              {t.label.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Extra Offer Discount % */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">
                          Additional Promo Discount (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="90"
                          value={formData.offerDiscountPercent}
                          onChange={(e) => setFormData({ ...formData, offerDiscountPercent: Number(e.target.value) })}
                          placeholder="e.g. 15"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 font-bold"
                        />
                      </div>

                      {/* Freebie Gift in Box */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-1 flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5 text-emerald-600" /> Free Gift / Accessory Included
                        </label>
                        <input
                          type="text"
                          value={formData.offerFreebie}
                          onChange={(e) => setFormData({ ...formData, offerFreebie: e.target.value })}
                          placeholder="e.g. Free 25W Fast Charger + Silicone Case in box"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Offer Validity */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">
                          Offer Expiry / Validity Date
                        </label>
                        <input
                          type="text"
                          value={formData.offerValidUntil}
                          onChange={(e) => setFormData({ ...formData, offerValidUntil: e.target.value })}
                          placeholder="e.g. Valid till 30 September 2026"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* LIVE STOREFRONT HIGHLIGHT PREVIEW CARD */}
                    <div className="p-4 rounded-xl bg-white border border-amber-300 shadow-2xs space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                        ✨ Live Highlight Preview (Storefront Product Card & Ribbon):
                      </span>
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${(BADGE_THEMES[formData.offerBadgeColor] || BADGE_THEMES.gold).bg} ${(BADGE_THEMES[formData.offerBadgeColor] || BADGE_THEMES.gold).text} shadow-xs`}>
                          🏷️ {formData.offerBadgeText || 'SPECIAL OFFER'}
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {formData.offerTitle || 'Exclusive Showroom Offer Available'}
                        </div>
                        {formData.offerFreebie && (
                          <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                            <Gift className="w-3 h-3" /> {formData.offerFreebie}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION F: PROMOTIONAL FLAGS / BADGES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFlashSale}
                    onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span className="font-bold text-slate-900">Flash Sale Deal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span className="font-bold text-slate-900">Featured Item</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span className="font-bold text-slate-900">Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span className="font-bold text-slate-900">New Arrival</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black rounded-lg shadow-md transition-colors"
                >
                  {editingId ? 'Save & Update Product' : 'Add to Inventory'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
