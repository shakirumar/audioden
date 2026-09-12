import { useState, useMemo } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { 
  Search, Mail, Phone, MapPin, ShoppingBag, IndianRupee, 
  MessageCircle, ExternalLink, Plus, X, Trash2,
  Eye, Users, Award, Download
} from 'lucide-react';
import { printGstInvoice } from '../../services/notificationService';

export default function AdminCustomers() {
  const { customers = [], orders = [], addCustomer, deleteCustomer } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'repeat', 'prayagraj', 'high'
  const [sortBy, setSortBy] = useState('spend_desc'); // 'spend_desc', 'orders_desc', 'recent', 'name'
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For orders history modal
  const [showAddModal, setShowAddModal] = useState(false);

  // New Customer Form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCity, setNewCustCity] = useState('Prayagraj');
  const [newCustAddress, setNewCustAddress] = useState('');

  // 1. Comprehensive Customer Aggregation:
  // Combines static customers, customers from registered users in localStorage, and customers who placed orders
  const aggregatedCustomers = useMemo(() => {
    const customerMap = new Map();

    // A. Add customers from store
    (customers || []).forEach((c) => {
      const key = (c.email || c.phone || c.id || '').toLowerCase();
      if (key) {
        customerMap.set(key, {
          id: c.id,
          name: c.name || 'Valued Customer',
          email: c.email || '',
          phone: c.phone || '',
          city: c.city || 'Prayagraj',
          joinedDate: c.joinedDate || '2026-09-09',
          totalOrders: c.totalOrders || 0,
          totalSpent: c.totalSpent || 0
        });
      }
    });

    // B. Add registered users from localStorage
    try {
      const registered = JSON.parse(localStorage.getItem('audio_den_registered_users') || '[]');
      registered.forEach((u, uIdx) => {
        const key = (u.email || u.phone || u.id || '').toLowerCase();
        if (key) {
          const existing = customerMap.get(key);
          if (existing) {
            customerMap.set(key, {
              ...existing,
              name: existing.name || u.name,
              phone: existing.phone || u.phone,
              city: existing.city || (u.addresses?.[0]?.city) || 'Prayagraj'
            });
          } else {
            customerMap.set(key, {
              id: u.id || `reg-user-${uIdx}`,
              name: u.name || 'Registered Buyer',
              email: u.email || '',
              phone: u.phone || '',
              city: (u.addresses?.[0]?.city) || 'Prayagraj',
              joinedDate: u.joinedDate || '2026-09-09',
              totalOrders: 0,
              totalSpent: 0
            });
          }
        }
      });
    } catch (e) {
      console.debug('Error reading registered users:', e);
    }

    // C. Add customers directly from Orders
    (orders || []).forEach((o, oIdx) => {
      const key = (o.customerEmail || o.customerPhone || '').toLowerCase();
      if (key) {
        const existing = customerMap.get(key);
        const orderAmount = Number(o.totalAmount || 0);

        if (existing) {
          // Check if we need to refine name or phone
          customerMap.set(key, {
            ...existing,
            name: existing.name || o.customerName,
            phone: existing.phone || o.customerPhone,
            city: o.shippingAddress?.includes('Prayagraj') ? 'Prayagraj' : existing.city
          });
        } else {
          customerMap.set(key, {
            id: 'ord-cust-' + (o.customerPhone || o.id || `idx-${oIdx}`),
            name: o.customerName || 'Valued Customer',
            email: o.customerEmail || '',
            phone: o.customerPhone || '',
            city: o.shippingAddress?.includes('Prayagraj') ? 'Prayagraj' : 'Prayagraj',
            joinedDate: o.date || '2026-09-09',
            totalOrders: 1,
            totalSpent: orderAmount
          });
        }
      }
    });

    // Compute actual order counts & total spending directly from live orders
    let finalCustomers = Array.from(customerMap.values()).map((cust) => {
      const custOrders = (orders || []).filter(
        (o) =>
          (cust.email && o.customerEmail?.toLowerCase() === cust.email.toLowerCase()) ||
          (cust.phone && o.customerPhone && (o.customerPhone === cust.phone || o.customerPhone.includes(cust.phone.slice(-10))))
      );

      const liveOrdersCount = custOrders.length;
      const liveSpend = custOrders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);

      return {
        ...cust,
        orders: custOrders,
        actualOrdersCount: liveOrdersCount > 0 ? liveOrdersCount : cust.totalOrders || 0,
        actualTotalSpent: liveSpend > 0 ? liveSpend : cust.totalSpent || 0
      };
    });

    try {
      const deletedRecords = JSON.parse(localStorage.getItem('audio_den_deleted_customers') || '[]');
      if (deletedRecords.length > 0) {
        finalCustomers = finalCustomers.filter(c => 
          !deletedRecords.some(d => 
            d.id === c.id || 
            (d.email && c.email && d.email.toLowerCase() === c.email.toLowerCase()) || 
            (d.phone && c.phone && d.phone === c.phone)
          )
        );
      }
    } catch (e) {
      console.error('Error filtering deleted customers:', e);
    }

    return finalCustomers;
  }, [customers, orders]);

  // Search & Filter
  const filteredCustomers = useMemo(() => {
    let list = aggregatedCustomers.filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.city || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterType === 'repeat') {
        return c.actualOrdersCount > 1;
      }
      if (filterType === 'prayagraj') {
        return (c.city || '').toLowerCase().includes('prayagraj');
      }
      if (filterType === 'high') {
        return c.actualTotalSpent >= 50000;
      }

      return true;
    });

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'spend_desc') return b.actualTotalSpent - a.actualTotalSpent;
      if (sortBy === 'orders_desc') return b.actualOrdersCount - a.actualOrdersCount;
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'recent') return (b.joinedDate || '').localeCompare(a.joinedDate || '');
      return 0;
    });

    return list;
  }, [aggregatedCustomers, searchTerm, filterType, sortBy]);

  // Overall Statistics
  const totalCustomerCount = aggregatedCustomers.length;
  const totalRevenue = aggregatedCustomers.reduce((acc, c) => acc + c.actualTotalSpent, 0);
  const totalOrdersPlaced = orders.length;
  const repeatBuyersCount = aggregatedCustomers.filter((c) => c.actualOrdersCount > 1).length;

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) {
      alert('Please provide customer name and mobile number.');
      return;
    }

    addCustomer({
      name: newCustName.trim(),
      email: newCustEmail.trim() || `${newCustPhone.replace(/\D/g, '')}@walkin.audioden.com`,
      phone: newCustPhone.trim(),
      city: newCustCity.trim() || 'Prayagraj',
      address: newCustAddress.trim(),
      joinedDate: new Date().toISOString().split('T')[0]
    });

    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustAddress('');
    setShowAddModal(false);
  };

  const exportCustomerCsv = () => {
    const headers = ['Customer Name', 'Email', 'Phone', 'City', 'Total Orders', 'Total Spent (INR)', 'Joined Date'];
    const rows = filteredCustomers.map((c) => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.city}"`,
      c.actualOrdersCount,
      c.actualTotalSpent,
      `"${c.joinedDate}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audio_den_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              Customer Accounts & Database
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Registered buyers, live purchase records, lifetime spending & direct WhatsApp/Email dispatch in Prayagraj.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportCustomerCsv}
            className="px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Total Customers</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900">{totalCustomerCount}</div>
          <div className="text-[10px] text-emerald-600 font-bold">Active in Prayagraj Showroom</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Total Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900">{totalOrdersPlaced}</div>
          <div className="text-[10px] text-gray-500">Across all customer accounts</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Total Customer Spend</span>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold">Lifetime Sales Volume</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Repeat Buyers</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900">{repeatBuyersCount}</div>
          <div className="text-[10px] text-purple-700 font-bold">High Loyalty Customers</div>
        </div>
      </div>

      {/* SEARCH, FILTER CHIPS & SORTING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, mobile, email, city..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pl-9 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills & Sort Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-bold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              All ({totalCustomerCount})
            </button>
            <button
              onClick={() => setFilterType('prayagraj')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterType === 'prayagraj' ? 'bg-white text-slate-900 shadow-2xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Prayagraj Local
            </button>
            <button
              onClick={() => setFilterType('repeat')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterType === 'repeat' ? 'bg-white text-slate-900 shadow-2xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Repeat ({repeatBuyersCount})
            </button>
            <button
              onClick={() => setFilterType('high')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterType === 'high' ? 'bg-white text-slate-900 shadow-2xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              ₹50k+ VIP
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="spend_desc">Sort: Highest Spending</option>
            <option value="orders_desc">Sort: Most Orders</option>
            <option value="recent">Sort: Newest First</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>

      </div>

      {/* CUSTOMERS GRID */}
      {filteredCustomers.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No customers matching criteria</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query or reset filters to see registered customers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((cust) => {
            const cleanPhone = (cust.phone || '').replace(/\D/g, '').slice(-10);
            const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
              `Hello ${cust.name}, this is Audio Den Electronics Showroom, Prayagraj. We would love to assist you!`
            )}`;
            const isVip = cust.actualTotalSpent >= 100000;
            const isRepeat = cust.actualOrdersCount > 1;

            return (
              <div
                key={cust.id}
                className="p-5 rounded-2xl bg-white border border-gray-200 space-y-4 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Customer Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 text-amber-800 border border-amber-200 font-black font-heading flex items-center justify-center text-lg flex-shrink-0">
                        {cust.name ? cust.name[0].toUpperCase() : 'C'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-sm truncate max-w-[140px]" title={cust.name}>
                            {cust.name}
                          </h3>
                          {isVip && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-black text-[9px] uppercase tracking-wider">
                              VIP
                            </span>
                          )}
                          {isRepeat && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-black text-[9px] uppercase tracking-wider">
                              Repeat
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Member since {cust.joinedDate || '2026-09-09'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Remove customer record for ${cust.name}?`)) {
                          try {
                            // 1. Remove from registered users
                            const registered = JSON.parse(localStorage.getItem('audio_den_registered_users') || '[]');
                            const updated = registered.filter(u => {
                              if (u.id === cust.id) return false;
                              if (u.email && cust.email && u.email.toLowerCase() === cust.email.toLowerCase()) return false;
                              if (u.phone && cust.phone && u.phone === cust.phone) return false;
                              return true;
                            });
                            localStorage.setItem('audio_den_registered_users', JSON.stringify(updated));

                            // 2. Add to deleted customers list to ensure they don't reappear via orders
                            const deletedList = JSON.parse(localStorage.getItem('audio_den_deleted_customers') || '[]');
                            deletedList.push({ id: cust.id, email: cust.email, phone: cust.phone });
                            localStorage.setItem('audio_den_deleted_customers', JSON.stringify(deletedList));
                          } catch (e) {
                            console.error('Failed to remove customer record completely', e);
                          }
                          // 3. Delete from store (which triggers a re-render and re-evaluates useMemo)
                          deleteCustomer(cust.id);
                        }
                      }}
                      className="p-1 text-gray-300 hover:text-red-600 transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-1.5 text-xs text-gray-600 pt-3 mt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <a
                        href={`mailto:${cust.email}`}
                        className="truncate hover:text-blue-600 hover:underline"
                        title={cust.email}
                      >
                        {cust.email || 'No email provided'}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${cust.phone}`} className="hover:text-emerald-700 font-mono font-semibold">
                        {cust.phone || 'N/A'}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{cust.city || 'Prayagraj, Uttar Pradesh'}</span>
                    </div>
                  </div>

                  {/* Lifetime Spending & Order Totals */}
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-gray-100 mt-3 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Lifetime Orders</span>
                      <span className="font-bold text-slate-900">
                        {cust.actualOrdersCount} {cust.actualOrdersCount === 1 ? 'Order' : 'Orders'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Spent</span>
                      <span className="font-black text-slate-900 text-sm">
                        ₹{cust.actualTotalSpent.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                  {/* WhatsApp */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors border border-emerald-200/80 shadow-2xs"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Call Customer */}
                  <a
                    href={`tel:${cust.phone}`}
                    className="py-2 px-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors border border-blue-200/80 shadow-2xs"
                    title="Call Customer"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call</span>
                  </a>

                  {/* View History & Invoices */}
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="py-2 px-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors shadow-2xs"
                    title="View Orders & Invoices"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Orders ({cust.actualOrdersCount})</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CUSTOMER ORDER HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-base">
                  {selectedCustomer.name[0]}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{selectedCustomer.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedCustomer.phone} • {selectedCustomer.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-gray-400 hover:text-slate-800 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Orders List */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 font-bold">
                <span className="text-slate-700">Order History ({selectedCustomer.orders?.length || 0})</span>
                <span className="text-slate-900 font-black">
                  Total Spent: ₹{selectedCustomer.actualTotalSpent?.toLocaleString('en-IN')}
                </span>
              </div>

              {(!selectedCustomer.orders || selectedCustomer.orders.length === 0) ? (
                <div className="py-8 text-center text-gray-400">
                  No orders recorded yet for this customer profile.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedCustomer.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl border border-gray-200 bg-white space-y-3 shadow-2xs hover:border-amber-300 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-mono font-black text-slate-900 text-sm">#{ord.id}</span>
                          <span className="text-gray-500 ml-2 text-[11px]">• {ord.date}</span>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-slate-900 text-sm block">
                            ₹{(ord.totalAmount || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {ord.status || 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-2.5 rounded-lg bg-gray-50 space-y-1 text-[11px]">
                        {(ord.items || []).map((it, idx) => (
                          <div key={idx} className="flex justify-between text-gray-700">
                            <span>
                              {it.name} <span className="text-gray-400">× {it.quantity || 1}</span>
                            </span>
                            <span className="font-bold">
                              ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span className="text-gray-500 truncate max-w-xs" title={ord.shippingAddress}>
                          📍 {ord.shippingAddress}
                        </span>
                        <button
                          onClick={() => printGstInvoice(ord)}
                          className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold inline-flex items-center gap-1 shadow-2xs"
                        >
                          <span>Print GST Invoice</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD NEW CUSTOMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Add Showroom Customer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Abhishek Mishra"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mobile Number (for WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="e.g. 9839123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="e.g. abhishek@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">City / Area</label>
                <input
                  type="text"
                  value={newCustCity}
                  onChange={(e) => setNewCustCity(e.target.value)}
                  placeholder="Prayagraj"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Address / Notes</label>
                <textarea
                  rows={2}
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="Civil Lines / New Katra address..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-sm"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
