import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Layers, Tag, ShoppingBag, Users, 
  Image as ImageIcon, MessageSquare, LogOut, 
  TrendingUp, IndianRupee, ArrowLeft, Percent 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore } from '../../store/useProductStore';
import AdminLogin from './AdminLogin';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuthStore();
  const { products, categories, brands, orders, customers, reviews, offers = [], resetToDefault } = useProductStore();

  const isChildRoute = location.pathname !== '/admin' && location.pathname !== '/admin/';

  // If not admin, require admin authentication
  if (!isAdmin) {
    return <AdminLogin onLoginSuccess={() => navigate('/admin')} />;
  }

  // Dashboard calculations
  const totalSales = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const uniqueCustomerKeys = new Set([
    ...(customers || []).map((c) => (c.email || c.phone || '').toLowerCase()).filter(Boolean),
    ...(orders || []).map((o) => (o.customerEmail || o.customerPhone || '').toLowerCase()).filter(Boolean)
  ]);
  try {
    const reg = JSON.parse(localStorage.getItem('audio_den_registered_users') || '[]');
    reg.forEach((u) => {
      const k = (u.email || u.phone || '').toLowerCase();
      if (k) uniqueCustomerKeys.add(k);
    });
  } catch (err) {
    console.debug('Error counting registered users:', err);
  }
  const totalCustomers = Math.max(uniqueCustomerKeys.size, (customers || []).length);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package, count: totalProducts },
    { label: 'Categories', path: '/admin/categories', icon: Layers, count: categories.length },
    { label: 'Brands', path: '/admin/brands', icon: Tag, count: brands.length },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag, count: totalOrders },
    { label: 'Customers', path: '/admin/customers', icon: Users, count: totalCustomers },
    { label: 'Banners', path: '/admin/banners', icon: ImageIcon },
    { label: 'Offers', path: '/admin/offers', icon: Percent, count: offers.filter((o) => o.enabled).length },
    { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare, count: reviews.filter((r) => !r.approved).length }
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      
      {/* SIDEBAR (Light Theme Clean Admin) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 shadow-xs">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 gap-3">
          <img
            src="/logo.png"
            alt="Audio Den"
            className="h-9 w-auto object-contain"
          />
          <div>
            <span className="font-heading font-black text-xs tracking-wider text-slate-900 block">
              AUDIO DEN
            </span>
            <span className="text-[9px] uppercase tracking-widest text-amber-600 font-bold">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin' || location.pathname === '/admin/'
                : location.pathname.startsWith(item.path);

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-1.5">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-gray-600 hover:text-slate-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>Customer Storefront</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT */}
      <main className="flex-grow flex flex-col overflow-y-auto bg-[#f8fafc]">
        
        {/* Top Header bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Admin Portal: <strong className="text-slate-900">Secure Session Active</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Sync latest 2026 flagship models (Apple, Samsung, OnePlus, Vivo, Oppo) into database?')) {
                  resetToDefault();
                  alert('Database synchronized with all new flagship models!');
                }
              }}
              className="text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              Sync Latest Flagship Models
            </button>
            <span className="hidden sm:inline text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Database Active
            </span>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="p-6 sm:p-8 flex-grow">
          {isChildRoute ? (
            <Outlet />
          ) : (
            /* DASHBOARD OVERVIEW */
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
                  Store Overview & Analytics
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Real-time inventory metrics, customer orders, and revenue statistics for AUDIO DEN.
                </p>
              </div>

              {/* 4 Key Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Total Sales */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                    <span>Total Revenue</span>
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <IndianRupee className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-black text-slate-900">
                      ₹{totalSales.toLocaleString('en-IN')}
                    </h2>
                    <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-bold mt-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
                    </p>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                    <span>Total Orders</span>
                    <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-black text-slate-900">
                      {totalOrders}
                    </h2>
                    <p className="text-[11px] text-blue-600 font-bold mt-1">
                      All orders managed
                    </p>
                  </div>
                </div>

                {/* Total Products */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                    <span>Active Inventory</span>
                    <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <Package className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-black text-slate-900">
                      {totalProducts}
                    </h2>
                    <p className="text-[11px] text-amber-600 font-bold mt-1">
                      Across {categories.length} departments
                    </p>
                  </div>
                </div>

                {/* Total Customers */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                    <span>Registered Buyers</span>
                    <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-black text-slate-900">
                      {totalCustomers}
                    </h2>
                    <p className="text-[11px] text-purple-600 font-bold mt-1">
                      Prayagraj & online customers
                    </p>
                  </div>
                </div>
              </div>

              {/* Revenue Graph & Performance */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-4 shadow-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-sm">Monthly Revenue Trend</h3>
                    <p className="text-xs text-gray-500">Sales volume performance across Prayagraj region</p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                    FY 2026-27
                  </span>
                </div>

                <div className="h-48 w-full pt-2">
                  <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="goldGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,180 Q80,120 160,140 T320,80 T480,90 T600,40 T700,20 L700,200 L0,200 Z"
                      fill="url(#goldGradLight)"
                    />
                    <path
                      d="M0,180 Q80,120 160,140 T320,80 T480,90 T600,40 T700,20"
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="flex justify-between text-[11px] text-gray-400 pt-2 font-medium">
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-4 shadow-xs">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading font-bold text-slate-900 text-sm">Recent Customer Orders</h3>
                  <Link to="/admin/orders" className="text-xs text-blue-600 font-bold hover:underline">
                    Manage All Orders →
                  </Link>
                </div>

                <div className="divide-y divide-gray-100 text-xs">
                  {orders.length === 0 ? (
                    <div className="py-6 text-center text-gray-400">
                      No customer orders yet.
                    </div>
                  ) : (
                    orders.slice(0, 5).map((ord) => (
                      <div key={ord.id} className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-slate-900 block">#{ord.id}</span>
                          <span className="text-gray-500">{ord.customerName} • {ord.date}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-slate-900 block">
                            ₹{ord.totalAmount?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {ord.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
