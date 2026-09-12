import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Search, User, Menu, X, Heart, 
  ChevronDown, MapPin, ShieldCheck, Phone, 
  Smartphone, Tv, Refrigerator, 
  Flame, Package
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState('211002');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState('');

  const searchContainerRef = useRef(null);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  const { getTotals } = useCartStore();
  const { itemCount, grandTotal } = getTotals();
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { products, categories } = useProductStore();

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter live search preview results
  const liveResults = searchQuery.trim()
    ? products
        .filter((p) => {
          const matchQuery =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
          if (searchCategory === 'All') return matchQuery;
          return matchQuery && p.category.toLowerCase() === searchCategory.toLowerCase();
        })
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const catParam = searchCategory !== 'All' ? `&category=${encodeURIComponent(searchCategory)}` : '';
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}${catParam}`);
      setIsSearchFocused(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleUpdatePincode = (e) => {
    e.preventDefault();
    if (tempPincode.trim().length === 6) {
      setSelectedPincode(tempPincode.trim());
      setIsPincodeModalOpen(false);
      setTempPincode('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0f172a] text-gray-300 text-[11px] py-1.5 px-4 font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <span className="text-gray-300 truncate max-w-[170px] sm:max-w-none">82/55/2 A Road, Tripathi Chauraha, New Katra, Prayagraj</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold text-[10px]">
              <span>GSTIN: 09AGHPG2164L1Z8</span>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5 text-xs flex-shrink-0">
            <a 
              href="tel:+919935102727" 
              className="flex items-center gap-1 hover:text-amber-400 transition-colors text-gray-300 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">+91 9935102727</span>
              <span className="sm:hidden font-bold">Call</span>
            </a>
            <div className="hidden sm:block h-3 w-px bg-gray-700"></div>
            <Link
              to="/admin"
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold tracking-wide transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN FLIPKART / AMAZON STYLE SEARCH & BRAND BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="p-0.5 bg-white rounded-lg border border-gray-200 shadow-xs group-hover:border-amber-500 transition-colors">
              <img
                src="/logo.png"
                alt="AUDIO DEN"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-10 w-10 bg-slate-900 text-amber-400 font-extrabold items-center justify-center rounded text-sm">
                AD
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-heading font-black text-lg sm:text-xl tracking-wide text-slate-900 leading-tight">
                AUDIO DEN
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold -mt-0.5">
                Mobile & Home Appliances
              </span>
            </div>
          </Link>

          {/* Location Delivery Selector (Amazon/Flipkart Style) */}
          <button
            onClick={() => setIsPincodeModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 text-left transition-colors flex-shrink-0 border border-transparent hover:border-gray-200"
            title="Change Delivery Pincode"
          >
            <MapPin className="w-4 h-4 text-slate-700" />
            <div className="text-[11px] leading-tight">
              <span className="text-gray-500 block">Deliver to</span>
              <span className="font-bold text-slate-900 flex items-center gap-0.5">
                Prayagraj {selectedPincode} <ChevronDown className="w-3 h-3 text-gray-400" />
              </span>
            </div>
          </button>

          {/* Flipkart / Amazon Prominent Center Search Bar with Category Filter */}
          <div ref={searchContainerRef} className="flex-grow max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <div className="flex items-center w-full rounded-lg border-2 border-slate-900 overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-amber-400">
                {/* Category Selector Prefix (Dynamic from Categories Store) */}
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="hidden md:block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2.5 border-r border-gray-300 focus:outline-none cursor-pointer hover:bg-gray-200"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>

                {/* Input Text */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search mobiles, TVs, appliances..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-gray-400 focus:outline-none"
                />

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2.5 flex items-center justify-center transition-colors"
                  title="Search Store"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>

            {/* Live Autocomplete Results Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-[11px] text-gray-500 font-semibold px-3">
                  <span>Matching Products in Store ({liveResults.length})</span>
                  <span className="text-amber-600">Press Enter for full results</span>
                </div>

                {liveResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No products found matching "{searchQuery}". Try another keyword.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {liveResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="p-2.5 sm:p-3 hover:bg-amber-50/50 flex items-center gap-3 cursor-pointer transition-colors"
                      >
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=100&q=80'}
                          alt={product.name}
                          className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-gray-100 flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-semibold text-slate-900 truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                            <span className="font-medium text-amber-600">{product.brand}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold text-slate-900 block">
                            ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
                          </span>
                          {product.price > product.salePrice && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-slate-900 font-bold text-xs text-center border-t border-gray-200 transition-colors"
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons (Account, Wishlist, Cart) */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            
            {/* Account / User Dropdown */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 text-slate-800 transition-colors"
                title="Account"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center text-slate-700">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <span className="text-[10px] text-gray-500 block">
                    {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0]}` : 'Hello, Sign In'}
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-0.5">
                    Account <ChevronDown className="w-3 h-3 text-gray-400" />
                  </span>
                </div>
              </button>

              {/* Account Dropdown Menu */}
              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-slate-900">{user?.name || 'Guest User'}</p>
                    <p className="text-gray-500 text-[11px] truncate">{user?.email || 'Sign in to access your orders'}</p>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 text-slate-700 font-medium"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/account?tab=orders"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 text-slate-700 font-medium"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/account?tab=wishlist"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 text-slate-700 font-medium"
                  >
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span>Wishlist ({wishlistItems.length})</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    to="/admin"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 text-amber-700 font-bold"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Dashboard</span>
                  </Link>
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/account?tab=wishlist"
              className="p-2 rounded-lg hover:bg-gray-100 text-slate-700 hover:text-red-500 transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Flipkart / Amazon Style Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded-lg transition-colors shadow-xs"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-black">
                {itemCount > 0 ? `₹${grandTotal.toLocaleString('en-IN')}` : 'Cart'}
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-slate-700"
              title="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. FLIPKART / AMAZON CATEGORY STRIP / NAVIGATION RIBBON (Dynamic) */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between overflow-x-auto py-2.5 text-xs font-semibold text-slate-700 space-x-6 no-scrollbar">
            <Link
              to="/shop"
              className="hover:text-amber-600 transition-colors whitespace-nowrap flex items-center gap-1.5 font-bold"
            >
              <span>All Products</span>
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id || c.name}
                to={`/shop?category=${encodeURIComponent(c.name)}`}
                className="hover:text-amber-600 transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{c.name}</span>
              </Link>
            ))}
            <Link
              to="/categories"
              className="hover:text-amber-600 transition-colors whitespace-nowrap flex items-center gap-1 text-blue-600 font-bold"
            >
              <span>All Categories →</span>
            </Link>
            <Link
              to="/shop?flash=true"
              className="text-red-600 hover:text-red-700 font-extrabold whitespace-nowrap flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-full border border-red-200"
            >
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-bounce" />
              <span>Flash Deals</span>
            </Link>
            <a
              href="/#brand-finance"
              className="text-blue-700 hover:text-blue-800 font-extrabold whitespace-nowrap flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200"
            >
              <span>💳 0% Brand Finance</span>
            </a>
          </nav>
        </div>
      </div>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 space-y-4 shadow-2xl max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-gray-50 text-slate-800 hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-gray-50 text-slate-800 hover:bg-gray-100"
            >
              Shop All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-gray-50 text-slate-800 hover:bg-gray-100 truncate"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-amber-50 text-amber-900 font-bold hover:bg-amber-100"
            >
              All Departments →
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-amber-600 font-bold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Portal</span>
            </Link>
          </div>
        </div>
      )}

      {/* Pincode Change Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" /> Choose your location
              </h3>
              <button onClick={() => setIsPincodeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Select delivery location to see product availability and delivery timelines.
            </p>
            <form onSubmit={handleUpdatePincode} className="space-y-3">
              <input
                type="text"
                maxLength={6}
                value={tempPincode}
                onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode (e.g. 211002)"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPincodeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tempPincode.trim().length !== 6}
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
