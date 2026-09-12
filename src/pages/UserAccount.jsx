import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, Package, Heart, MapPin, LogOut, ShieldCheck, 
  Trash2, ArrowRight, Plus,
  Truck, FileText, MessageCircle, Download, Printer, CheckCircle2,
  Clock, ChevronDown, ChevronUp, RotateCcw, X, Check, XCircle,
  UserCheck, AlertCircle, Sparkles, Lock
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';

export default function UserAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') || 'profile';
  const redirectPath = searchParams.get('redirect') || null;

  const { user, isAuthenticated, login, register, loginAsDemoCustomer, logout, updateProfile, addAddress, removeAddress } = useAuthStore();
  const { orders, products, updateOrderStatus } = useProductStore();
  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const [activeTab, setActiveTab] = useState(initialTab); // 'profile', 'orders', 'wishlist', 'addresses'
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [expandedTracking, setExpandedTracking] = useState({});
  const [reorderNotice, setReorderNotice] = useState(null);
  
  // Auth Form states
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Edit Profile states
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileUpdated, setProfileUpdated] = useState(false);

  // New Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Prayagraj');
  const [newAddrState, setNewAddrState] = useState('Uttar Pradesh');
  const [newAddrPincode, setNewAddrPincode] = useState('211002');

  // Filter orders specifically for the logged-in customer (or show all if admin)
  const userOrders = user?.isAdmin
    ? orders
    : orders.filter(
        (o) =>
          (user?.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
          (user?.phone && o.customerPhone && (o.customerPhone === user.phone || o.customerPhone.includes(user.phone.slice(-10))))
      );

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const res = login(email, password);
    if (!res.success) {
      setAuthError(res.message);
    } else if (redirectPath) {
      navigate(redirectPath);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!name.trim() || !email.trim() || !password) {
      setAuthError('Please fill in all required fields');
      return;
    }
    const res = register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '9935102727',
      password
    });
    if (!res.success) {
      setAuthError(res.message);
    } else if (redirectPath) {
      navigate(redirectPath);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoCustomer();
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name: editName, phone: editPhone });
    setProfileUpdated(true);
    setTimeout(() => setProfileUpdated(false), 3000);
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddrName || !newAddrStreet) return;
    addAddress({
      name: newAddrName,
      phone: newAddrPhone,
      address: newAddrStreet,
      landmark: newAddrLandmark,
      city: newAddrCity,
      state: newAddrState,
      pincode: newAddrPincode
    });
    setShowAddressForm(false);
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrStreet('');
    setNewAddrLandmark('');
  };

  const getOrderItemImage = (it) => {
    if (it.image && !it.image.includes('unsplash') && it.image.startsWith('/products')) return it.image;
    const prod = products?.find((p) => p.id === it.productId || p.id === it.id);
    if (prod?.images?.[0]) return prod.images[0];
    const n = (it.name || '').toLowerCase();
    if (n.includes('16 pro max') || n.includes('iphone 16 pro max')) return '/products/apple-iphone16-pro-max.png';
    if (n.includes('iphone 16') || n.includes('iphone 15')) return '/products/apple-iphone16-black.png';
    if (n.includes('iphone 17')) return '/products/apple-iphone17-spacegray.png';
    if (n.includes('s25 ultra') || n.includes('s24 ultra')) return '/products/samsung-s25-ultra.png';
    if (n.includes('z flip')) return '/products/samsung-z-flip6.png';
    if (n.includes('z fold')) return '/products/samsung-z-fold6.png';
    if (n.includes('a55')) return '/products/samsung-a55.png';
    if (n.includes('oneplus 13') || n.includes('nord 6')) return '/products/oneplus-nord6-black.png';
    if (n.includes('oneplus 15')) return '/products/oneplus-15-sandstorm.png';
    if (n.includes('n6x')) return '/products/oneplus-n6x-burgundy.png';
    if (n.includes('x200 pro')) return '/products/vivo-x200-pro.png';
    if (n.includes('v40')) return '/products/vivo-v40-pro.png';
    if (n.includes('x100')) return '/products/vivo-x100-pro.png';
    if (n.includes('reno16c')) return '/products/oppo-reno16c-white.png';
    if (n.includes('reno 12')) return '/products/oppo-reno12-pro-gold-512.png';
    if (n.includes('find x8')) return '/products/oppo-find-x8-pro.png';
    if (n.includes('f27 pro')) return '/products/oppo-f27-pro.png';
    if (n.includes('bravia')) return '/products/sony-bravia-oled.png';
    if (n.includes('refrigerator') || n.includes('fridge')) return '/products/lg-instaview-fridge.png';
    return '/products/apple-iphone16-pro-max.png';
  };

  const toggleTrack = (orderId) => {
    setExpandedTracking((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleReorder = (ord) => {
    ord.items?.forEach((it) => {
      const prod = products?.find((p) => p.id === it.productId || p.id === it.id) || {
        id: it.id || it.productId || `prod-${Date.now()}`,
        name: it.name,
        price: it.price,
        salePrice: it.price,
        images: [getOrderItemImage(it)]
      };
      addToCart(prod, it.quantity || 1);
    });
    setReorderNotice(`Items from Order #${ord.id} added to cart!`);
    setTimeout(() => setReorderNotice(null), 3500);
  };

  // If not logged in, render Flipkart/Amazon style clean Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 space-y-4">
        
        {/* Redirect Notice if coming from Checkout */}
        {redirectPath && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 shadow-2xs">
            <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Please sign in or create an account to book your order. Your items are saved!</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-heading font-black text-slate-900">
              {authMode === 'login' ? 'Sign in to Audio Den' : authMode === 'register' ? 'Create Customer Account' : 'Reset Password'}
            </h2>
            <p className="text-xs text-gray-500">
              {authMode === 'login'
                ? 'Access your orders, live Blue Dart tracking & GST tax invoices'
                : 'Join tech buyers in Prayagraj for exclusive showroom offers'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-gray-100 pb-1 text-xs font-bold gap-4">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`pb-2 transition-colors relative ${
                authMode === 'login' ? 'text-amber-600 border-b-2 border-amber-500 font-black' : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
              className={`pb-2 transition-colors relative ${
                authMode === 'register' ? 'text-amber-600 border-b-2 border-amber-500 font-black' : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rohit.verma26@gmail.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
                <span className="text-gray-400">Default test: password123</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Instant One-Click Demo Customer Login */}
              <div className="pt-2 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 font-bold text-xs border border-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>One-Click Demo Customer Login (Rohit Verma)</span>
                </button>
              </div>

              <div className="text-center pt-2 text-xs text-gray-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Register now
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohit Verma"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rohit.verma26@gmail.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mobile Number (WhatsApp Notifications) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9839123456"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Create Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Create Customer Account</span>
                <Check className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2 text-xs text-gray-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {authMode === 'forgot' && (
            <div className="space-y-4 text-xs">
              <p className="text-gray-600">Enter your email and we'll send you a password reset link.</p>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="w-full py-2.5 bg-slate-900 text-amber-400 font-bold rounded-xl"
              >
                Send Reset Link
              </button>
              {forgotSent && (
                <p className="text-emerald-700 font-bold text-[11px]">✓ Reset instructions sent to your email!</p>
              )}
              <div className="text-center pt-2">
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Logged-in Customer Profile / Orders / Wishlist Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-heading font-black text-slate-900">
            Welcome back, {user?.name || 'Customer'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT TAB NAVIGATION (Flipkart My Account Sidebar) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'profile' ? 'bg-amber-50 text-amber-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Information</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'orders' ? 'bg-amber-50 text-amber-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
              {userOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'wishlist' ? 'bg-amber-50 text-amber-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4" />
              <span>My Wishlist</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
              {wishlistItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'addresses' ? 'bg-amber-50 text-amber-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Addresses</span>
          </button>

          <div className="border-t border-gray-100 pt-2 mt-2">
            <Link
              to="/admin"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-amber-700 hover:bg-amber-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management</span>
            </Link>
          </div>
        </div>

        {/* RIGHT CONTENT PANE */}
        <div className="lg:col-span-9 bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-slate-900">Personal Information</h3>
                <p className="text-xs text-gray-500">Manage your contact details and default shipping name</p>
              </div>

              {profileUpdated && (
                <div className="p-2.5 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  ✓ Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg shadow-sm"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-500" />
                    <span>My Orders & Purchases</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Live delivery tracking, official GST tax invoices, and real-time shipment updates
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Total Orders'}
                </span>
              </div>

              {reorderNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{reorderNotice}</span>
                  </div>
                  <Link to="/cart" className="underline hover:text-emerald-900 ml-3">
                    Go to Cart &rarr;
                  </Link>
                </div>
              )}

              {userOrders.length === 0 ? (
                <div className="py-14 text-center space-y-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-14 h-14 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
                    <Package className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-900">No orders placed yet</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Browse top smartphones from Apple, Samsung, OnePlus, Vivo, and Oppo with free Prayagraj delivery!
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-wider rounded-lg inline-flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Explore Flagship Deals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {userOrders.map((ord) => {
                    const isDelivered = ord.status === 'Delivered';
                    const isShipped = ord.status === 'Shipped';
                    const isTrackingOpen = !!expandedTracking[ord.id];

                    return (
                      <div
                        key={ord.id}
                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all space-y-0"
                      >
                        {/* Order Header Bar */}
                        <div className="p-4 bg-slate-50/80 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 text-xs">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-black text-sm text-slate-900 font-mono tracking-tight">
                              Order #{ord.id}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 font-medium">Placed on {ord.date}</span>
                            {ord.courier && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="font-bold text-slate-700 bg-white border border-gray-200 px-2.5 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                                  <Truck className="w-3 h-3 text-blue-600" />
                                  {ord.courier}
                                  {ord.trackingNumber && (
                                    <span className="font-mono text-gray-500 font-normal">({ord.trackingNumber})</span>
                                  )}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Order Status Badge */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs ${
                                isDelivered
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : isShipped
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isDelivered ? 'bg-emerald-600' : isShipped ? 'bg-blue-600 animate-pulse' : 'bg-amber-500'
                                }`}
                              />
                              {ord.status || 'Confirmed'}
                            </span>
                          </div>
                        </div>

                        {/* Visual Shipment Progress Stepper (Amazon / Flipkart style) */}
                        <div className="px-5 py-4 border-b border-gray-100 bg-linear-to-r from-white via-slate-50/50 to-white">
                          <div className="flex items-center justify-between text-[11px] relative">
                            {/* Connecting Line */}
                            <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-gray-200 -z-0">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{
                                  width: isDelivered ? '100%' : isShipped ? '66%' : '33%'
                                }}
                              />
                            </div>

                            {/* Step 1: Confirmed */}
                            <div className="flex flex-col items-center text-center z-10">
                              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-slate-800 mt-1.5">Order Placed</span>
                              <span className="text-[10px] text-gray-400">{ord.date}</span>
                            </div>

                            {/* Step 2: Packed */}
                            <div className="flex flex-col items-center text-center z-10">
                              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-slate-800 mt-1.5">Packed</span>
                              <span className="text-[10px] text-gray-400">Prayagraj Hub</span>
                            </div>

                            {/* Step 3: Shipped */}
                            <div className="flex flex-col items-center text-center z-10">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                                  isShipped || isDelivered
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                                }`}
                              >
                                {isShipped || isDelivered ? <Check className="w-4 h-4" /> : <Truck className="w-3.5 h-3.5" />}
                              </div>
                              <span className={`font-bold mt-1.5 ${isShipped || isDelivered ? 'text-slate-800' : 'text-gray-400'}`}>
                                Shipped
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {ord.courier ? ord.courier.split(' ')[0] : 'In Transit'}
                              </span>
                            </div>

                            {/* Step 4: Delivered */}
                            <div className="flex flex-col items-center text-center z-10">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                                  isDelivered
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                                }`}
                              >
                                {isDelivered ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                              </div>
                              <span className={`font-bold mt-1.5 ${isDelivered ? 'text-emerald-700' : 'text-gray-400'}`}>
                                Delivered
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {isDelivered ? ord.deliveredDate?.split(',')[0] || 'Delivered' : ord.expectedDelivery || 'Upcoming'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Items List with 100% Real Model Images */}
                        <div className="p-4 sm:p-5 space-y-4">
                          {ord.items?.map((it, idx) => {
                            const realImg = getOrderItemImage(it);
                            return (
                              <div
                                key={idx}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100"
                              >
                                <div className="flex items-center gap-3.5 flex-grow min-w-0">
                                  {/* Crisp Phone Model Image */}
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl p-2 border border-gray-200 flex-shrink-0 flex items-center justify-center shadow-xs">
                                    <img
                                      src={realImg}
                                      alt={it.name}
                                      className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-200"
                                      loading="lazy"
                                    />
                                  </div>

                                  <div className="space-y-1 min-w-0">
                                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                      {it.name}
                                    </h4>
                                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-500">
                                      {it.specs && (
                                        <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                                          {it.specs}
                                        </span>
                                      )}
                                      <span>Qty: <strong className="text-slate-800">{it.quantity}</strong></span>
                                      <span>•</span>
                                      <span>Official Brand Warranty Included</span>
                                    </div>
                                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 pt-0.5">
                                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Audio Den Verified Delivery</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                                  <span className="text-sm sm:text-base font-black text-slate-900">
                                    ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[11px] text-gray-400">
                                    ₹{it.price.toLocaleString('en-IN')} each
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Address & Payment Info Grid */}
                        <div className="px-4 sm:px-5 py-3.5 bg-slate-50/50 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-800 block mb-0.5">Delivery Address:</span>
                              <p className="text-gray-600 leading-relaxed font-medium">
                                {ord.shippingAddress}
                              </p>
                              {ord.customerName && (
                                <p className="text-gray-500 text-[11px] mt-0.5">
                                  Recipient: {ord.customerName} {ord.customerPhone ? `(${ord.customerPhone})` : ''}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="sm:text-right flex flex-col sm:items-end justify-center space-y-1">
                            <div className="flex sm:justify-end items-baseline gap-2">
                              <span className="text-gray-500">Total Paid:</span>
                              <span className="text-base font-black text-slate-900">
                                ₹{ord.totalAmount?.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex sm:justify-end items-center gap-1.5 text-gray-600 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Payment: <strong>{ord.paymentMethod}</strong></span>
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                                Verified
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Live Tracking Timeline */}
                        {isTrackingOpen && (
                          <div className="p-4 sm:p-5 bg-amber-50/30 border-t border-amber-100 space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-amber-600" />
                                <span>Courier Shipment Journey ({ord.courier || 'Express Delivery'})</span>
                              </h5>
                              {ord.trackingNumber && (
                                <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                                  AWB: {ord.trackingNumber}
                                </span>
                              )}
                            </div>

                            <div className="space-y-3 pl-2 border-l-2 border-amber-300 ml-2 text-xs">
                              {(ord.timeline || [
                                { title: 'Order Confirmed', date: `${ord.date}, 10:30 AM`, desc: 'Verified by showroom', completed: true },
                                { title: 'Packed & Dispatched', date: `${ord.date}, 04:15 PM`, desc: 'Audio Den Hub Prayagraj', completed: true },
                                { title: 'In Transit', date: '05 Sep 2026, 11:00 AM', desc: 'Moving towards destination', completed: isShipped || isDelivered },
                                { title: 'Delivered', date: isDelivered ? ord.deliveredDate || '03 Sep 2026' : 'Upcoming', desc: isDelivered ? 'Delivered successfully' : 'Pending', completed: isDelivered }
                              ]).map((step, sIdx) => (
                                <div key={sIdx} className="relative pl-3">
                                  <span
                                    className={`absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full ${
                                      step.completed ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-gray-300'
                                    }`}
                                  />
                                  <div className="flex justify-between items-baseline gap-2">
                                    <span className={`font-bold ${step.completed ? 'text-slate-900' : 'text-gray-400'}`}>
                                      {step.title}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-mono">{step.date}</span>
                                  </div>
                                  <p className="text-[11px] text-gray-500">{step.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons Toolbar */}
                        <div className="p-3 sm:px-5 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Track Shipment Toggle */}
                            <button
                              onClick={() => toggleTrack(ord.id)}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5 text-amber-600" />
                              <span>{isTrackingOpen ? 'Hide Tracking' : 'Track Shipment'}</span>
                              {isTrackingOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>

                            {/* Download Tax Invoice */}
                            <button
                              onClick={() => setSelectedInvoiceOrder(ord)}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>Tax Invoice</span>
                            </button>

                            {/* Buy Again */}
                            <button
                              onClick={() => handleReorder(ord)}
                              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                              <span>Buy Again</span>
                            </button>

                            {/* Cancel Order */}
                            {(ord.status === 'Pending' || ord.status === 'Processing' || !ord.status) && (
                              <button
                                onClick={() => {
                                  if(window.confirm('Are you sure you want to cancel this order?')) {
                                    updateOrderStatus(ord.id, 'Cancelled');
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancel Order</span>
                              </button>
                            )}
                          </div>

                          {/* Order on WhatsApp Direct Help */}
                          <a
                            href={`https://wa.me/919935102727?text=${encodeURIComponent(
                              `*AUDIO DEN - ORDER INQUIRY*\n\nHello Audio Den, I need support regarding my Order #${ord.id}.\n*Items:* ${ord.items?.map((i) => `${i.name} (Qty: ${i.quantity})`).join(', ')}\n*Total:* ₹${ord.totalAmount?.toLocaleString('en-IN')}\n*Current Status:* ${ord.status}\n\nPlease check my order status!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>Need Help on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-slate-900">My Saved Wishlist ({wishlistItems.length})</h3>
                <p className="text-xs text-gray-500">Items you have saved for later</p>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Heart className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-500">Your wishlist is currently empty.</p>
                  <Link to="/shop" className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg inline-block">
                    Browse All Products
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {wishlistItems.map((prod) => (
                    <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images?.[0]}
                          alt={prod.name}
                          className="w-14 h-14 object-contain rounded p-1 border border-gray-100"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{prod.brand}</span>
                          <Link to={`/product/${prod.id}`}>
                            <h4 className="font-bold text-xs text-slate-900 hover:text-blue-600 line-clamp-1">{prod.name}</h4>
                          </Link>
                          <span className="font-black text-xs text-slate-900">
                            ₹{(prod.salePrice || prod.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            addToCart(prod, 1);
                            removeWishlistItem(prod.id);
                          }}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-xs"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => removeWishlistItem(prod.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Manage Saved Addresses</h3>
                  <p className="text-xs text-gray-500">Shipping destinations for your orders</p>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-3 py-1.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddressSubmit} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900">Add Delivery Location</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Receiver Name"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Phone"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Street Address / House No."
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      className="sm:col-span-2 p-2 border rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Landmark"
                      value={newAddrLandmark}
                      onChange={(e) => setNewAddrLandmark(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddrState}
                      onChange={(e) => setNewAddrState(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Pincode (e.g. 211002)"
                      value={newAddrPincode}
                      onChange={(e) => setNewAddrPincode(e.target.value)}
                      className="p-2 border rounded-lg bg-white font-semibold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg">
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(user?.addresses || []).map((addr) => (
                  <div key={addr.id} className="p-4 rounded-xl border border-gray-200 bg-white space-y-2 text-xs relative">
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Default Address
                      </span>
                    )}
                    <h5 className="font-bold text-slate-900">{addr.name}</h5>
                    <p className="text-gray-600 leading-relaxed">
                      {addr.address}, {addr.landmark ? addr.landmark + ', ' : ''}{addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-gray-500 font-medium">Phone: {addr.phone}</p>
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="text-red-500 hover:text-red-700 text-[11px] font-bold pt-1"
                    >
                      Delete Address
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================= OFFICIAL GST TAX INVOICE MODAL ================= */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header Bar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm sm:text-base">Tax Invoice & Delivery Receipt</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800 font-sans" id="printable-invoice">
              
              {/* Showroom & Invoice Identity */}
              <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-heading font-black text-slate-950 tracking-wider">
                      AUDIO DEN
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                      Authorized Retail
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">
                    82/55/2 A Road, Tripathi Chauraha, New Katra, Prayagraj, UP - 211002
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    GSTIN: <strong className="text-slate-800">09AGHPG2164L1Z8</strong>
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Helpline / WhatsApp: +91 9935102727 • vaibhavgupta1974@gmail.com
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono font-black text-xs block">
                    {selectedInvoiceOrder.invoiceNumber || `AD-INV-${selectedInvoiceOrder.id}`}
                  </span>
                  <p className="text-gray-500 text-[11px]">Date: {selectedInvoiceOrder.date}</p>
                  <p className="text-gray-500 text-[11px]">Order ID: #{selectedInvoiceOrder.id}</p>
                  <p className="text-emerald-700 font-bold text-[11px]">
                    Status: {selectedInvoiceOrder.status}
                  </p>
                </div>
              </div>

              {/* Billed To / Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-xl border border-gray-200">
                <div>
                  <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block mb-1">
                    Billed To & Delivered To:
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">{selectedInvoiceOrder.customerName || 'Valued Customer'}</h5>
                  <p className="text-gray-600 mt-1 leading-relaxed">{selectedInvoiceOrder.shippingAddress}</p>
                  <p className="text-gray-500 mt-1">Phone: {selectedInvoiceOrder.customerPhone || '+91 9935102727'}</p>
                </div>
                <div className="sm:text-right">
                  <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block mb-1">
                    Payment Details:
                  </span>
                  <p className="font-bold text-slate-900">{selectedInvoiceOrder.paymentMethod}</p>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Courier: {selectedInvoiceOrder.courier || 'Blue Dart Express'}
                  </p>
                  {selectedInvoiceOrder.trackingNumber && (
                    <p className="text-gray-500 font-mono text-[11px]">
                      AWB: {selectedInvoiceOrder.trackingNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-[11px] text-slate-700 uppercase tracking-wider font-black">
                      <th className="py-2 px-1">#</th>
                      <th className="py-2 px-2">Item Description</th>
                      <th className="py-2 px-2">HSN Code</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-2 text-right">Unit Price</th>
                      <th className="py-2 px-2 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedInvoiceOrder.items?.map((it, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3 px-1 text-gray-400 font-bold">{idx + 1}</td>
                        <td className="py-3 px-2">
                          <span className="font-bold text-slate-900 block">{it.name}</span>
                          {it.specs && <span className="text-[10px] text-gray-500">{it.specs}</span>}
                        </td>
                        <td className="py-3 px-2 font-mono text-gray-500 text-[11px]">85171300</td>
                        <td className="py-3 px-2 text-center font-bold text-slate-900">{it.quantity}</td>
                        <td className="py-3 px-2 text-right text-gray-600">
                          ₹{it.price?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-2 text-right font-black text-slate-900">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Calculation */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t-2 border-gray-200">
                <div className="space-y-1 text-gray-500 max-w-xs text-[11px]">
                  <p className="font-bold text-slate-800">Terms & Conditions:</p>
                  <p>1. Warranty covered under official manufacturer India warranty terms.</p>
                  <p>2. Keep this invoice for claiming warranty at official service centers.</p>
                  <p>3. This is an electronically generated invoice certified by Audio Den.</p>
                </div>

                <div className="w-full sm:w-64 space-y-2 text-right">
                  <div className="flex justify-between text-gray-600">
                    <span>Taxable Amount (Excl. GST):</span>
                    <span>₹{Math.round(selectedInvoiceOrder.totalAmount / 1.18).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST (9%):</span>
                    <span>₹{Math.round((selectedInvoiceOrder.totalAmount / 1.18) * 0.09).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST (9%):</span>
                    <span>₹{Math.round((selectedInvoiceOrder.totalAmount / 1.18) * 0.09).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Delivery Charges:</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-base font-black text-slate-950">
                    <span>Grand Total:</span>
                    <span>₹{selectedInvoiceOrder.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Official Seal & Signature */}
              <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-end text-[11px] text-gray-500">
                <div className="space-y-1">
                  <div className="w-20 h-20 rounded-full border-2 border-emerald-600/30 flex items-center justify-center p-1 text-center font-bold text-[9px] text-emerald-700 uppercase rotate-[-8deg]">
                    Audio Den Verified Seal
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-cursive text-base font-bold text-slate-800">A. K. Sharma</div>
                  <p className="font-bold text-slate-900">For AUDIO DEN</p>
                  <p className="text-[10px]">Authorized Signatory</p>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-slate-700 font-bold hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Save / Print PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
