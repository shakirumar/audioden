import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Sparkles, AlertCircle, Layers } from 'lucide-react';

const PRESETS = [
  {
    name: 'Flagship Mobile (128GB / 256GB / 512GB / 1TB)',
    category: 'Smartphones',
    variants: [
      { variantLabel: '128GB', storage: '128GB', ram: '8GB', priceMultiplier: 1.0, saleMultiplier: 1.0, isDefault: true },
      { variantLabel: '256GB', storage: '256GB', ram: '8GB', priceMultiplier: 1.12, saleMultiplier: 1.10, isDefault: false },
      { variantLabel: '512GB', storage: '512GB', ram: '12GB', priceMultiplier: 1.28, saleMultiplier: 1.25, isDefault: false },
      { variantLabel: '1TB', storage: '1TB', ram: '16GB', priceMultiplier: 1.50, saleMultiplier: 1.45, isDefault: false }
    ]
  },
  {
    name: 'Pro Flagship / Ultra (256GB / 512GB / 1TB / 2TB)',
    category: 'Smartphones',
    variants: [
      { variantLabel: '256GB', storage: '256GB', ram: '12GB', priceMultiplier: 1.0, saleMultiplier: 1.0, isDefault: true },
      { variantLabel: '512GB', storage: '512GB', ram: '12GB', priceMultiplier: 1.18, saleMultiplier: 1.15, isDefault: false },
      { variantLabel: '1TB', storage: '1TB', ram: '16GB', priceMultiplier: 1.45, saleMultiplier: 1.40, isDefault: false },
      { variantLabel: '2TB', storage: '2TB', ram: '16GB', priceMultiplier: 1.85, saleMultiplier: 1.80, isDefault: false }
    ]
  },
  {
    name: 'Budget / Mid-Range (64GB / 128GB / 256GB)',
    category: 'Smartphones',
    variants: [
      { variantLabel: '64GB', storage: '64GB', ram: '4GB', priceMultiplier: 0.85, saleMultiplier: 0.85, isDefault: false },
      { variantLabel: '128GB', storage: '128GB', ram: '6GB', priceMultiplier: 1.0, saleMultiplier: 1.0, isDefault: true },
      { variantLabel: '256GB', storage: '256GB', ram: '8GB', priceMultiplier: 1.20, saleMultiplier: 1.18, isDefault: false }
    ]
  }
];

