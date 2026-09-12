import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw, X, Check, Star } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, brands } = useProductStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Dynamic combined categories from store + all products
  const allCategories = useMemo(() => {
    const list = [...categories];
    products.forEach((p) => {
      if (p.category && !list.some((c) => c.name.toLowerCase() === p.category.toLowerCase())) {
        list.push({ id: 'cat-' + p.category, name: p.category, count: 1 });
      }
    });
    return list;
  }, [categories, products]);

  // Dynamic combined brands from store + all products
  const allBrands = useMemo(() => {
    const list = [...brands];
    products.forEach((p) => {
      if (p.brand && !list.some((b) => b.name.toLowerCase() === p.brand.toLowerCase())) {
        list.push({ id: 'brand-' + p.brand, name: p.brand });
      }
    });
    return list;
  }, [brands, products]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState(250000);
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
    const s = searchParams.get('sort');
    if (s) setSortBy(s);
  }, [searchParams]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchTerm('');
    setMinRating(0);
    setPriceRange(250000);
    setSortBy('popularity');
    setSearchParams({});
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query));
          if (!matches) return false;
        }

        // Category filter (Matches category OR brand so that selecting a brand as category or vice-versa never shows 0)
        if (selectedCategory) {
          const catQuery = selectedCategory.trim().toLowerCase();
          const matchesCategory = product.category?.toLowerCase() === catQuery;
          const matchesBrand = product.brand?.toLowerCase() === catQuery;
          if (!matchesCategory && !matchesBrand) return false;
        }

        // Brand filter
        if (selectedBrand) {
          const brandQuery = selectedBrand.trim().toLowerCase();
          const matchesBrand = product.brand?.toLowerCase() === brandQuery;
          const matchesCategory = product.category?.toLowerCase() === brandQuery;
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
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        // Default popularity
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      });
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, minRating, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* 1. Header & Mobile Filter Trigger */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-black text-slate-900">
            {selectedCategory ? `${selectedCategory}` : selectedBrand ? `${selectedBrand}` : searchTerm ? `Search: "${searchTerm}"` : 'All Showroom Electronics'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> items
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
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-6 sticky top-40">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              Filters
            </h3>
            {(selectedCategory || selectedBrand || searchTerm || minRating > 0 || priceRange < 250000) && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center ${
                  !selectedCategory ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {allCategories.map((cat) => {
                const count = products.filter(
                  (p) => p.category?.toLowerCase() === cat.name.toLowerCase() || p.brand?.toLowerCase() === cat.name.toLowerCase()
                ).length;
                const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center ${
                      isSelected ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.name}</span>
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
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center ${
                  !selectedBrand ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>All Brands</span>
              </button>
              {allBrands.map((b) => {
                const count = products.filter(
                  (p) => p.brand?.toLowerCase() === b.name.toLowerCase() || p.category?.toLowerCase() === b.name.toLowerCase()
                ).length;
                return (
                  <button
                    key={b.id || b.name}
                    onClick={() => setSelectedBrand(b.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center ${
                      selectedBrand.toLowerCase() === b.name.toLowerCase() ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] text-gray-400">({count})</span>
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
              max="250000"
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
                max="250000"
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
