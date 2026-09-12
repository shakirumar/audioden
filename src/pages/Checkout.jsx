import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, CheckCircle2, CreditCard, Banknote, Truck, ArrowLeft, 
  MessageCircle, Mail, Printer, ExternalLink, Send, Check, Lock, UserCheck, AlertCircle, ArrowRight
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useProductStore } from '../store/useProductStore';
import { useAuthStore } from '../store/useAuthStore';
import { PaymentService } from '../services/api';
import { 
  getOwnerWhatsAppUrl, 
  getCustomerWhatsAppUrl, 
  formatClientEmail, 
  formatOwnerEmail, 
  dispatchOrderNotifications, 
  printGstInvoice,
  STORE_CONFIG 
} from '../services/notificationService';

export default function Checkout() {
  const { items, getTotals, clearCart } = useCartStore();
  const { createOrder } = useProductStore();
  const { user, isAuthenticated, login, register: authRegister, loginAsDemoCustomer, addAddress } = useAuthStore();
  const { subtotal, discount, grandTotal } = getTotals();

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'razorpay', 'whatsapp'
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [notificationDispatched, setNotificationDispatched] = useState(false);

  // Inline Auth State for unauthenticated users
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const {
    register,
    handleSubmit,
    setValue
  } = useForm({
    defaultValues: {
      fullName: defaultAddress?.name || user?.name || '',
      email: user?.email || '',
      phone: defaultAddress?.phone || user?.phone || '',
      address: defaultAddress?.address || '',
      landmark: defaultAddress?.landmark || '',
      city: defaultAddress?.city || 'Prayagraj',
      state: defaultAddress?.state || 'Uttar Pradesh',
      pincode: defaultAddress?.pincode || '211002'
    }
  });

  // Keep form values in sync when user logs in
  useEffect(() => {
    if (user) {
      if (user.name) setValue('fullName', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
      if (defaultAddress) {
        if (defaultAddress.address) setValue('address', defaultAddress.address);
        if (defaultAddress.landmark) setValue('landmark', defaultAddress.landmark);
        if (defaultAddress.city) setValue('city', defaultAddress.city);
        if (defaultAddress.state) setValue('state', defaultAddress.state);
        if (defaultAddress.pincode) setValue('pincode', defaultAddress.pincode);
      }
    }
  }, [user, defaultAddress, setValue]);

  // Handle Inline Auth
  const handleInlineLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const res = login(authEmail, authPass);
    if (!res.success) {
      setAuthError(res.message);
    }
  };

  const handleInlineRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authName.trim() || !authEmail.trim() || !authPass) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    const res = authRegister({
      name: authName.trim(),
      email: authEmail.trim(),
      phone: authPhone.trim() || '9935102727',
      password: authPass
    });
    if (!res.success) {
      setAuthError(res.message);
    }
  };

  // Automatically trigger WhatsApp notification popup when order is placed
  useEffect(() => {
    if (completedOrder) {
      const timer = setTimeout(() => {
        try {
          const ownerWa = getOwnerWhatsAppUrl(completedOrder);
          window.open(ownerWa, '_blank');
        } catch (e) {
          console.debug('Auto-open WhatsApp caught:', e);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [completedOrder]);

  const onSubmit = async (data) => {
    if (items.length === 0) return;

    // Guard: Client must be logged in to book an order
    if (!isAuthenticated || !user) {
      alert('Authentication required: Please sign in or create an account to book your order.');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'razorpay') {
        await PaymentService.createRazorpayOrder(grandTotal);
      }

      addAddress({
        name: data.fullName,
        phone: data.phone,
        address: data.address,
        landmark: data.landmark,
        city: data.city,
        state: data.state,
        pincode: data.pincode
      });

      const formattedItems = items.map((it) => ({
        id: it.id,
        productId: it.id,
        name: it.name,
        price: it.salePrice || it.price,
        quantity: it.quantity,
        image: it.image || '/products/apple-iphone16-black.png',
        brand: it.brand,
        specs: it.specifications ? Object.values(it.specifications).slice(0, 2).join(' • ') : ''
      }));

      // oxlint-disable react/purity
      const randomAwb = `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`;
      const randomInv = `AD-INV-2026-${Date.now().toString().slice(-5)}`;

      const orderPayload = {
        customerName: data.fullName,
        customerEmail: data.email || user.email,
        customerPhone: data.phone || user.phone,
        shippingAddress: `${data.address}, ${data.landmark ? data.landmark + ', ' : ''}${data.city}, ${data.state} - ${data.pincode}`,
        items: formattedItems,
        totalAmount: grandTotal,
        paymentMethod:
          paymentMethod === 'cod'
            ? 'Cash on Delivery'
            : paymentMethod === 'whatsapp'
            ? 'WhatsApp Order / COD'
            : 'Online Payment (Razorpay/UPI)',
        paymentStatus: paymentMethod === 'razorpay' ? 'Paid' : 'Pending COD',
        courier: 'Blue Dart Express',
        trackingNumber: randomAwb,
        invoiceNumber: randomInv,
        timeline: [
          { title: 'Order Confirmed', date: 'Just now', desc: 'Order verified & allocated at Audio Den showroom', completed: true },
          { title: 'Packing in Progress', date: 'Today', desc: 'Dispatched from Prayagraj Hub', completed: false },
          { title: 'Shipped via Blue Dart', date: 'Upcoming', desc: `AWB: ${randomAwb}`, completed: false },
          { title: 'Delivered', date: 'Expected in 24-48 hrs', desc: 'Doorstep verification & handover', completed: false }
        ]
      };

      const placed = createOrder(orderPayload);
      clearCart();
      setCompletedOrder(placed);

      // Automated notification dispatch to client email and owner email
      await dispatchOrderNotifications(placed);
      setNotificationDispatched(true);

      // If user selected WhatsApp payment method or WhatsApp checkout, open WhatsApp directly
      if (paymentMethod === 'whatsapp') {
        const waUrl = getOwnerWhatsAppUrl(placed);
        window.open(waUrl, '_blank');
      }
    } catch (e) {
      console.error('Order creation error', e);
    } finally {
      setIsProcessing(false);
    }
  };

  // ================= ORDER BOOKED SUCCESS SCREEN =================
  if (completedOrder) {
    const clientEmailData = formatClientEmail(completedOrder);
    const ownerEmailData = formatOwnerEmail(completedOrder);
    const ownerWhatsAppUrl = getOwnerWhatsAppUrl(completedOrder);
    const customerWhatsAppUrl = getCustomerWhatsAppUrl(completedOrder);

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Success Header Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* Title & Subtitle Requested: "Order Booked Successfully!" */}
        <div>
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-wider border border-emerald-200 inline-block mb-2 shadow-2xs">
            Verified & Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
            Order Booked Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Order ID: <span className="font-mono font-bold text-slate-900">#{completedOrder.id}</span> • Invoice: <span className="font-mono font-bold text-slate-700">{completedOrder.invoiceNumber}</span>
          </p>
          <p className="text-xs text-emerald-700 font-bold mt-1">
            Your booking is confirmed! Official details have been dispatched to Store Owner & Client.
          </p>
        </div>

        {/* NOTIFICATIONS SENT STATUS CARD (Client Email, Client WhatsApp, Owner Email, Owner WhatsApp) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-blue-500/10 border-2 border-amber-400/40 text-left space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                Instant Multi-Channel Order Dispatch
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              {notificationDispatched ? 'All Channels Dispatched' : 'Active Channel Dispatch'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Client Email */}
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 space-y-2 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 text-blue-600 text-xs font-black">
                  <Mail className="w-4 h-4" /> Client Email
                </div>
                <div className="text-[11px] text-gray-600 mt-1 truncate" title={completedOrder.customerEmail}>
                  To: <strong>{completedOrder.customerEmail}</strong>
                </div>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" /> Confirmation Sent
                </div>
              </div>
              <a
                href={clientEmailData.mailtoUrl}
                className="w-full py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                title="Open email in your email app"
              >
                <span>Open in Mail</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 2. Client WhatsApp */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-black">
                  <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" /> Client WhatsApp
                </div>
                <div className="text-[11px] text-gray-600 mt-1 truncate">
                  To: <strong>+91 {completedOrder.customerPhone}</strong>
                </div>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" /> Formatted & Ready
                </div>
              </div>
              <a
                href={customerWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors border border-emerald-200"
                title="Send notification copy to customer WhatsApp"
              >
                <span>My WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 3. Owner Email */}
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 space-y-2 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 text-purple-600 text-xs font-black">
                  <Send className="w-4 h-4" /> Owner Email
                </div>
                <div className="text-[11px] text-gray-600 mt-1 truncate" title={STORE_CONFIG.ownerEmail}>
                  To: <strong>{STORE_CONFIG.ownerEmail}</strong>
                </div>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" /> Order Dispatched
                </div>
              </div>
              <a
                href={ownerEmailData.mailtoUrl}
                className="w-full py-1.5 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                title="Send notification copy to owner"
              >
                <span>Notify Owner</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 4. Owner WhatsApp */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-black">
                  <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" /> Owner WhatsApp
                </div>
                <div className="text-[11px] text-gray-600 mt-1">
                  To: <strong>+91 {STORE_CONFIG.ownerPhone}</strong>
                </div>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" /> Sent to Showroom
                </div>
              </div>
              <a
                href={ownerWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors shadow-2xs"
                title="Open WhatsApp chat with Audio Den showroom owner"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Send to Owner</span>
              </a>
            </div>
          </div>
        </div>

        {/* ORDER DETAILS & SUMMARY */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 text-left space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-xs">
            <span className="text-gray-500">Total Payable Amount:</span>
            <span className="font-black text-lg text-slate-900">₹{completedOrder.totalAmount?.toLocaleString('en-IN')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500 block">Payment Mode:</span>
              <span className="font-bold text-slate-800">{completedOrder.paymentMethod}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Blue Dart Tracking AWB:</span>
              <span className="font-mono font-bold text-slate-800">{completedOrder.trackingNumber}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-500 block">Delivery Address:</span>
              <span className="font-semibold text-slate-900">{completedOrder.shippingAddress}</span>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Booked Products:</div>
            <div className="space-y-2">
              {(completedOrder.items || []).map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                  <div className="font-semibold text-slate-900">
                    {it.name} <span className="text-gray-500 font-normal">× {it.quantity}</span>
                  </div>
                  <div className="font-black text-slate-900">
                    ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Estimated delivery across Prayagraj within 24-48 hours. Audio Den showroom team will verify before dispatch.</span>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          {/* Send to Audio Den WhatsApp (Owner) */}
          <a
            href={ownerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md hover:shadow-lg inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Send Order to Audio Den WhatsApp (+91 9935102727)</span>
          </a>

          {/* Print / Download GST Tax Invoice */}
          <button
            onClick={() => printGstInvoice(completedOrder)}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-sm inline-flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save GST Invoice</span>
          </button>

          {/* Share with Customer WhatsApp */}
          <a
            href={customerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs inline-flex items-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Copy to My WhatsApp</span>
          </a>

          <Link
            to="/account?tab=orders"
            className="px-5 py-3 rounded-xl bg-white border border-gray-300 text-slate-800 font-bold text-xs hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Track in My Account
          </Link>

          <Link
            to="/"
            className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // ================= AUTHENTICATION REQUIRED GUARD =================
  // If user is not logged in, enforce: "Without login cannot book any order"
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-heading font-black text-slate-900">Secure Checkout</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Client login is required to book orders and generate your GST Invoice
            </p>
          </div>
          <Link to="/cart" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
        </div>

        {/* Auth Required Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 shadow-xs">
          <Lock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-black text-amber-900 text-sm">
              Please Sign In or Register to Book Your Order
            </h3>
            <p className="text-amber-800">
              For order verification, automated WhatsApp dispatch, and doorstep Prayagraj warranty tracking, please sign in to your Audio Den account. Your cart items are saved and ready!
            </p>
          </div>
        </div>

        {/* 2-Column: Left Auth Card (Sign In / Register) & Right Cart Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Login / Register Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            
            {/* Tab switch */}
            <div className="flex border-b border-gray-200 pb-2 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                className={`pb-2 transition-colors relative ${
                  authTab === 'login' ? 'text-amber-600 border-b-2 border-amber-500 font-black' : 'text-gray-500 hover:text-slate-800'
                }`}
              >
                Sign In to Existing Account
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setAuthError(''); }}
                className={`pb-2 transition-colors relative ${
                  authTab === 'register' ? 'text-amber-600 border-b-2 border-amber-500 font-black' : 'text-gray-500 hover:text-slate-800'
                }`}
              >
                Create New Account
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {authTab === 'login' && (
              <form onSubmit={handleInlineLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. rohit.verma26@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In & Continue to Book</span>
                </button>
              </form>
            )}

            {/* TAB 2: CREATE ACCOUNT */}
            {authTab === 'register' && (
              <form onSubmit={handleInlineRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Rohit Verma"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. rohit.verma26@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="e.g. 9839123456"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    placeholder="At least 4 characters"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Register & Continue to Book</span>
                </button>
              </form>
            )}

            {/* Quick Demo Customer 1-Click Login for immediate test */}
            <div className="pt-3 border-t border-gray-100 text-center space-y-2">
              <span className="text-[11px] text-gray-400 font-medium block">Quick Instant Testing:</span>
              <button
                type="button"
                onClick={() => loginAsDemoCustomer()}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 font-bold text-xs border border-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>One-Click Customer Login (Rohit Verma)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right: Cart Summary Box (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-100">
              Order Summary ({items.length} Items)
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <img
                    src={it.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=100&q=80'}
                    alt=""
                    className="w-10 h-10 object-contain rounded p-0.5 border border-gray-100"
                  />
                  <div className="flex-grow min-w-0">
                    <h5 className="font-bold text-slate-900 truncate">{it.name}</h5>
                    <span className="text-[11px] text-gray-500">Qty: {it.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{((it.salePrice || it.price) * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-bold text-emerald-700">FREE (Prayagraj)</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Audio Den Buyer Protection</span>
              </div>
              <p>Official India manufacturer warranty, GST invoice, and express delivery in Prayagraj.</p>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // ================= LOGGED-IN CUSTOMER CHECKOUT FORM =================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-heading font-black text-slate-900">Secure Checkout & Booking</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Booked for: <span className="font-bold text-slate-900">{user?.name}</span> ({user?.email})
          </p>
        </div>
        <Link to="/cart" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ADDRESS & PAYMENT DETAILS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Delivery Address Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                  Delivery Address & Contact
                </h3>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Logged In Client
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  {...register('fullName', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Mobile Number (for WhatsApp) *</label>
                <input
                  type="tel"
                  {...register('phone', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-bold mb-1">Email Address (for GST Invoice & Updates) *</label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-bold mb-1">Flat / House No. / Street Address *</label>
                <input
                  type="text"
                  {...register('address', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  {...register('landmark')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">City *</label>
                <input
                  type="text"
                  {...register('city', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">State *</label>
                <input
                  type="text"
                  {...register('state', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Pincode *</label>
                <input
                  type="text"
                  maxLength={6}
                  {...register('pincode', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                Select Payment Option
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {/* Cash on Delivery */}
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                paymentMethod === 'cod' ? 'border-amber-500 bg-amber-50/50' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-amber-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" /> Cash on Delivery (COD)
                  </span>
                  <span className="text-gray-500 text-[11px]">Pay conveniently in cash or UPI when your item arrives at your doorstep in Prayagraj.</span>
                </div>
              </label>

              {/* Online Payment / UPI / Cards */}
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                paymentMethod === 'razorpay' ? 'border-amber-500 bg-amber-50/50' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="mt-1 accent-amber-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" /> Online Payment (UPI, Credit/Debit Card, Net Banking)
                  </span>
                  <span className="text-gray-500 text-[11px]">Instant and 100% encrypted checkout with instant order confirmation.</span>
                </div>
              </label>

              {/* WhatsApp Direct Order & COD */}
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                paymentMethod === 'whatsapp' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="whatsapp"
                  checked={paymentMethod === 'whatsapp'}
                  onChange={() => setPaymentMethod('whatsapp')}
                  className="mt-1 accent-emerald-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" /> Order on WhatsApp (Direct Showroom Booking)
                  </span>
                  <span className="text-gray-500 text-[11px]">Direct showroom confirmation with official Audio Den invoice sent to your WhatsApp.</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY & PLACE ORDER (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-100">
              Order Summary ({items.length} Items)
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-xs">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <img
                    src={it.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=100&q=80'}
                    alt=""
                    className="w-10 h-10 object-contain rounded p-0.5 border border-gray-100"
                  />
                  <div className="flex-grow min-w-0">
                    <h5 className="font-bold text-slate-900 truncate">{it.name}</h5>
                    <span className="text-[11px] text-gray-500">Qty: {it.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{((it.salePrice || it.price) * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-bold text-emerald-700">FREE (Prayagraj)</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isProcessing || items.length === 0}
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing Booking...' : `Confirm & Book Order (₹${grandTotal.toLocaleString('en-IN')})`}
            </button>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-gray-200 flex items-center gap-2 text-[11px] text-gray-500 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>256-Bit SSL Encrypted. Audio Den Showroom Guaranteed.</span>
          </div>

        </div>

      </form>

    </div>
  );
}
