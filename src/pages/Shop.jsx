import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw, X, Check, Star } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/ProductCard';
import { getModelWiseProducts } from '../utils/productUtils';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, brands } = useProductStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Dynamic combined categories from store + all products
  const allCategories = useMemo(() => {
    const list = (categories || [])
      .filter((c) => Boolean(c && c.name))
      .map((c) => ({ ...c }));
    (products || []).forEach((p) => {
      if (p.category && !list.some((c) => (c.name || '').toLowerCase() === p.category.toLowerCase())) {
        list.push({ id: 'cat-' + p.category, name: p.category, count: 1 });
      }
    });
    return list;
  }, [categories, products]);

  // Dynamic combined brands from store + all products with Apple & flagship priority
  const allBrands = useMemo(() => {
    const list = (brands || [])
      .filter((b) => Boolean(b && b.name))
      .map((b) => ({ ...b }));
    (products || []).forEach((p) => {
      if (p.brand && !list.some((b) => (b.name || '').toLowerCase() === p.brand.toLowerCase())) {
        list.push({ id: 'brand-' + p.brand, name: p.brand });
      }
    });

    const priority = ['apple', 'samsung', 'vivo', 'oneplus', 'oppo', 'redmi', 'motorola', 'sony', 'lg', 'whirlpool', 'bose', 'marshall'];

    return list.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase().trim();
      const nameB = (b.name || '').toLowerCase().trim();
      const idxA = priority.indexOf(nameA);
      const idxB = priority.indexOf(nameB);

      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;

      return nameA.localeCompare(nameB);
    });
  }, [brands, products]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterType, setFilterType] = useState(searchParams.get('filter') || '');
  const [isFlashOnly, setIsFlashOnly] = useState(searchParams.get('flash') === 'true');
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState(500000);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity');

  // Sync with URL query parameters
  // oxlint-disable react/set-state-in-effect
  useEffect(() => {
    const cat = searchParams.get('category');
    setSelectedCategory(cat || '');
    const br = searchParams.get('brand');
    setSelectedBrand(br || '');
    const q = searchParams.get('search');
    setSearchTerm(q || '');
    const f = searchParams.get('filter');
    setFilterType(f || '');
    const fl = searchParams.get('flash') === 'true';
    setIsFlashOnly(fl);
    const s = searchParams.get('sort');
    if (s) setSortBy(s);
  }, [searchParams]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchTerm('');
    setFilterType('');
    setIsFlashOnly(false);
    setMinRating(0);
    setPriceRange(500000);
    setSortBy('popularity');
    setSearchParams({});
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    const rawFiltered = (products || []).filter((product) => {
      // Offers filter
      if (filterType === 'offers') {
        const hasDiscount = Boolean(
          product.hasOffer ||
          product.couponText ||
          product.offerTitle ||
          (product.price && product.salePrice && product.price > product.salePrice) ||
          product.isFlashSale
        );
        if (!hasDiscount) return false;
      }

      // Flash sale filter
      if (isFlashOnly) {
        if (!product.isFlashSale) return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches =
          (product.name || '').toLowerCase().includes(query) ||
          (product.brand || '').toLowerCase().includes(query) ||
          (product.category || '').toLowerCase().includes(query) ||
          (product.description || '').toLowerCase().includes(query) ||
          (product.modelGroup || '').toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Category filter (Matches category OR brand so that selecting a brand as category or vice-versa never shows 0)
      if (selectedCategory) {
        const catQuery = selectedCategory.trim().toLowerCase();
        const matchesCategory = (product.category || '').toLowerCase() === catQuery;
        const matchesBrand = (product.brand || '').toLowerCase() === catQuery;
        if (!matchesCategory && !matchesBrand) return false;
      }

      // Brand filter
      if (selectedBrand) {
        const brandQuery = selectedBrand.trim().toLowerCase();
        const matchesBrand = (product.brand || '').toLowerCase() === brandQuery;
        const matchesCategory = (product.category || '').toLowerCase() === brandQuery;
        if (!matchesBrand && !matchesCategory) return false;
      }

      // Price filter
      const price = product.salePrice || product.price;
      if (price > priceRange) return false;

      // Rating filter
      if (minRating > 0) {
        if ((product.rating || 0) < minRating) return false;
      }

      return true;
    });

    // Group model-wise so each smartphone/device model appears once with variant selector
    const modelWise = getModelWiseProducts(rawFiltered);

    return modelWise.sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      // Default popularity: combine review count, featured priority, and new arrival flagship status
      const popA = (a.reviewCount || 0) + (a.isFeatured ? 600 : 0) + (a.isNewArrival ? 400 : 0);
      const popB = (b.reviewCount || 0) + (b.isFeatured ? 600 : 0) + (b.isNewArrival ? 400 : 0);
      return popB - popA;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, minRating, sortBy, filterType, isFlashOnly]);

  const totalCatalogModels = useMemo(() => getModelWiseProducts(products || []).length, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* 1. Header & Mobile Filter Trigger */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-black text-slate-900">
            {selectedCategory ? `${selectedCategory}` : selectedBrand ? `${selectedBrand}` : searchTerm ? `Search: "${searchTerm}"` : 'All Showroom Electronics'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> models
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full py-2 px-4 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Filters ({filteredProducts.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: FILTERS SIDEBAR (Flipkart / Amazon Style) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-6 sticky top-[180px]">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              Filters
            </h3>
            {(selectedCategory || selectedBrand || searchTerm || minRating > 0 || priceRange < 500000) && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
              Categories
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center cursor-pointer ${
                  !selectedCategory ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>All Categories</span>
                <span>{totalCatalogModels}</span>
              </button>
              {allCategories.map((cat) => {
                const catName = cat?.name || '';
                if (!catName) return null;
                const catProducts = (products || []).filter(
                  (p) => (p.category || '').toLowerCase() === catName.toLowerCase() || (p.brand || '').toLowerCase() === catName.toLowerCase()
                );
                const count = getModelWiseProducts(catProducts).length;
                const isSelected = (selectedCategory || '').toLowerCase() === catName.toLowerCase();
                return (
                  <button
                    key={cat.id || catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center cursor-pointer ${
                      isSelected ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{catName}</span>
                    <span className="text-[10px] text-gray-400">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
              Brands
            </label>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center cursor-pointer ${
                  !selectedBrand ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>All Brands</span>
              </button>
              {allBrands.map((b) => {
                const bName = b?.name || '';
                if (!bName) return null;
                const brandProducts = (products || []).filter(
                  (p) => (p.brand || '').toLowerCase() === bName.toLowerCase() || (p.category || '').toLowerCase() === bName.toLowerCase()
                );
                const count = getModelWiseProducts(brandProducts).length;
                const isBrandSelected = (selectedBrand || '').toLowerCase() === bName.toLowerCase();
                const isApple = bName.toLowerCase() === 'apple';
                return (
                  <button
                    key={b.id || bName}
                    onClick={() => setSelectedBrand(bName)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center cursor-pointer ${
                      isBrandSelected ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {isApple && (
                        <svg className="w-3.5 h-3.5 fill-current inline-block shrink-0" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.65-13.98-5.99-9.1-10.74-19.46-14.25-31.09-3.51-11.63-5.27-22.6-5.27-32.91 0-14.9 3.65-27.18 10.96-36.83 7.31-9.65 16.59-14.58 27.84-14.79 5.35 0 10.99 1.41 16.92 4.23 5.93 2.82 9.68 4.34 11.26 4.56 1.74-.22 5.64-1.74 11.69-4.56 6.05-2.82 11.39-4.18 16.03-4.08 9.57.43 17.65 3.69 24.23 9.77 6.58 6.08 10.99 13.9 13.23 23.46-8.37 5.09-12.44 12.04-12.21 20.85.23 8.37 3.59 15.29 10.08 20.76 4.35 3.7 9.24 6.08 14.67 7.15-2.17 6.41-4.78 12.72-7.82 18.91zM119.22 33.15c0-6.19 2.28-12.22 6.84-18.09 4.56-5.87 10.21-9.63 16.95-11.28.32 1.3.48 2.5.48 3.59 0 6.08-2.39 12.16-7.17 18.25-4.78 6.09-10.43 9.68-16.95 10.77-.05-1.09-.15-2.18-.15-3.24z"/>
                        </svg>
                      )}
                      <span>{bName}</span>
                    </span>
                    <span className={`text-[10px] ${isBrandSelected ? 'text-amber-700 font-bold' : 'text-gray-400'}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Max Price
              </label>
              <span className="text-xs font-black text-slate-900">
                ₹{priceRange.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="500000"
              step="5000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
              Customer Rating
            </label>
            <div className="space-y-1">
              {[4, 3].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(minRating === star ? 0 : star)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    minRating === star ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="flex items-center text-amber-500">
                      {[...Array(star)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                    <span>& Above</span>
                  </div>
                  {minRating === star && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: SORT BAR & PRODUCTS GRID */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Flipkart Style Sort Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="font-bold text-gray-500 whitespace-nowrap">Sort By:</span>
              <button
                onClick={() => setSortBy('popularity')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                  sortBy === 'popularity' ? 'bg-slate-900 text-amber-400' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Popularity
              </button>
              <button
                onClick={() => setSortBy('price-asc')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                  sortBy === 'price-asc' ? 'bg-slate-900 text-amber-400' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => setSortBy('price-desc')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                  sortBy === 'price-desc' ? 'bg-slate-900 text-amber-400' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Price: High to Low
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                  sortBy === 'rating' ? 'bg-slate-900 text-amber-400' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Customer Rating
              </button>
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                  sortBy === 'newest' ? 'bg-slate-900 text-amber-400' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Newest First
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching electronics found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We couldn't find any products matching your specific combination of filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg shadow-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="font-bold text-slate-900 text-sm">Filter Products</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 text-xs border border-gray-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {allCategories.map((c) => (
                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Mobile Brands */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2 text-xs border border-gray-300 rounded-lg"
              >
                <option value="">All Brands</option>
                {allBrands.map((b) => (
                  <option key={b.id || b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Max Price</span>
                <span>₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2 text-xs font-bold border border-gray-300 rounded-lg text-gray-700"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-bold bg-slate-900 text-amber-400 rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
