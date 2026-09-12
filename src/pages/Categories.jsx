import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { ArrowRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Categories() {
  const { categories, products } = useProductStore();

  const allCategories = [...categories];
  products.forEach((p) => {
    if (p.category && !allCategories.some((c) => c.name?.toLowerCase() === p.category.toLowerCase())) {
      allCategories.push({
        id: 'cat-' + p.category,
        name: p.category,
        image: p.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" /> Department Showcase
        </div>
        <h1 className="text-2xl sm:text-4xl font-heading font-black text-slate-900">
          Explore All Categories
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Discover our full selection of flagship mobile phones, high-end 4K displays, smart cooling, and premium home appliances.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {allCategories.map((cat, idx) => {
          const count = products.filter(
            (p) => p.category?.toLowerCase() === cat.name?.toLowerCase()
          ).length;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Link
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative block rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-amber-400 hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden p-3 flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Item counter badge */}
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded-full shadow-xs">
                    {count} {count === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-medium">Official Brand Inventory</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-amber-400 text-slate-900 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
