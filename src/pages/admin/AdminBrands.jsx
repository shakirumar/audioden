import { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminBrands() {
  const { brands, addBrand, updateBrand, deleteBrand, products } = useProductStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setLogo('');
    setIsModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingId(brand.id);
    setName(brand.name);
    setLogo(brand.logo || '');
    setIsModalOpen(true);
  };

  const handleLogoFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateBrand(editingId, { name, logo });
    } else {
      addBrand({ name, logo });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
            Brand Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage authorized manufacturer brands (Apple, Samsung, Sony, LG, Whirlpool, etc.)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Brand
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((brand) => {
          const productCount = (products || []).filter(
            (p) => (p.brand || '').toLowerCase() === (brand?.name || '').toLowerCase()
          ).length;

          return (
            <div
              key={brand.id}
              className="p-4 rounded-xl bg-white border border-gray-200 flex flex-col justify-between hover:border-amber-400 hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex items-center gap-3">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-12 h-12 object-contain rounded-lg p-1 bg-gray-50 border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{brand.name}</h3>
                  <span className="text-[11px] text-gray-500">{productCount} active devices</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(brand)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteBrand(brand.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-gray-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Brand Details' : 'Add New Brand'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sony"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Brand Logo (Upload or URL)</label>
                <div className="flex items-center gap-3">
                  {logo && (
                    <img src={logo} alt="" className="w-12 h-12 object-contain rounded border p-0.5 bg-gray-50" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoFile(e.target.files[0])}
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-amber-400"
                  />
                </div>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="Or paste external logo URL: https://..."
                  className="w-full mt-2 px-3 py-1.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg">
                  {editingId ? 'Save Brand' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
