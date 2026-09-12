import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Check, Zap, MessageCircle, Gift, Sparkles, CreditCard } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useState } from 'react';
import BrandFinanceModal from './BrandFinanceModal';

const BADGE_THEMES = {
  gold: { bg: 'from-amber-500 to-orange-500', text: 'text-slate-950', ring: 'border-amber-400' },
  flame: { bg: 'from-rose-600 to-red-600', text: 'text-white', ring: 'border-rose-400' },
  cyan: { bg: 'from-cyan-500 to-blue-600', text: 'text-white', ring: 'border-cyan-400' },
  emerald: { bg: 'from-emerald-500 to-teal-600', text: 'text-white', ring: 'border-emerald-400' },
  purple: { bg: 'from-purple-600 to-indigo-600', text: 'text-white', ring: 'border-purple-400' }
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const [added, setAdded] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.price > product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const theme = BADGE_THEMES[product.offerBadgeColor] || BADGE_THEMES.gold;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    navigate('/checkout');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className={`group relative flex flex-col bg-white border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md ${
      product.hasOffer ? `${theme.ring} hover:border-amber-500` : 'border-gray-200 hover:border-slate-300'
    }`}>
      
      {/* Product Image Frame */}
      <div className="relative w-full aspect-square bg-white p-4 flex items-center justify-center border-b border-gray-100 overflow-hidden">
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Badges (Offer, Discount & Flash Sale) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.hasOffer && (
            <span className={`bg-gradient-to-r ${theme.bg} ${theme.text} font-black text-[9px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-1`}>
              <Sparkles className="w-2.5 h-2.5" />
              <span>{product.offerBadgeText || 'SPECIAL OFFER'}</span>
            </span>
          )}
          {discountPercent > 0 && !product.hasOffer && (
            <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-white" /> Deal
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full border transition-all z-10 shadow-xs ${
            inWishlist 
              ? 'bg-red-50 border-red-200 text-red-500' 
              : 'bg-white/90 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow p-4">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
            {product.brand}
          </span>
          
          {/* Flipkart Emerald Rating Pill */}
          <div className="flex items-center gap-1">
            <span className="bg-emerald-700 text-white font-black text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span>{product.rating || 4.5}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </span>
            <span className="text-[10px] text-gray-400">
              ({product.reviewCount || 15})
            </span>
          </div>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="block mb-1.5 flex-grow">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* SPECIAL OFFER RIBBON */}
        {product.hasOffer && product.offerTitle && (
          <div className="mb-1.5 p-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-300/80 text-[10px] text-amber-950 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 animate-ping"></span>
            <span className="truncate">{product.offerTitle}</span>
          </div>
        )}

        {/* FREE GIFT IN BOX TAG */}
        {product.offerFreebie && (
          <div className="mb-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 truncate">
            <Gift className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{product.offerFreebie}</span>
          </div>
        )}

        {/* Delivery / Assurance */}
        <div className="mb-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>Free Delivery</span>
          <span className="text-gray-400 text-[10px] ml-auto">Audio Den Assured</span>
        </div>

        {/* Coupon / Highlight Pill */}
        {product.couponText && !product.hasOffer && (
          <div className="mb-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
            <span>🏷️ {product.couponText}</span>
          </div>
        )}

        {/* Pricing Block */}
        <div className="pt-2 border-t border-gray-100 mt-auto space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
            </span>
            {product.price > product.salePrice && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {discountPercent}% off
                </span>
              </>
            )}
          </div>

          {/* Brand Finance Available Pill (Zero Down Payment • 0% Interest) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFinanceOpen(true);
            }}
            className="w-full text-left p-1.5 rounded-lg bg-gradient-to-r from-emerald-50 via-amber-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 border border-emerald-300 text-[10px] text-slate-900 font-bold flex items-center justify-between transition-all cursor-pointer group/fin shadow-2xs"
            title="Click to view Zero Down Payment & 0% EMI Schemes"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
              <span className="truncate text-emerald-950 font-black">Zero Down • 0% EMI</span>
            </div>
            <span className="text-blue-800 font-black flex-shrink-0 group-hover/fin:underline text-[9.5px] bg-white/90 px-1.5 py-0.5 rounded border border-blue-200/80">
              ₹{Math.round((product.salePrice || product.price) / 12).toLocaleString('en-IN')}/mo →
            </span>
          </button>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleAddToCart}
              className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 border transition-colors ${
                added
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-slate-900'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="py-1.5 px-2 rounded-lg font-bold text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 flex items-center justify-center transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <a
            href={`https://wa.me/919935102727?text=${encodeURIComponent(
              `Hello Audio Den, I would like to order: ${product.name} (Price: ₹${(product.salePrice || product.price).toLocaleString('en-IN')}). Please confirm stock & delivery at Prayagraj.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-1.5 px-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Brand Finance & EMI Modal */}
      <BrandFinanceModal
        product={product}
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
      />
    </div>
  );
}
