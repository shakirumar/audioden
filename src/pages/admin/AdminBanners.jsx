import { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Plus, Trash2, X, Eye, EyeOff } from 'lucide-react';

export default function AdminBanners() {
  const { banners, addBanner, toggleBanner, deleteBanner } = useProductStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [buttonText, setButtonText] = useState('Shop Now');
  const [link, setLink] = useState('/shop');
  const [image, setImage] = useState('');

  const handleImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setTagline('');
    setButtonText('Shop Now');
    setLink('/shop');
    setImage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !subtitle || !image) return;

    addBanner({
      title,
      subtitle,
      tagline,
      buttonText,
      link,
      image
    });

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
            Hero Banners Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage top homepage carousel slides, festive sales tags, and promotional backgrounds.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="p-5 rounded-2xl bg-white border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs hover:border-amber-400 transition-all"
          >
            <div className="flex items-center gap-4">
              <img
                src={banner.image}
                alt=""
                className="w-32 h-20 object-cover rounded-xl border border-gray-200 shadow-xs flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {banner.title}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{banner.subtitle}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{banner.tagline}</p>
                <div className="text-[11px] text-gray-400 font-mono">Link: {banner.link || '/shop'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
              <button
                onClick={() => toggleBanner(banner.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  banner.enabled !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {banner.enabled !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{banner.enabled !== false ? 'Active' : 'Disabled'}</span>
              </button>

              <button
                onClick={() => deleteBanner(banner.id)}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                title="Delete Banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-gray-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-slate-900">Add Hero Carousel Banner</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Badge / Mini Tag *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Festival Special Offer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Main Headline *</label>
                <input
                  type="text"
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Flagship iPhones & 4K Smart TVs"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Up to 40% Off + Zero Downpayment EMI"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. Shop Now, View Deal, Buy Now"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Link / URL Path</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /shop or /product/prod-apple-1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Banner Image (Upload or URL) *</label>
                <div className="flex items-center gap-3">
                  {image && (
                    <img src={image} alt="" className="w-16 h-10 object-cover rounded border p-0.5 bg-gray-50" />
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
