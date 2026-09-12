import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, ShoppingBag, Heart, ShieldCheck, Truck, 
  Check, ChevronRight, Zap, Tag, 
  MapPin, CheckCircle2, MessageCircle, Gift, Sparkles, CreditCard
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/ProductCard';
import BrandFinanceModal from '../components/BrandFinanceModal';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, reviews, addReview } = useProductStore();
  const { addItem, coupon, applyCoupon, removeCoupon } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const product = products.find((p) => p.id === id) || products[0];
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '');
  const [quantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [pincode, setPincode] = useState('211002');
  const [pincodeCheckMessage, setPincodeCheckMessage] = useState('Delivery by tomorrow, 11 PM | Free');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  const handleApplyCouponCode = (code) => {
    if (!code || !code.trim()) return;
    const res = applyCoupon(code);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponFeedback({ success: false, message: 'Coupon removed' });
    setTimeout(() => setCouponFeedback(null), 3000);
  };

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // oxlint-disable react/set-state-in-effect
  useEffect(() => {
    if (product?.images?.[0]) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <Link to="/shop" className="px-5 py-2.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg inline-block">
          Return to Showroom Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.price > product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeCheckMessage(`Delivering to ${pincode} by tomorrow, 11 PM | Free Delivery`);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    addReview({
      productId: product.id,
      userName: reviewName,
      rating: reviewRating,
      title: 'Customer Experience',
      comment: reviewComment,
      verified: true
    });
    setReviewSuccess(true);
    setReviewName('');
    setReviewComment('');
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto py-1">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link to="/shop" className="hover:text-blue-600">Shop</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600">{product.category}</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. Main Product Layout (Flipkart / Amazon 2-Column) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MULTI-IMAGE GALLERY & STICKY CTA BUTTONS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-40">
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-96">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    onMouseEnter={() => setSelectedImage(img)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg p-1 bg-white border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedImage === img ? 'border-amber-500 shadow-xs' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-grow aspect-square bg-white border border-gray-100 rounded-xl p-6 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110"
              />

              {/* Wishlist Heart */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 right-3 p-2.5 rounded-full border shadow-xs transition-colors ${
                  inWishlist
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-gray-200 text-gray-400 hover:text-red-500'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
              </button>

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-emerald-600 text-white font-black text-xs px-2.5 py-0.5 rounded shadow-xs uppercase">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Flipkart Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className={`py-3.5 px-4 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="py-3.5 px-4 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Zap className="w-4 h-4 fill-white" /> Buy Now
            </button>
          </div>

          {/* Instant Order on WhatsApp Button */}
          <a
            href={`https://wa.me/919935102727?text=${encodeURIComponent(
              `*AUDIO DEN - NEW ORDER INQUIRY*\n\nHello Audio Den, I would like to order:\n*Model:* ${product.name}\n*Brand:* ${product.brand}\n*Price:* ₹${(product.salePrice || product.price).toLocaleString('en-IN')}\n*SKU:* ${product.sku || 'N/A'}\n\nPlease confirm stock availability, best offer, and doorstep delivery in Prayagraj!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order Instantly on WhatsApp</span>
          </a>
        </div>

        {/* RIGHT COLUMN: PRODUCT DETAILS, PRICING, OFFERS & SPECS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Brand & Title */}
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
              {product.brand} Official
            </span>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Rating & Assured Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="bg-emerald-700 text-white font-black text-xs px-2 py-0.5 rounded flex items-center gap-1">
                <span>{product.rating || 4.8}</span>
                <Star className="w-3 h-3 fill-white" />
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                {product.reviewCount || 34} Ratings & {productReviews.length} Reviews
              </span>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audio Den Assured</span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
              Special Showroom Price
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-slate-950">
                ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
              </span>
              {product.price > product.salePrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-emerald-700">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Inclusive of all taxes. Free doorstep shipping in Prayagraj.
            </p>
          </div>

          {/* SPECIAL PRODUCT OFFER & DEALS HIGHLIGHT BOX */}
          {product.hasOffer && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-2 border-amber-400/80 shadow-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-900 text-amber-400 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{product.offerBadgeText || 'SPECIAL OFFER'}</span>
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {product.offerTitle || 'Exclusive Showroom Offer'}
                  </span>
                </div>
                {product.offerValidUntil && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                    {product.offerValidUntil}
                  </span>
                )}
              </div>

              {product.offerFreebie && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                  <Gift className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Bonus In-Box: <strong>{product.offerFreebie}</strong></span>
                </div>
              )}

              <p className="text-[11px] text-gray-600">
                ⚡ Instant showroom discount applied at checkout. Guaranteed lowest price in Prayagraj.
              </p>
            </div>
          )}

          {/* Brand Finance & No Cost EMI Interactive Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 via-amber-50/70 to-blue-50/80 border border-amber-300/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black flex-shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide block">
                    All Brand Finance Available • 0% Interest EMI
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Bajaj • HDB • Poonawalla • TVS • DMI • Chola • IDFC • Axio • Home Credit • Benow • Pine Labs • Innoviti • Paytm
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                0% Interest EMI
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Take this device home today with monthly installments starting at just <strong className="text-slate-950 font-black">₹{Math.round((product.salePrice || product.price) / 12).toLocaleString('en-IN')}/month</strong>. 100% paperless approval in 3 minutes at our New Katra showroom.
            </p>

            <button
              type="button"
              onClick={() => setIsFinanceOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs transition-colors shadow-2xs inline-flex items-center gap-1.5"
            >
              <span>View Available Finance Schemes & Tenures →</span>
            </button>
          </div>

          {/* Flipkart / Amazon Style Available Bank Offers & Apply Coupon */}
          <div className="space-y-3 p-4 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 rounded-xl border border-amber-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600" /> Available Offers & Apply Coupon
              </h4>
              {coupon ? (
                <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  ✓ {coupon.code} Active
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Instant Savings
                </span>
              )}
            </div>

            {/* Quick Apply Coupon Pills */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-gray-500 font-semibold">Tap to apply:</span>
                {[
                  { code: 'WELCOME10', label: '10% Off First Order' },
                  { code: 'AUDIODEN5', label: '5% Instant Store Discount' },
                  { code: 'OFFER1000', label: 'Flat ₹1,000 Off' }
                ].map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleApplyCouponCode(c.code)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all ${
                      coupon?.code === c.code
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                        : 'border-dashed border-amber-400 bg-white hover:bg-amber-100/70 text-slate-800'
                    }`}
                    title={`Click to apply ${c.code}`}
                  >
                    <span>🏷️ {c.code}</span>
                    <span className="text-[10px] font-sans text-amber-900 font-medium">({c.label})</span>
                  </button>
                ))}
              </div>

              {/* Coupon Input Form */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter promo / coupon code..."
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono uppercase bg-white shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCouponCode(couponInput)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg flex-shrink-0 transition-colors shadow-2xs"
                >
                  Apply Coupon
                </button>
              </div>

              {/* Feedback and Active Coupon Banner */}
              {couponFeedback && (
                <div className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  couponFeedback.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span>{couponFeedback.message}</span>
                  {coupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] text-red-600 hover:text-red-800 underline font-bold ml-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}

              {coupon && !couponFeedback && (
                <div className="p-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-between">
                  <span>✓ Coupon <strong>{coupon.code}</strong> is applied to your order!</span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-red-600 hover:text-red-800 underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Standard Bank & Showroom Offers */}
            <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-gray-200/80">
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700 flex-shrink-0">Bank Offer:</span>
                <span>5% Cashback on Axis Bank & HDFC Credit Cards on orders above ₹10,000.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700 flex-shrink-0">No Cost EMI:</span>
                <span>Avail No Cost EMI starting at ₹{(Math.round((product.salePrice || product.price) / 12)).toLocaleString('en-IN')}/month on all major banks.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700 flex-shrink-0">Showroom Exchange:</span>
                <span>Extra ₹2,000 off on exchange of old smartphone or TV at Audio Den store.</span>
              </div>
            </div>
          </div>

          {/* Pincode & Delivery Checker */}
          <div className="p-4 rounded-xl border border-gray-200 space-y-2 bg-white">
            <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-700" /> Delivery Options
            </label>
            <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit pincode"
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg flex-shrink-0"
              >
                Check
              </button>
            </form>
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> {pincodeCheckMessage}
            </p>
          </div>

          {/* Key Features Bullet Points */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Product Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700 list-disc list-inside">
                {product.features.map((f, i) => (
                  <li key={i} className="leading-relaxed">{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Description
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Technical Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Technical Specifications
              </h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 p-2.5 bg-white">
                    <span className="font-semibold text-gray-500">{key}</span>
                    <span className="col-span-2 text-slate-900 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings & Customer Reviews Section */}
          <div className="space-y-5 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Customer Ratings & Reviews ({productReviews.length})
              </h3>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {productReviews.length === 0 ? (
                <p className="text-xs text-gray-500">No customer reviews yet. Be the first to review this product!</p>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl border border-gray-200 space-y-1.5 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <span>{rev.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-white" />
                      </span>
                      <span className="font-bold text-xs text-slate-900">{rev.title}</span>
                    </div>
                    <p className="text-xs text-gray-700">{rev.comment}</p>
                    <div className="text-[10px] text-gray-400 flex items-center gap-2 pt-1">
                      <span className="font-medium text-slate-700">{rev.userName}</span>
                      <span>•</span>
                      <span className="text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Certified Buyer
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Box */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-900">Write a Review for this Product</h4>
              {reviewSuccess && (
                <div className="p-2 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  ✓ Your review has been submitted and posted successfully!
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Your Full Name"
                    className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-semibold">Rating:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Very Good)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Poor)</option>
                      <option value="1">1 Star (Terrible)</option>
                    </select>
                  </div>
                </div>
                <textarea
                  rows="2"
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this device..."
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500"
                ></textarea>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg shadow-xs"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-slate-900">
            Similar Electronics You May Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Brand Finance & EMI Modal */}
      <BrandFinanceModal
        product={product}
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
      />

    </div>
  );
}
