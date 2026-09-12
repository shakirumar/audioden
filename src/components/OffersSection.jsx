import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Flame, Tag, Check, Copy, ArrowRight, MessageCircle
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import ProductCard from './ProductCard';

export default function OffersSection() {
  const { products, offers = [] } = useProductStore();
  const [copiedCode, setCopiedCode] = useState(null);

  // Active promotional coupons
  const activeOffers = offers.filter((o) => o.enabled !== false);

  // Products with active special offers
  const offerProducts = products.filter((p) => p.hasOffer || p.isFlashSale || p.couponText);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-gradient-to-b from-amber-500/10 via-white to-orange-500/5 border-2 border-amber-400/40 shadow-sm space-y-6">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-orange-400/20 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header with Glowing Flame & Sparkles */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase tracking-wider shadow-xs mb-2">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>Special Showroom Offers & Deals</span>
            <Sparkles className="w-3 h-3 text-amber-200" />
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Exclusive Deals & Discount Highlights
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Official authorized showroom discounts, coupon codes, and bundle offers across Prayagraj.
          </p>
        </div>

        <Link
          to="/shop?filter=offers"
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs inline-flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02]"
        >
          <span>Explore All Offers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 1. INTERACTIVE COUPON CODE CARDS */}
      {activeOffers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" /> Active Store Coupons:
            </span>
            <span className="text-gray-400 text-[11px]">Click code to copy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeOffers.map((offer) => {
              const isCopied = copiedCode === offer.couponCode;
              return (
                <div
                  key={offer.id}
                  className="relative p-3.5 rounded-xl bg-white border-2 border-dashed border-amber-300 hover:border-amber-500 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {offer.discountPercent}% OFF
                      </span>
                      <h4 className="font-heading font-bold text-xs text-slate-900 mt-1.5 leading-snug">
                        {offer.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 line-clamp-2">
                    {offer.description}
                  </p>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-xs text-slate-900 tracking-wider bg-slate-100 px-2 py-1 rounded">
                      {offer.couponCode}
                    </span>

                    <button
                      onClick={() => handleCopyCode(offer.couponCode)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                      }`}
                      title="Copy coupon code"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. HIGHLIGHTED OFFER PRODUCTS SHOWCASE */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <h3 className="font-black text-sm sm:text-base text-slate-900">
              Featured Products with Special Offers
            </h3>
          </div>
          <span className="text-xs text-gray-500">
            {offerProducts.length} deals available right now
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {offerProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 3. FESTIVAL SHOWROOM VALUE CALLOUT BANNER */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 font-black text-lg">
            🎁
          </div>
          <div>
            <h4 className="font-heading font-black text-sm text-amber-400">
              Old Phone or TV Exchange Bonus at Audio Den
            </h4>
            <p className="text-xs text-gray-300">
              Bring any working phone or television to our showroom in New Katra for up to ₹7,000 additional exchange discount!
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/919935102727?text=Hello%20Audio%20Den,%20I%20want%20to%20know%20more%20about%20the%20Special%20Exchange%20Bonus%20and%20Festive%20Offers!"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition-colors shadow-xs"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>

    </section>
  );
}
