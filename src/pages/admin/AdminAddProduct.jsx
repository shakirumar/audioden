import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Sparkles, UploadCloud, Image as ImageIcon, 
  Trash2, Plus, CheckCircle2, AlertCircle, X, ShieldCheck, 
  Tag, Percent, Gift, Zap, Layers, RefreshCw, Eye
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { uploadToCloudinary, isCloudinaryConfigured } from '../../services/cloudinary';
import VariantPriceManager from '../../components/VariantPriceManager';

const BADGE_THEMES = [
  { id: 'gold', label: 'Gold Sunrise', bg: 'from-amber-500 to-orange-500', text: 'text-slate-950' },
  { id: 'flame', label: 'Flame Crimson', bg: 'from-rose-600 to-red-600', text: 'text-white' },
  { id: 'cyan', label: 'Electric Cyan', bg: 'from-cyan-500 to-blue-600', text: 'text-white' },
  { id: 'emerald', label: 'Emerald Deal', bg: 'from-emerald-500 to-teal-600', text: 'text-white' },
  { id: 'purple', label: 'Royal Violet', bg: 'from-purple-600 to-indigo-600', text: 'text-white' }
];

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = paramId || searchParams.get('edit');

  const { 
    products, categories, brands, addProduct, updateProduct, deleteProduct,
    addCategory, addBrand 
  } = useProductStore();

  const isEditing = Boolean(editId);
  const existingProduct = isEditing ? products.find((p) => p.id === editId) : null;

  // Cloudinary Upload State
  const [isUploadingCloudinary, setIsUploadingCloudinary] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef(null);

  // Dynamic Custom Category & Brand creation state
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [customBrandInput, setCustomBrandInput] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    modelGroup: '',
    sku: '',
    brand: 'Apple',
    category: 'Smartphones',
    price: 69999,
    salePrice: 64999,
    stock: 15,
    description: '',
    images: [],
    variants: [],
    features: [
      '100% Genuine Brand Product with Official Serial Number',
      '1-Year Official Manufacturer Warranty Across India',
      'Free Express Same-Day Doorstep Delivery in Prayagraj'
    ],
    specifications: [
      { key: 'Display', value: '6.7 inch OLED 120Hz ProMotion' },
      { key: 'Processor', value: 'Next-Gen Flagship Processor' },
      { key: 'RAM & Storage', value: '8GB RAM + 128GB Internal' },
      { key: 'Camera', value: '50MP Ultra-Clear Main Sensor' },
      { key: 'Battery', value: '5000 mAh All-Day Battery' },
      { key: 'Warranty', value: '1 Year Brand India Warranty' }
    ],
    isFlashSale: false,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    // Offer fields
    hasOffer: false,
    offerTitle: '',
    offerDiscountPercent: 0,
    offerBadgeText: 'SPECIAL OFFER',
    offerBadgeColor: 'gold',
    offerValidUntil: '',
    offerFreebie: ''
  });

  // Populate if editing
  useEffect(() => {
    if (existingProduct) {
      const specsArray = existingProduct.specifications
        ? Object.entries(existingProduct.specifications).map(([key, value]) => ({ key, value }))
        : [
            { key: 'Display', value: 'High Definition Display' },
            { key: 'Warranty', value: '1 Year Brand Warranty' }
          ];

      setFormData({
        name: existingProduct.name || '',
        modelGroup: existingProduct.modelGroup || existingProduct.name || '',
        sku: existingProduct.sku || 'AD-' + Math.floor(1000 + Math.random() * 9000),
        brand: existingProduct.brand || 'Apple',
        category: existingProduct.category || 'Smartphones',
        price: existingProduct.price || 49999,
        salePrice: existingProduct.salePrice || existingProduct.price || 44999,
        stock: existingProduct.stock !== undefined ? existingProduct.stock : 10,
        description: existingProduct.description || '',
        images: existingProduct.images && existingProduct.images.length > 0 ? existingProduct.images : [],
        variants: existingProduct.variants || [],
        features: existingProduct.features && existingProduct.features.length > 0
          ? existingProduct.features
          : ['1-Year Manufacturer Warranty'],
        specifications: specsArray,
        isFlashSale: !!existingProduct.isFlashSale,
        isFeatured: !!existingProduct.isFeatured,
        isBestSeller: !!existingProduct.isBestSeller,
        isNewArrival: !!existingProduct.isNewArrival,
        hasOffer: !!existingProduct.hasOffer,
        offerTitle: existingProduct.offerTitle || '',
        offerDiscountPercent: existingProduct.offerDiscountPercent || 0,
        offerBadgeText: existingProduct.offerBadgeText || 'SPECIAL OFFER',
        offerBadgeColor: existingProduct.offerBadgeColor || 'gold',
        offerValidUntil: existingProduct.offerValidUntil || '',
        offerFreebie: existingProduct.offerFreebie || ''
      });
    } else {
      // Default SKU for new product
      setFormData((prev) => ({
        ...prev,
        sku: 'AD-' + Math.floor(1000 + Math.random() * 9000),
        brand: brands[0]?.name || 'Apple',
        category: categories[0]?.name || 'Smartphones'
      }));
    }
  }, [existingProduct, brands, categories]);

  // Sync modelGroup when product name changes if not explicitly modified
  const handleNameChange = (val) => {
    setFormData((prev) => {
      const cleanGroup = val
        .replace(/\([^)]*\)/g, '')
        .replace(/\b(128GB|256GB|512GB|1TB|2TB|64GB)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      return {
        ...prev,
        name: val,
        modelGroup: prev.modelGroup === prev.name || !prev.modelGroup ? cleanGroup : prev.modelGroup
      };
    });
  };

  // Image Upload Handlers
  const handleFiles = async (files) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setIsUploadingCloudinary(true);
    setUploadError('');
    setUploadProgressText(`Uploading ${imageFiles.length} photo(s)...`);

    const uploadedUrls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadProgressText(`Uploading (${i + 1}/${imageFiles.length}) ${file.name}...`);
      try {
        const res = await uploadToCloudinary(file, 'audioden');
        if (res?.secure_url) {
          uploadedUrls.push(res.secure_url);
        }
      } catch (err) {
        console.error('Cloudinary upload warning:', err);
        setUploadError(`Upload warning: ${err.message}. Using preview fallback.`);
        await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            uploadedUrls.push(e.target.result);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }));
    setIsUploadingCloudinary(false);
    setUploadProgressText('');
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
      return { ...prev, images: [selected, ...rest] };
    });
  };

  // Features Bullet Points
  const handleAddFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ''] }));
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

  // Specifications
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

  // Variants Update Handler
  const handleVariantsChange = (newVariants) => {
    setFormData((prev) => {
      const defaultVar = newVariants.find((v) => v.isDefault) || newVariants[0];
      return {
        ...prev,
        variants: newVariants,
        // Auto-sync base price with default variant price
        ...(defaultVar ? {
          price: defaultVar.price,
          salePrice: defaultVar.salePrice,
          storage: defaultVar.storage,
          ram: defaultVar.ram,
          variantLabel: defaultVar.variantLabel
        } : {})
      };
    });
  };

  // Form Submit
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    setIsSaving(true);

    // Convert specs array to object
    const specObj = {};
    formData.specifications.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specObj[s.key.trim()] = s.value.trim();
      }
    });

    const defaultVariant = formData.variants.find((v) => v.isDefault) || formData.variants[0];

    const payload = {
      name: formData.name.trim(),
      modelGroup: formData.modelGroup.trim() || formData.name.replace(/\([^)]*\)/g, '').trim(),
      sku: formData.sku.trim(),
      brand: isCustomBrand && customBrandInput.trim() ? customBrandInput.trim() : formData.brand.trim() || 'Generic',
      category: isCustomCategory && customCategoryInput.trim() ? customCategoryInput.trim() : formData.category.trim() || 'Smartphones',
      price: defaultVariant ? Number(defaultVariant.price) : Number(formData.price),
      salePrice: defaultVariant ? Number(defaultVariant.salePrice) : Number(formData.salePrice),
      stock: Number(formData.stock),
      description: formData.description,
      images: formData.images.length > 0 ? formData.images : [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
      ],
      variants: formData.variants || [],
      storage: defaultVariant?.storage || formData.storage || '128GB',
      ram: defaultVariant?.ram || formData.ram || '8GB',
      variantLabel: defaultVariant?.variantLabel || '128GB',
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

    // Auto-create category in store if custom
    if (isCustomCategory && customCategoryInput.trim() && addCategory) {
      addCategory({
        name: customCategoryInput.trim(),
        slug: customCategoryInput.trim().toLowerCase().replace(/\s+/g, '-'),
        image: payload.images[0]
      });
    }

    // Auto-create brand in store if custom
    if (isCustomBrand && customBrandInput.trim() && addBrand) {
      addBrand({
        name: customBrandInput.trim()
      });
    }

    if (isEditing && editId) {
      await updateProduct(editId, payload);
      setToastMessage(`✓ "${payload.name}" updated successfully with ${payload.variants.length} variants!`);
    } else {
      await addProduct(payload);
      setToastMessage(`✓ "${payload.name}" added to inventory & published live to Frontend!`);
    }

    setIsSaving(false);
    setTimeout(() => {
      navigate('/admin/products');
    }, 1200);
  };

  const discountPercent = formData.price > formData.salePrice
    ? Math.round(((formData.price - formData.salePrice) / formData.price) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link to="/admin" className="hover:text-blue-600">Admin</Link>
            <span>/</span>
            <Link to="/admin/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{isEditing ? 'Edit Product & Variants' : 'Add New Product'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/products"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 transition-colors"
              title="Back to Products"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              {isEditing ? `Edit: ${formData.name || 'Product'}` : 'Add New Product & Variant Pricing'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to permanently delete "${formData.name || 'this product'}"?`)) {
                  deleteProduct(editId);
                  navigate('/admin/products');
                }
              }}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-red-200"
              title="Delete Product"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSaveProduct}
            disabled={isSaving}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes & Sync' : 'Publish Product Live'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveProduct} className="space-y-6">
        
        {/* 2. Basic Information Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b pb-3">
            <Tag className="w-4 h-4 text-amber-600" /> 1. Product Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title / Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Apple iPhone 18 Pro (Cosmic Titanium)"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold text-slate-900 text-sm"
              />
            </div>

            {/* Model Group (for linking storage siblings) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Model Series / Group <span className="text-gray-400 font-normal">(Links 128GB, 256GB, 512GB siblings)</span>
              </label>
              <input
                type="text"
                value={formData.modelGroup}
                onChange={(e) => setFormData({ ...formData, modelGroup: e.target.value })}
                placeholder="e.g. Apple iPhone 18 Pro"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                SKU / Model Number
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. APL-IP18P-256"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs font-mono"
              />
            </div>

            {/* Brand */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Brand</label>
                <button
                  type="button"
                  onClick={() => setIsCustomBrand(!isCustomBrand)}
                  className="text-[11px] font-bold text-amber-700 hover:underline"
                >
                  {isCustomBrand ? 'Select Existing Brand' : '+ Custom Brand'}
                </button>
              </div>
              {isCustomBrand ? (
                <input
                  type="text"
                  value={customBrandInput}
                  onChange={(e) => setCustomBrandInput(e.target.value)}
                  placeholder="Enter new brand name..."
                  className="w-full px-3.5 py-2 border border-amber-300 bg-amber-50/40 rounded-xl text-xs font-bold"
                />
              ) : (
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold bg-white"
                >
                  {brands.map((b) => (
                    <option key={b.id || b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Category */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Category</label>
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                  className="text-[11px] font-bold text-amber-700 hover:underline"
                >
                  {isCustomCategory ? 'Select Existing Category' : '+ Custom Category'}
                </button>
              </div>
              {isCustomCategory ? (
                <input
                  type="text"
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  placeholder="Enter new category name..."
                  className="w-full px-3.5 py-2 border border-amber-300 bg-amber-50/40 rounded-xl text-xs font-bold"
                />
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Description & Showroom Pitch
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe key highlights, processor, camera capabilities, and why customers should buy it from Audio Den Prayagraj..."
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. VARIANT-WISE PRICING ENTRY CARD (USER'S STAR REQUEST) */}
        <VariantPriceManager
          variants={formData.variants}
          onChange={handleVariantsChange}
          basePrice={formData.price}
          baseSalePrice={formData.salePrice}
          productName={formData.name || 'Mobile Phone'}
        />

        {/* 4. Base Showroom Pricing & Stock (If not using variants, or fallback) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b pb-3">
            <Percent className="w-4 h-4 text-emerald-600" /> 2. Standard Showroom Pricing & Stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                MRP / Regular Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold text-sm text-gray-700"
              />
              <span className="text-[10px] text-gray-400">Printed box MRP</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Showroom Offer Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border border-emerald-400 bg-emerald-50/40 rounded-xl focus:ring-2 focus:ring-emerald-500 font-black text-sm text-emerald-950"
              />
              <span className="text-[10px] text-emerald-700 font-bold">
                {discountPercent > 0 ? `Customer Saves ${discountPercent}% OFF!` : 'Selling price'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stock Quantity (Units)
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold text-sm"
              />
              <span className="text-[10px] text-gray-400">Available in Prayagraj showroom</span>
            </div>
          </div>
        </div>

        {/* 5. Product Images & Gallery (Cloudinary CDN + Drag & Drop) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" /> 3. Product Images ({formData.images.length} Added)
            </h2>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Cloudinary CDN Upload Ready
            </span>
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => { e.preventDefault(); setIsDraggingFile(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
              isDraggingFile
                ? 'border-amber-500 bg-amber-50/80 scale-[1.01]'
                : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Drag & drop product images here, or <span className="text-amber-600 underline">browse files</span>
              </p>
              <p className="text-[11px] text-gray-400">
                Supports JPG, PNG, WEBP. High-resolution square 1:1 ratio recommended.
              </p>
            </div>
          </div>

          {uploadProgressText && (
            <div className="p-3 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl animate-pulse flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> {uploadProgressText}
            </div>
          )}

          {uploadError && (
            <div className="p-3 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl">
              {uploadError}
            </div>
          )}

          {/* Image URL Manual Input */}
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Or paste direct image URL (e.g. /products/apple-iphone18-pro.jpg)..."
              className="flex-grow px-3.5 py-2 border border-gray-300 rounded-xl text-xs"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex-shrink-0"
            >
              Add URL
            </button>
          </div>

          {/* Image Thumbnails Strip */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    className="w-full aspect-square object-contain rounded-lg bg-gray-50"
                  />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-slate-900 text-amber-400 font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow-xs">
                      Main / Primary
                    </span>
                  )}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1.5 p-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="px-2 py-1 bg-amber-400 text-slate-950 font-black text-[10px] rounded hover:bg-amber-500"
                        title="Set as Main Storefront Image"
                      >
                        Set Main
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Remove Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Special Showroom Offer & Promotion Deal Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                4. Special Showroom Offer & Deals Card
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
              <input
                type="checkbox"
                checked={formData.hasOffer}
                onChange={(e) => setFormData({ ...formData, hasOffer: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
              <span className="text-xs font-bold text-slate-900">Enable Special Offer</span>
            </label>
          </div>

          {formData.hasOffer && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Offer Headline / Deal Title
                  </label>
                  <input
                    type="text"
                    value={formData.offerTitle}
                    onChange={(e) => setFormData({ ...formData, offerTitle: e.target.value })}
                    placeholder="e.g. VIP Launch: Flat ₹10,000 Off + Free MagSafe Charger"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Freebie / Bonus In-Box Gift
                  </label>
                  <input
                    type="text"
                    value={formData.offerFreebie}
                    onChange={(e) => setFormData({ ...formData, offerFreebie: e.target.value })}
                    placeholder="e.g. Free 35W Dual USB-C Adapter + Premium Leather Case"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge Tag Text
                  </label>
                  <input
                    type="text"
                    value={formData.offerBadgeText}
                    onChange={(e) => setFormData({ ...formData, offerBadgeText: e.target.value })}
                    placeholder="e.g. VIP LAUNCH, PRO DEAL, SPECIAL OFFER"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Offer Validity Date
                  </label>
                  <input
                    type="text"
                    value={formData.offerValidUntil}
                    onChange={(e) => setFormData({ ...formData, offerValidUntil: e.target.value })}
                    placeholder="e.g. Valid till 30 Sep 2026"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Badge Color Theme
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {BADGE_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, offerBadgeColor: theme.id })}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                        formData.offerBadgeColor === theme.id
                          ? 'ring-2 ring-slate-900 border-transparent shadow-sm scale-105'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      } bg-gradient-to-r ${theme.bg} ${theme.text}`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7. Key Features & Bullet Points */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 5. Key Highlights & Features
            </h2>
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Bullet Point
            </button>
          </div>

          <div className="space-y-2">
            {formData.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-gray-400">{idx + 1}.</span>
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                  placeholder="e.g. 6.3 inch Super Retina XDR OLED 120Hz display"
                  className="flex-grow px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                  title="Remove Feature"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Technical Specifications */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" /> 6. Technical Specifications
            </h2>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Specification Row
            </button>
          </div>

          <div className="space-y-2">
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                  placeholder="Feature (e.g. Processor)"
                  className="col-span-4 px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold text-slate-800"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                  placeholder="Specification details..."
                  className="col-span-7 px-3.5 py-2 border border-gray-300 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="col-span-1 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 flex items-center justify-center"
                  title="Remove Spec"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Visibility Flags */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b pb-3">
            7. Storefront Visibility & Badges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <span className="text-xs font-bold text-slate-800">Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <span className="text-xs font-bold text-slate-800">New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <span className="text-xs font-bold text-slate-800">Best Seller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.isFlashSale}
                onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <span className="text-xs font-bold text-slate-800">⚡ Flash Deal</span>
            </label>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="sticky bottom-6 z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-slate-700">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-amber-400 font-black">Audio Den Catalog:</span>
            <span>{formData.name || 'New Product'}</span>
            {formData.variants.length > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                {formData.variants.length} Variants Ready
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Product Live'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
