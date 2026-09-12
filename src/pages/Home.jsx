import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, ShieldCheck, Truck, 
  ArrowRight, Flame, MapPin, 
  Phone, Clock, Award, CheckCircle2, Sparkles, Tag, MessageCircle,
  CreditCard, Layers, Zap
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/ProductCard';
import OffersSection from '../components/OffersSection';

export default function Home() {
  const { products, categories, brands, banners } = useProductStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Active banners
  const activeBanners = banners.filter((b) => b.enabled !== false);

  // Multi-product brand slider ref
  const brandSliderRef = useRef(null);

  // Hero Slider Auto-advance
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Flash sale timer countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 15 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Dynamic New Arrivals (Guaranteed to show newly added products from Admin)
  const newArrivals = products
    .filter((p) => p.isNewArrival || p.id.startsWith('prod-'))
    .slice(0, 8);
  const displayedNewArrivals = newArrivals.length > 0 ? newArrivals : products.slice(0, 8);

  // 2. Dynamic Unique Brands derived from products + brands list
  const availableBrandNames = Array.from(
    new Set([
      'all',
      ...(brands || []).map((b) => b?.name).filter(Boolean),
      ...(products || []).map((p) => p?.brand).filter(Boolean)
    ])
  );

  const [activeBrandFilter, setActiveBrandFilter] = useState('all');

  const displayedSliderProducts = activeBrandFilter === 'all'
    ? products.slice(0, 12)
    : products.filter((p) => p.brand?.toLowerCase() === activeBrandFilter.toLowerCase());

  const scrollBrandSlider = (direction) => {
    if (brandSliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      brandSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 3. Dynamic Category Tabs for Electronics Showcase
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const departmentProducts = activeCategoryTab === 'All'
    ? products.slice(0, 8)
    : products.filter((p) => p.category?.toLowerCase() === activeCategoryTab.toLowerCase()).slice(0, 8);

  const flashSaleProducts = products.filter((p) => p.isFlashSale).slice(0, 4);

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. HERO SLIDER SECTION */}
      <section className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
        
        {/* Brand Jump Tab Bar on Top of Slider */}
        <div className="hidden sm:flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-gray-200 text-xs overflow-x-auto gap-2">
          <span className="font-black text-slate-500 uppercase text-[10px] tracking-wider whitespace-nowrap pl-2">
            Featured Models:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {activeBanners.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => setCurrentSlide(idx)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  currentSlide === idx
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span>{b.brand} {b.subtitle?.split(' ').slice(1, 3).join(' ')}</span>
                {currentSlide === idx && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center">
          <AnimatePresence mode="wait">
            {activeBanners.map((banner, index) => {
              if (index !== currentSlide) return null;
              return (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className={`w-full min-h-[480px] lg:min-h-[460px] flex items-center ${
                    banner.bgGradient || 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70'
                  }`}
                >
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-16 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
                    
                    {/* Left Banner Content */}
                    <div className="lg:col-span-7 space-y-3 z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-2xs border border-gray-200 text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{banner.title || 'Featured Deal'}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-amber-700 font-bold">{banner.brand}</span>
                      </div>

                      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 leading-tight">
                        {banner.subtitle}
                      </h1>

                      <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-lg leading-relaxed font-medium">
                        {banner.tagline}
                      </p>

                      <div className="flex items-center gap-2 sm:gap-3 pt-1 flex-wrap">
                        {banner.priceText && (
                          <span className="text-xl sm:text-2xl font-black text-slate-900">
                            {banner.priceText}
                          </span>
                        )}
                        {banner.mrpText && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            {banner.mrpText}
                          </span>
                        )}
                        {banner.couponText && (
                          <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px] sm:text-[11px] shadow-xs inline-flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {banner.couponText}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px] sm:text-[11px]">
                          💳 0% Brand Finance
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] sm:text-[11px]">
                          Prayagraj Express Delivery
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 items-center">
                        <Link
                          to={banner.link || '/shop'}
                          className="col-span-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center gap-1.5 sm:gap-2 shadow-md transition-all text-center"
                        >
                          <span className="truncate">{banner.buttonText || 'Shop Model'}</span>
                          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                        </Link>

                        <a
                          href={`https://wa.me/919935102727?text=${encodeURIComponent(
                            `Hello Audio Den, I would like to order ${banner.subtitle} (${banner.priceText || ''}). Please confirm showroom availability and doorstep delivery at Prayagraj.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="col-span-1 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center gap-1.5 sm:gap-2 shadow-md transition-all text-center"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white flex-shrink-0" />
                          <span className="truncate">WhatsApp</span>
                        </a>

                        <Link
                          to={`/shop?brand=${banner.brand}`}
                          className="col-span-2 sm:col-span-1 px-4 py-2 sm:py-3 rounded-xl bg-white hover:bg-gray-50 text-slate-800 font-bold text-xs sm:text-sm border border-gray-300 shadow-2xs transition-colors inline-flex items-center justify-center gap-1.5 text-center"
                        >
                          All {banner.brand} Models
                        </Link>
                      </div>
                    </div>

                    {/* Right Banner Image */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end pb-8 sm:pb-0">
                      <div className="relative w-48 h-48 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-2xl bg-white p-4 sm:p-5 border border-white shadow-lg sm:shadow-xl flex items-center justify-center">
                        <img
                          src={banner.image}
                          alt={banner.subtitle}
                          className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-500 hover:scale-105"
                        />
                        <span className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                          {banner.brand || 'Flagship'}
                        </span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Desktop Controls */}
          {activeBanners.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 hover:bg-white text-slate-900 shadow-lg border border-gray-200 transition-all hover:scale-105"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % activeBanners.length)}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 hover:bg-white text-slate-900 shadow-lg border border-gray-200 transition-all hover:scale-105"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-gray-200 shadow-xs">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
                  className="md:hidden p-1 rounded-full text-slate-700 hover:bg-gray-100"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex gap-1.5 items-center">
                  {activeBanners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === currentSlide ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % activeBanners.length)}
                  className="md:hidden p-1 rounded-full text-slate-700 hover:bg-gray-100"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. EXCLUSIVE SHOWROOM OFFERS & DEALS SECTION */}
      <OffersSection />

      {/* 3. BRAND FINANCE & NO COST EMI SHOWCASE BANNER */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white border border-blue-900/50 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5" />
              All Brand Finance Available
            </div>
            <h2 className="text-xl sm:text-3xl font-heading font-black">
              Take Any Flagship Home with 0% Interest & Easy EMI
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Audio Den is an authorized showroom partner for <strong>Bajaj Finserv, HDFC Bank EasyEMI, IDFC FIRST Bank, Samsung Finance+, and Apple Financial Services</strong>. Get instant 5-minute approval with just your Aadhaar and PAN Card!
            </p>
            
            {/* Provider Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 font-bold">
                ✓ Bajaj Finserv (No Cost EMI)
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 font-bold">
                ✓ HDFC Bank (Cardless & Credit)
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 font-bold">
                ✓ IDFC FIRST Bank (Zero Paperwork)
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 font-bold">
                ✓ Samsung Finance+ / Apple EMI
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-xs space-y-3 text-center">
            <h4 className="font-bold text-amber-400 text-sm">Need Showroom Finance Assistance?</h4>
            <p className="text-xs text-gray-300">
              Check your pre-approved loan limit with our New Katra showroom desk right now.
            </p>
            <a
              href={`https://wa.me/919935102727?text=${encodeURIComponent(
                'Hello Audio Den, I want to check my eligibility for 0% Interest Brand Finance (Bajaj Finserv / HDFC / IDFC) on smartphones and electronics.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Check Eligibility on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS & LATEST RELEASES (Guaranteed Live Display of Admin Added Items) */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Just In Stock
              </span>
              <h2 className="text-base sm:text-xl font-heading font-black text-slate-900">
                New Arrivals & Latest Products
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Fresh stock direct from authorized brand distributors with complete manufacturer warranty & GST invoice
            </p>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All New Releases ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic New Arrivals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedNewArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. SHOP BY CATEGORY DEPARTMENT SHOWCASE */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase tracking-wider">
                Categories
              </span>
              <h2 className="text-base sm:text-xl font-heading font-black text-slate-900">
                Explore All Departments
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Browse mobiles, television, smart cooling, and audio appliances
            </p>
          </div>
          <Link to="/categories" className="text-xs font-bold text-blue-600 hover:underline">
            All Categories ({categories.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {(categories || []).filter((c) => Boolean(c?.name)).map((cat) => {
            const catName = cat?.name || '';
            const count = (products || []).filter(
              (p) => (p.category || '').toLowerCase() === catName.toLowerCase() || (p.brand || '').toLowerCase() === catName.toLowerCase()
            ).length;

            return (
              <Link
                key={cat.id || catName}
                to={`/shop?category=${encodeURIComponent(catName)}`}
                className="group p-3 rounded-xl border border-gray-200 hover:border-amber-400 bg-white hover:shadow-xs transition-all flex flex-col items-center text-center space-y-2"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 p-2 flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80'}
                    alt={catName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-amber-600 transition-colors line-clamp-1">
                    {catName}
                  </h4>
                  <span className="text-[10px] text-gray-400">
                    {count} {count === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. MULTI-MODEL SLIDER: DYNAMIC BRAND SHOWCASE */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px] uppercase tracking-wider">
                Brand Showcase
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Top Models from Every Leading Brand
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Apple, Samsung, OnePlus, Vivo, Oppo & Home Displays with showroom price guarantee
            </p>
          </div>

          {/* Dynamic Brand Filter Tabs & Slider Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {availableBrandNames.slice(0, 7).map((brandName) => (
                <button
                  key={brandName}
                  onClick={() => setActiveBrandFilter(brandName)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap capitalize ${
                    activeBrandFilter.toLowerCase() === brandName.toLowerCase()
                      ? 'bg-slate-900 text-amber-400'
                      : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                >
                  {brandName === 'all' ? 'All Brands' : brandName}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => scrollBrandSlider('left')}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-slate-700 transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollBrandSlider('right')}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-slate-700 transition-colors"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Multi-Model Slide Container */}
        <div
          ref={brandSliderRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
        >
          {displayedSliderProducts.map((product) => (
            <div key={product.id} className="w-64 sm:w-72 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 7. FLASH SALE DEALS OF THE DAY */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-200">
              <Flame className="w-4 h-4 fill-red-500" />
              <span className="font-black text-xs uppercase tracking-wider">Deals of the Day</span>
            </div>
            
            {/* Live Countdown Timer */}
            <div className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
              <span>Ends in:</span>
              <span className="bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded text-[11px]">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded text-[11px]">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded text-[11px]">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          <Link
            to="/shop?flash=true"
            className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(flashSaleProducts.length > 0 ? flashSaleProducts : products.slice(0, 4)).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. ELECTRONICS SHOWCASE WITH CATEGORY TABS */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base sm:text-xl font-heading font-black text-slate-900">
              Complete Electronics Showcase
            </h2>
            <p className="text-xs text-gray-500">
              Browse phones, home entertainment, smart cooling, and sound systems
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', ...(categories || []).filter((c) => Boolean(c?.name)).slice(0, 8).map((c) => c.name)].map((catName) => (
              <button
                key={catName}
                onClick={() => setActiveCategoryTab(catName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  (activeCategoryTab || '').toLowerCase() === (catName || '').toLowerCase()
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                }`}
              >
                {catName}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {departmentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. ALL BRAND FINANCE & 0% EMI SHOWCASE */}
      <section id="brand-finance" className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> All Brand Finance Available
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight">
              0% Interest Brand Finance & No-Cost EMI Schemes
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Buy your favourite smartphone, 4K LED TV, refrigerator, or inverter AC today with instant paperless approval in just 3 minutes at our Audio Den showroom or online via WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/919935102727?text=${encodeURIComponent(
                'Hello Audio Den Showroom, I want to check my Brand Finance / 0% EMI eligibility for a new product. Please share the required documents and quick approval process.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Check Eligibility on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 13 Finance Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[
            { name: 'Bajaj Finance', scheme: '0% Interest No-Cost EMI', tag: 'Instant Approval', color: 'from-blue-900/60 to-blue-950/80 border-blue-600/50 text-blue-200' },
            { name: 'HDB Finance', scheme: 'Consumer Durable Loan', tag: 'Quick Approval', color: 'from-cyan-900/60 to-cyan-950/80 border-cyan-600/50 text-cyan-200' },
            { name: 'Poonawalla Finance', scheme: 'Poonawalla Fincorp Easy EMI', tag: 'Lowest Fee', color: 'from-orange-900/60 to-orange-950/80 border-orange-600/50 text-orange-200' },
            { name: 'TVS Finance', scheme: 'TVS Credit Instant Scheme', tag: 'Showroom Special', color: 'from-red-900/60 to-red-950/80 border-red-600/50 text-red-200' },
            { name: 'DMI Finance', scheme: 'Digital Smartphone Financing', tag: 'Pre-Approved', color: 'from-indigo-900/60 to-indigo-950/80 border-indigo-600/50 text-indigo-200' },
            { name: 'Chola Finance', scheme: 'Cholamandalam Electronics EMI', tag: 'Flexible Tenures', color: 'from-emerald-900/60 to-emerald-950/80 border-emerald-600/50 text-emerald-200' },
            { name: 'IDFC Finance', scheme: 'IDFC FIRST Bank Consumer Loan', tag: '0% Interest EMI', color: 'from-amber-900/60 to-amber-950/80 border-amber-600/50 text-amber-200' },
            { name: 'Axio Finance', scheme: 'Axio Cardless Digital EMI', tag: '100% Paperless', color: 'from-purple-900/60 to-purple-950/80 border-purple-600/50 text-purple-200' },
            { name: 'Home Credit', scheme: 'Home Credit 0% Interest EMI', tag: 'Fast Disbursal', color: 'from-rose-900/60 to-rose-950/80 border-rose-600/50 text-rose-200' },
            { name: 'Benow Finance', scheme: 'Brand Subsidized EMI Network', tag: 'Brand Cashback', color: 'from-teal-900/60 to-teal-950/80 border-teal-600/50 text-teal-200' },
            { name: 'Pine Labs', scheme: 'Multi-Bank Card & Cardless EMI', tag: 'All Bank Cards', color: 'from-green-900/60 to-green-950/80 border-green-600/50 text-green-200' },
            { name: 'Innoviti Link', scheme: 'Innoviti Brand EMI Solutions', tag: 'Payment Link', color: 'from-sky-900/60 to-sky-950/80 border-sky-600/50 text-sky-200' },
            { name: 'Paytm', scheme: 'Paytm Postpaid & Cardless POS', tag: 'Instant QR Scan', color: 'from-blue-900/70 to-blue-950/90 border-blue-500/60 text-blue-300' },
          ].map((partner, index) => (
            <div
              key={index}
              className={`p-3.5 rounded-2xl bg-gradient-to-b ${partner.color} border transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-black text-xs text-white">{partner.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-amber-300 border border-white/10 whitespace-nowrap">
                    {partner.tag}
                  </span>
                </div>
                <p className="text-[10px] text-gray-300 line-clamp-2 leading-tight">
                  {partner.scheme}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                <span>0% Interest</span>
                <span className="text-emerald-400 font-bold">✓ Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Step Showroom Process Bar */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Select Any Model</h4>
              <p className="text-[11px] text-gray-400">iPhone, Samsung, OnePlus, Smart TV or AC</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">3-Min Instant KYC</h4>
              <p className="text-[11px] text-gray-400">Just bring Aadhaar & PAN card copy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Easy EMI & Walk Out</h4>
              <p className="text-[11px] text-gray-400">Pay in 3, 6, 9 or 12 monthly installments</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. VALUE PROPOSITION BAR */}
      <section className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">100% Genuine Products</h4>
              <p className="text-[11px] text-gray-500">Official dealer for Apple, OnePlus, Samsung</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Free Express Delivery</h4>
              <p className="text-[11px] text-gray-500">Same-day delivery across Prayagraj</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Official Brand Warranty</h4>
              <p className="text-[11px] text-gray-500">GST invoice & manufacturer support</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Store Pickup Available</h4>
              <p className="text-[11px] text-gray-500">Tripathi Chauraha, New Katra</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PHYSICAL STORE VISIT CARD (AUDIO DEN PRAYAGRAJ) */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
              <MapPin className="w-3.5 h-3.5" /> Visit Audio Den Showroom
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black">
              Experience Flagship Electronics in Person
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Visit our state-of-the-art electronics showroom in Prayagraj for live demos of iPhone 16, Galaxy S25 Ultra, OnePlus 13, Vivo X200 Pro, and Oppo Find X8 with instant 0% interest EMI.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>82/55/2 A Road, Tripathi Chauraha, New Katra, Prayagraj</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Open Daily: 10:30 AM to 9:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="tel:+919935102727" className="hover:text-amber-400">Call Us: +91 9935102727</a>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>GSTIN: 09AGHPG2164L1Z8</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/10 p-5 rounded-xl border border-white/20 backdrop-blur-xs space-y-3 text-center">
            <h4 className="font-bold text-white text-sm">Need Instant Assistance?</h4>
            <p className="text-xs text-gray-300">
              Speak directly with our store manager for live inventory checks, quotes, and festival discounts.
            </p>
            <a
              href="https://wa.me/919935102727?text=Hello%20Audio%20Den,%20I%20am%20interested%20in%20purchasing%20a%20smartphone"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              Chat on WhatsApp: +91 9935102727
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