export default function VariantPriceManager({
  variants = [],
  onChange,
  basePrice = 49999,
  baseSalePrice = 44999,
  productName = 'Product'
}) {
  const [hasVariants, setHasVariants] = useState(Array.isArray(variants) && variants.length > 0);

  const handleToggle = (enabled) => {
    setHasVariants(enabled);
    if (!enabled) {
      onChange([]);
    } else if (variants.length === 0) {
      // Default to 2 starter variants
      onChange([
        {
          id: 'var-128',
          variantLabel: '128GB',
          storage: '128GB',
          ram: '8GB',
          price: Number(basePrice) || 49999,
          salePrice: Number(baseSalePrice) || 44999,
          stock: 15,
          sku: '',
          isDefault: true
        },
        {
          id: 'var-256',
          variantLabel: '256GB',
          storage: '256GB',
          ram: '8GB',
          price: Math.round((Number(basePrice) || 49999) * 1.15),
          salePrice: Math.round((Number(baseSalePrice) || 44999) * 1.15),
          stock: 10,
          sku: '',
          isDefault: false
        }
      ]);
    }
  };

  const handleAddVariant = () => {
    const nextStorage = variants.length === 0 ? '128GB' : variants.length === 1 ? '256GB' : variants.length === 2 ? '512GB' : '1TB';
    const lastPrice = variants[variants.length - 1]?.price || basePrice;
    const lastSale = variants[variants.length - 1]?.salePrice || baseSalePrice;

    const newVar = {
      id: `var-${Date.now()}-${variants.length + 1}`,
      variantLabel: nextStorage,
      storage: nextStorage,
      ram: '8GB',
      price: Math.round(Number(lastPrice) * 1.15),
      salePrice: Math.round(Number(lastSale) * 1.15),
      stock: 10,
      sku: '',
      isDefault: variants.length === 0
    };
    onChange([...variants, newVar]);
  };

  const handleUpdateVariant = (index, field, value) => {
    const updated = variants.map((v, i) => {
      if (i !== index) return v;
      const copy = { ...v, [field]: value };
      // Keep label synced if storage changes and label was storage
      if (field === 'storage' && (!v.variantLabel || v.variantLabel === v.storage)) {
        copy.variantLabel = value;
      }
      return copy;
    });
    onChange(updated);
  };

  const handleSetDefault = (index) => {
    const updated = variants.map((v, i) => ({
      ...v,
      isDefault: i === index
    }));
    onChange(updated);
  };

  const handleRemoveVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((v) => v.isDefault)) {
      updated[0].isDefault = true;
    }
    onChange(updated);
  };

  const handleApplyPreset = (preset) => {
    const bP = Number(basePrice) || 49999;
    const bS = Number(baseSalePrice) || 44999;

    const newVariants = preset.variants.map((pv, idx) => ({
      id: `var-preset-${Date.now()}-${idx}`,
      variantLabel: pv.variantLabel,
      storage: pv.storage,
      ram: pv.ram,
      price: Math.round(bP * pv.priceMultiplier),
      salePrice: Math.round(bS * pv.saleMultiplier),
      stock: 12,
      sku: '',
      isDefault: !!pv.isDefault
    }));
    setHasVariants(true);
    onChange(newVariants);
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 border border-slate-200/90 shadow-xs space-y-4">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>Variant-Wise Price Entry</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Live Customer Update
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Enter storage & RAM tiers (e.g. 128GB, 256GB, 512GB, 1TB) with separate prices. Customers see these change on click.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto bg-white border border-gray-300 px-3.5 py-1.5 rounded-xl shadow-2xs hover:border-amber-400">
          <input
            type="checkbox"
            checked={hasVariants}
            onChange={(e) => handleToggle(e.target.checked)}
            className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
          />
          <span className="text-xs font-bold text-slate-800">
            {hasVariants ? 'Variants Enabled' : 'Enable Variant Pricing'}
          </span>
        </label>
      </div>

      {!hasVariants ? (
        <div className="p-4 bg-white/70 rounded-xl border border-dashed border-gray-300 text-center space-y-2">
          <p className="text-xs text-gray-600 font-medium">
            This product currently uses single standard pricing (₹{(baseSalePrice || basePrice || 0).toLocaleString('en-IN')}).
          </p>
          <button
            type="button"
            onClick={() => handleToggle(true)}
            className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Enable Storage & RAM Variant Pricing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick 1-Click Mobile Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Quick 1-Click Mobile Variant Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-gray-300 hover:border-amber-400 text-slate-800 font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>⚡</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Variants Table / Grid */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Default</th>
                  <th className="py-2.5 px-3">Variant Label</th>
                  <th className="py-2.5 px-3">Storage (GB/TB)</th>
                  <th className="py-2.5 px-3">RAM</th>
                  <th className="py-2.5 px-3">MRP (₹)</th>
                  <th className="py-2.5 px-3">Sale Price (₹)</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {variants.map((v, idx) => {
                  const discount = v.price > v.salePrice 
                    ? Math.round(((v.price - v.salePrice) / v.price) * 100) 
                    : 0;

                  return (
                    <tr
                      key={v.id || idx}
                      className={`hover:bg-amber-50/40 transition-colors ${
                        v.isDefault ? 'bg-amber-50/60 font-semibold' : ''
                      }`}
                    >
                      {/* Default Radio */}
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleSetDefault(idx)}
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider transition-colors ${
                            v.isDefault
                              ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-500'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title="Set as Default Selected Variant on Storefront"
                        >
                          {v.isDefault ? 'Default' : 'Set'}
                        </button>
                      </td>

                      {/* Variant Label */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={v.variantLabel || ''}
                          onChange={(e) => handleUpdateVariant(idx, 'variantLabel', e.target.value)}
                          placeholder="e.g. 256GB"
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 font-bold text-slate-900"
                        />
                      </td>

                      {/* Storage */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={v.storage || ''}
                          onChange={(e) => handleUpdateVariant(idx, 'storage', e.target.value)}
                          placeholder="256GB"
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 font-bold"
                        />
                      </td>

                      {/* RAM */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={v.ram || ''}
                          onChange={(e) => handleUpdateVariant(idx, 'ram', e.target.value)}
                          placeholder="8GB"
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500"
                        />
                      </td>

                      {/* MRP */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 text-gray-600 font-semibold"
                        />
                      </td>

                      {/* Sale Price */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={v.salePrice}
                            onChange={(e) => handleUpdateVariant(idx, 'salePrice', Number(e.target.value))}
                            className="w-28 px-2 py-1 border border-emerald-300 rounded bg-emerald-50/50 font-black text-emerald-900 focus:ring-1 focus:ring-emerald-500"
                          />
                          {discount > 0 && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex-shrink-0">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={v.stock !== undefined ? v.stock : 10}
                          onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 font-semibold"
                        />
                      </td>

                      {/* SKU */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={v.sku || ''}
                          onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                          placeholder="Optional SKU"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-[11px]"
                        />
                      </td>

                      {/* Delete */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete Variant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Variant Button */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Another Variant Option
            </button>

            <span className="text-[11px] text-gray-500 font-medium">
              💡 {variants.length} variant options configured for <strong>{productName}</strong>
            </span>
          </div>

          {/* Storefront Customer Preview Box */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-amber-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Customer Storefront Live Preview
              </span>
              <span className="text-gray-400">Interactive Preview</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {variants.map((v, i) => (
                <div
                  key={i}
                  className={`px-3 py-1.5 rounded-lg border text-left text-xs ${
                    v.isDefault
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
                      : 'bg-slate-800 text-gray-200 border-slate-700 font-semibold'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{v.variantLabel || v.storage || `Var ${i + 1}`}</span>
                    {v.isDefault && (
                      <span className="text-[9px] uppercase px-1 py-0.2 bg-slate-950 text-amber-400 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className={`text-[11px] font-black ${v.isDefault ? 'text-slate-900' : 'text-emerald-400'}`}>
                    ₹{(v.salePrice || v.price || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
