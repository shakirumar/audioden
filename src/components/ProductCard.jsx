import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Check, Zap, MessageCircle, Gift, Sparkles, CreditCard } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useProductStore } from '../store/useProductStore';
import { useState, useMemo } from 'react';
import BrandFinanceModal from './BrandFinanceModal';
import { parseStorageCapacity, extractModelFamily, extractStorageFromText } from '../utils/productUtils';

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
  const { products = [], offers = [] } = useProductStore();
  const [added, setAdded] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  // Available variants calculation (either attached model siblings or from store/variants array)
  const availableVariants = useMemo(() => {
    // 1. Attached model siblings (from model-wise grouping)
    if (product._modelSiblings && Array.isArray(product._modelSiblings) && product._modelSiblings.length > 0) {
      return product._modelSiblings;
    }

    // 2. Embedded variants in the product object
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.map((v, idx) => ({
        ...v,
        id: v.id || `${product.id}-var-${idx}`,
        name: v.name || `${product.name.replace(/\([^)]*\)/g, '').trim()} (${v.variantLabel || v.storage || ''})`,
        variantLabel: v.variantLabel || v.storage || `Option ${idx + 1}`,
        storage: v.storage || v.variantLabel || '',
        price: Number(v.price || product.price),
        salePrice: Number(v.salePrice || v.price || product.salePrice || product.price),
        images: (v.images && v.images.length > 0) ? v.images : product.images
      }));
    }

    // 3. Find matching sibling products in store using smart model family
    const targetModel = extractModelFamily(product).toLowerCase();
    const brand = (product.brand || '').toLowerCase();
    let siblings = (products || []).filter((p) => {
      if ((p.brand || '').toLowerCase() !== brand) return false;
      return extractModelFamily(p).toLowerCase() === targetModel;
    });

    if (siblings.length > 1) {
      const storageMap = new Map();
      siblings.forEach((s) => {
        const stor = s.storage || extractStorageFromText(s.name) || extractStorageFromText(s.sku) || s.variantLabel || '';
        const key = stor || s.id;
        if (!storageMap.has(key) || (s.salePrice || s.price) < (storageMap.get(key).salePrice || storageMap.get(key).price)) {
          storageMap.set(key, { ...s, storage: stor, variantLabel: stor || 'Standard' });
        }
      });

      return Array.from(storageMap.values()).sort((a, b) => {
        const sA = parseStorageCapacity(a.storage || a.variantLabel);
        const sB = parseStorageCapacity(b.storage || b.variantLabel);
        if (sA !== sB && sA > 0 && sB > 0) return sA - sB;
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      });
    }

    // 4. Smartphone storage tier synthesis fallback if single catalog entry
    const isPhone = (product.category || '').toLowerCase() === 'smartphones' || /iphone|galaxy|phone|fold/i.test(product.name);
    const curCap = parseStorageCapacity(product.storage || extractStorageFromText(product.name));
    const baseSale = product.salePrice || product.price;
    const baseMRP = product.price;

    if (isPhone && (curCap || baseSale > 15000)) {
      if (curCap === 64) {
        return [
          { ...product, storage: '64GB', variantLabel: '64GB' },
          { ...product, id: `${product.id}-128`, storage: '128GB', variantLabel: '128GB', price: Math.round(baseMRP * 1.18), salePrice: Math.round(baseSale + 3000) }
        ];
      } else if (curCap === 128 || (!curCap && baseSale < 70000)) {
        return [
          { ...product, storage: '128GB', variantLabel: '128GB' },
          { ...product, id: `${product.id}-256`, storage: '256GB', variantLabel: '256GB', price: Math.round(baseMRP * 1.15), salePrice: Math.round(baseSale + (baseSale > 50000 ? 10000 : 5000)) },
          { ...product, id: `${product.id}-512`, storage: '512GB', variantLabel: '512GB', price: Math.round(baseMRP * 1.35), salePrice: Math.round(baseSale + (baseSale > 50000 ? 25000 : 12000)) }
        ];
      } else if (curCap === 256 || (!curCap && baseSale >= 70000 && baseSale < 140000)) {
        return [
          { ...product, id: `${product.id}-128`, storage: '128GB', variantLabel: '128GB', price: Math.round(baseMRP * 0.9), salePrice: Math.max(1000, Math.round(baseSale - (baseSale > 80000 ? 15000 : 6000))) },
          { ...product, storage: '256GB', variantLabel: '256GB' },
          { ...product, id: `${product.id}-512`, storage: '512GB', variantLabel: '512GB', price: Math.round(baseMRP * 1.15), salePrice: Math.round(baseSale + (baseSale > 80000 ? 20000 : 8000)) }
        ];
      } else if (curCap === 512 || (!curCap && baseSale >= 140000)) {
        return [
          { ...product, id: `${product.id}-256`, storage: '256GB', variantLabel: '256GB', price: Math.round(baseMRP * 0.88), salePrice: Math.max(1000, Math.round(baseSale - (baseSale > 60000 ? 15000 : 8000))) },
          { ...product, storage: '512GB', variantLabel: '512GB' },
          { ...product, id: `${product.id}-1tb`, storage: '1TB', variantLabel: '1TB', price: Math.round(baseMRP * 1.2), salePrice: Math.round(baseSale + (baseSale > 60000 ? 25000 : 14000)) }
        ];
      }
    }

    return [];
  }, [product, products]);

  // Active product combines base product with currently selected variant
  const activeProduct = useMemo(() => {
    if (!selectedVariantId) return product;
    const found = availableVariants.find((v) => v.id === selectedVariantId || v.storage === selectedVariantId);
    if (!found) return product;
    return {
      ...product,
      ...found,
      id: found.id || product.id,
      name: found.name || product.name,
      price: Number(found.price || product.price),
      salePrice: Number(found.salePrice || found.price || product.salePrice || product.price),
      images: (found.images && found.images.length > 0) ? found.images : product.images,
      stock: found.stock !== undefined ? found.stock : product.stock,
      sku: found.sku || product.sku,
      storage: found.storage || product.storage,
      ram: found.ram || product.ram
    };
  }, [product, selectedVariantId, availableVariants]);

  const currentPrice = activeProduct.salePrice || activeProduct.price;
  const originalPrice = activeProduct.price;
  const inWishlist = isInWishlist(activeProduct.id);
  const discountPercent = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const matchedCoupon = (offers || []).find((o) => {
    if (o.active === false || o.enabled === false) return false;
    if (!o.couponCode) return false;
    if (!o.applicableTo || o.applicableTo === 'all') return true;
    if (o.applicableTo === 'brand' && o.applicableValue?.toLowerCase() === activeProduct?.brand?.toLowerCase()) return true;
    if (o.applicableTo === 'category' && o.applicableValue?.toLowerCase() === activeProduct?.category?.toLowerCase()) return true;
    return false;
  });

  const theme = BADGE_THEMES[activeProduct.offerBadgeColor] || BADGE_THEMES.gold;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(activeProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(activeProduct, 1);
    navigate('/checkout');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(activeProduct);
  };

  return (
    <div className={`group relative flex flex-col bg-white border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md ${
      activeProduct.hasOffer ? `${theme.ring} hover:border-amber-500` : 'border-gray-200 hover:border-slate-300'
    }`}>
      
      {/* Product Image Frame */}
      <div className="relative w-full aspect-square bg-white p-4 flex items-center justify-center border-b border-gray-100 overflow-hidden">
        <Link to={`/product/${activeProduct.id}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={activeProduct.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'} 
            alt={activeProduct.name} 
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Badges (Offer, Discount & Flash Sale) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {activeProduct.hasOffer && (
            <span className={`bg-gradient-to-r ${theme.bg} ${theme.text} font-black text-[9px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-1`}>
              <Sparkles className="w-2.5 h-2.5" />
              <span>{activeProduct.offerBadgeText || 'SPECIAL OFFER'}</span>
            </span>
          )}
          {discountPercent > 0 && !activeProduct.hasOffer && (
            <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {activeProduct.isFlashSale && (
            <span className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-white" /> Deal
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full border transition-all z-10 shadow-xs cursor-pointer ${
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
            {activeProduct.brand}
          </span>
          
          {/* Flipkart Emerald Rating Pill */}
          <div className="flex items-center gap-1">
            <span className="bg-emerald-700 text-white font-black text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span>{activeProduct.rating || 4.8}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </span>
            <span className="text-[10px] text-gray-400">
              ({activeProduct.reviewCount || 15})
            </span>
          </div>
        </div>

        {/* Product Title */}
        <Link to={`/product/${activeProduct.id}`} className="block mb-1.5 flex-grow">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {activeProduct.name}
          </h3>
        </Link>

        {/* SPECIAL OFFER RIBBON */}
        {activeProduct.hasOffer && activeProduct.offerTitle && (
          <div className="mb-1.5 p-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-300/80 text-[10px] text-amber-950 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 animate-ping"></span>
            <span className="truncate">{activeProduct.offerTitle}</span>
          </div>
        )}

        {/* FREE GIFT IN BOX TAG */}
        {activeProduct.offerFreebie && (
          <div className="mb-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 truncate">
            <Gift className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{activeProduct.offerFreebie}</span>
          </div>
        )}

        {/* VARIANT BUTTONS (CLICKABLE: DYNAMIC PRICE, STOCK & SELECTION) */}
        {availableVariants.length > 1 && (
          <div className="mb-2 flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            <span className="text-[10px] text-gray-500 font-bold flex-shrink-0">Storage:</span>
            {availableVariants.map((v, i) => {
              const label = v.variantLabel || v.storage || `${v.ram || ''} ${v.storage || ''}`.trim() || `Opt ${i + 1}`;
              const isSelected = selectedVariantId 
                ? (v.id === selectedVariantId || v.storage === selectedVariantId)
                : (v.id === activeProduct.id || v.storage === activeProduct.storage);
              const vPrice = v.salePrice || v.price;

              return (
                <button
                  key={v.id || i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantId(v.id || v.storage);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] flex-shrink-0 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs ring-1 ring-amber-400 font-black scale-105'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 font-bold'
                  }`}
                  title={`${label}: ₹${vPrice?.toLocaleString('en-IN')}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Delivery / Assurance */}
        <div className="mb-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>Free Delivery</span>
          <span className="text-gray-400 text-[10px] ml-auto">Audio Den Assured</span>
        </div>

        {/* Coupon / Highlight Pill */}
        {(activeProduct.couponText || matchedCoupon) && !activeProduct.hasOffer && (
          <div className="mb-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 truncate max-w-full">
            <span className="truncate">
              🏷️ {matchedCoupon 
                ? `Code ${matchedCoupon.couponCode}: ${matchedCoupon.discountPercent ? `${matchedCoupon.discountPercent}% OFF` : `₹${matchedCoupon.discountAmount} OFF`}`
                : activeProduct.couponText}
            </span>
          </div>
        )}

        {/* Pricing Block */}
        <div className="pt-2 border-t border-gray-100 mt-auto space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {originalPrice > currentPrice && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {discountPercent}% off
                </span>
              </>
            )}
          </div>

          {/* Brand Finance Available Pill */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFinanceOpen(true);
            }}
            className="w-full text-left p-1.5 rounded-lg bg-gradient-to-r from-blue-50/90 via-amber-50/70 to-blue-50/90 hover:from-blue-100 hover:to-amber-100 border border-blue-200 text-[10px] text-slate-900 font-bold flex items-center justify-between transition-all cursor-pointer group/fin shadow-2xs"
            title="Click to view 0% Brand Finance & EMI Schemes"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <CreditCard className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <span className="truncate text-slate-900 font-black">0% EMI</span>
            </div>
            <span className="text-blue-900 font-black flex-shrink-0 group-hover/fin:underline text-[9px] bg-white/95 px-1.5 py-0.5 rounded border border-blue-200">
              ₹{Math.round(currentPrice / 12).toLocaleString('en-IN')}/mo (₹{Math.round(currentPrice / 365).toLocaleString('en-IN')}/day) →
            </span>
          </button>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleAddToCart}
              className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
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
              className="py-1.5 px-2 rounded-lg font-bold text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
            >
              Buy Now
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <a
            href={`https://wa.me/919935102727?text=${encodeURIComponent(
              `Hello Audio Den, I would like to order: ${activeProduct.name} (Price: ₹${currentPrice.toLocaleString('en-IN')}). Please confirm stock & delivery at Prayagraj.`
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
        product={activeProduct}
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
      />
    </div>
  );
}
