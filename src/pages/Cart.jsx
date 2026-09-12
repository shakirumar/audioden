import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, ArrowLeft, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, applyCoupon, getTotals } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  const { subtotal, discount, grandTotal, itemCount } = getTotals();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res.message);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleQuickCoupon = (code) => {
    const res = applyCoupon(code);
    setCouponFeedback(res.message);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
          Explore our collection of flagship smartphones, 4K Smart TVs, luxury sound systems, and home appliances.
        </p>
        <Link to="/shop" className="px-6 py-3 bg-slate-900 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-lg inline-flex items-center gap-2 shadow-sm">
          Shop Trending Deals <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-heading font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            You have <span className="font-bold text-slate-900">{itemCount} items</span> in your shopping bag.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={clearCart}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear Entire Bag
          </button>
          <Link
            to="/shop"
            className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>
      </div>

      {/* 2-Column Cart Layout (Flipkart / Amazon Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ITEMS LIST (8 COLS) */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=150&q=80'}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg p-1 bg-white border border-gray-100"
                  />
                </Link>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.brand}</span>
                  <Link to={`/product/${item.id}`}>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 line-clamp-2">
                      {item.name}
                    </h4>
                  </Link>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Remove */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-gray-600 hover:text-slate-900 hover:bg-gray-100 rounded-l-lg transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-gray-600 hover:text-slate-900 hover:bg-gray-100 rounded-r-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-gray-400 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}

          {/* Secure Guarantee Strip */}
          <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center gap-3 text-xs text-gray-500 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Safe and Secure Payments. 100% Authentic products guaranteed with official GST invoice.</span>
          </div>
        </div>

        {/* RIGHT COLUMN: FLIPKART STYLE PRICE SUMMARY (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Price Breakdown Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-100">
              Price Details ({itemCount} Items)
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Total MRP</span>
                <span className="font-semibold text-slate-900">₹{(subtotal + discount).toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount on MRP</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <p className="text-[11px] text-emerald-700 font-bold pt-1">
                  You will save ₹{discount.toLocaleString('en-IN')} on this order!
                </p>
              )}
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Place Order (Online / COD)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/919935102727?text=${encodeURIComponent(
                `*AUDIO DEN - QUICK CART ORDER*\n\nHello Audio Den, I would like to order my cart items:\n${items
                  .map(
                    (it, idx) =>
                      `${idx + 1}. ${it.name} (Qty: ${it.quantity}) - ₹${(
                        it.price * it.quantity
                      ).toLocaleString('en-IN')}`
                  )
                  .join('\n')}\n\n*Total Amount:* ₹${grandTotal.toLocaleString(
                  'en-IN'
                )}\n\nPlease confirm my order and deliver to my address in Prayagraj!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Fast Order on WhatsApp</span>
            </a>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-500" /> Apply Promo Code
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="e.g. AUDIODEN10"
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg flex-shrink-0"
              >
                Apply
              </button>
            </form>
            {couponFeedback && (
              <p className="text-[11px] text-blue-600 font-medium">{couponFeedback}</p>
            )}
            <div className="flex items-center gap-2 pt-1 text-[10px] text-gray-500">
              <span>Quick Codes:</span>
              <button
                onClick={() => handleQuickCoupon('WELCOME10')}
                className="px-2 py-0.5 rounded bg-gray-100 hover:bg-amber-100 font-mono font-bold text-slate-800"
              >
                WELCOME10
              </button>
              <button
                onClick={() => handleQuickCoupon('AUDIODEN5')}
                className="px-2 py-0.5 rounded bg-gray-100 hover:bg-amber-100 font-mono font-bold text-slate-800"
              >
                AUDIODEN5
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
