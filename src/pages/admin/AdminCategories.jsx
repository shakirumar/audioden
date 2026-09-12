import { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useProductStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setImage('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'));
    setImage(cat.image || '');
    setIsModalOpen(true);
  };

  const handleImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateCategory(editingId, {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        image: image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
      });
    } else {
      addCategory({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        image: image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
            Category Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize mobile devices, audio gear, and major home appliances into departments.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const productCount = (products || []).filter(
            (p) => (p.category || '').toLowerCase() === (cat?.name || '').toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              className="p-4 rounded-xl bg-white border border-gray-200 flex flex-col justify-between hover:border-amber-400 hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.name}
                  className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1 border border-gray-200"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                  <span className="text-[11px] text-gray-500">{productCount} active items</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-gray-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Smart TV"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Slug URL</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="smart-tv"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Category Image</label>
                <div className="flex items-center gap-3">
                  {image && (
                    <img src={image} alt="" className="w-12 h-12 object-contain rounded border p-0.5 bg-gray-50" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFile(e.target.files[0])}
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-amber-400"
                  />
                </div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or paste image URL: https://..."
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
                  {editingId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
