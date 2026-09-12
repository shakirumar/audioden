import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#0f172a] text-gray-300 border-t border-slate-800 pt-14 pb-8">
      {/* 1. Value Proposition Highlights (Amazon/Flipkart Trust Strip) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">100% Genuine Products</h4>
              <p className="text-[11px] text-gray-400">Authorized dealer for Apple, Samsung & Sony</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">Express Prayagraj Delivery</h4>
              <p className="text-[11px] text-gray-400">Same-day delivery & store pickup available</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">Official Brand Warranty</h4>
              <p className="text-[11px] text-gray-400">GST invoice with authorized center warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">Hassle-Free Exchange</h4>
              <p className="text-[11px] text-gray-400">Best trade-in value on used mobiles & TVs</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Physical Store Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Store Coordinates */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white rounded-lg shadow-xs">
                <img
                  src="/logo.png"
                  alt="Audio Den"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-heading font-black text-lg text-white block">AUDIO DEN</span>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                  Mobile & Home Appliances
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Prayagraj's premier destination for flagship smartphones, 4K Smart TVs, luxury sound systems, high-efficiency refrigerators, air conditioners, and home essentials.
            </p>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>82/55/2 A Road, Tripathi Chauraha, New Katra, Prayagraj, Uttar Pradesh 211002</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="tel:+919935102727" className="hover:text-amber-400 transition-colors">
                  +91 9935102727
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="mailto:vaibhavgupta1974@gmail.com" className="hover:text-amber-400 transition-colors">
                  vaibhavgupta1974@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Top Categories</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/shop?category=Smartphones" className="hover:text-amber-400">Smartphones & iPhones</Link></li>
              <li><Link to="/shop?category=Smart TV" className="hover:text-amber-400">Smart 4K LED TVs</Link></li>
              <li><Link to="/shop?category=Refrigerator" className="hover:text-amber-400">Double Door Refrigerators</Link></li>
              <li><Link to="/shop?category=Air Conditioner" className="hover:text-amber-400">Inverter Air Conditioners</Link></li>
              <li><Link to="/shop?category=Washing Machine" className="hover:text-amber-400">Fully Automatic Washing Machines</Link></li>
              <li><Link to="/shop?category=Speakers" className="hover:text-amber-400">Soundbars & Home Audio</Link></li>
            </ul>
          </div>

          {/* Customer Service & Help */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Customer Care</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/account?tab=orders" className="hover:text-amber-400">Track My Order</Link></li>
              <li><Link to="/cart" className="hover:text-amber-400">Shopping Cart</Link></li>
              <li><Link to="/account?tab=wishlist" className="hover:text-amber-400">My Wishlist</Link></li>
              <li><Link to="/admin" className="text-amber-400 font-bold hover:underline">Admin Login Portal</Link></li>
              <li><span className="text-gray-400">Store Timings: 10:30 AM - 9:30 PM (Daily)</span></li>
            </ul>
          </div>

          {/* Newsletter / Exclusive Deals */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Deals & Updates</h5>
            <p className="text-xs text-gray-400">
              Get notified of Diwali, Holi, and festival price drops directly in your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-md transition-colors flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {isSubscribed && (
                <p className="text-[11px] text-emerald-400 font-medium">
                  ✓ Thank you for subscribing to Audio Den offers!
                </p>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* 3. Bottom Copyright & Accepted Payment Methods */}
      <div className="border-t border-slate-800 pt-6 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="text-center sm:text-left space-y-1.5">
            <p>© {new Date().getFullYear()} AUDIO DEN. All rights reserved. 82/55/2 A Road, Tripathi Chauraha, New Katra, Prayagraj.</p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 font-mono">
              <span className="bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded">GSTIN: 09AGHPG2164L1Z8</span>
              <span className="bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded">PAN: AGHPG2164L</span>
              <span className="text-emerald-400 font-semibold">• 100% Verified Indian Business</span>
            </div>
            <p className="text-[10px] tracking-wider text-gray-400 font-bold uppercase">
              DESIGN & DEVLOP BY <a href="https://www.usdglobalweb.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 hover:underline transition-colors">USD GLOBAL WEB</a> | GET IN TOUCH <a href="https://www.usdglobalweb.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 hover:underline transition-colors">WWW.USDGLOBALWEB.COM</a>
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1.5 max-w-xl">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              All Brand Finance Available (0% EMI & Zero Down Payment):
            </div>
            <div className="flex flex-wrap sm:justify-end items-center gap-1.5 text-[10px] font-semibold text-gray-300">
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-200 border border-blue-800/60">Bajaj Finance</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-200 border border-cyan-800/60">HDB Finance</span>
              <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-200 border border-orange-800/60">Poonawalla Finance</span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-200 border border-red-800/60">TVS Finance</span>
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-200 border border-indigo-800/60">DMI Finance</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-200 border border-emerald-800/60">Chola Finance</span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-200 border border-amber-800/60">IDFC Finance</span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-800/60">Axio Finance</span>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-200 border border-rose-800/60">Home Credit</span>
              <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-200 border border-teal-800/60">Benow Finance</span>
              <span className="px-2 py-0.5 rounded bg-green-950 text-green-200 border border-green-800/60">Pine Labs</span>
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-200 border border-sky-800/60">Innoviti Link</span>
              <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-100 border border-blue-700/60">Paytm</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
