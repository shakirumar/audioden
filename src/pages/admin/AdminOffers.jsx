import { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Percent, Tag, Calendar } from 'lucide-react';

export default function AdminOffers() {
  const { offers = [], categories, brands, addOffer, updateOffer, toggleOffer, deleteOffer } = useProductStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [applicableTo, setApplicableTo] = useState('brand');
  const [applicableValue, setApplicableValue] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDiscountPercent(10);
    setApplicableTo('brand');
    setApplicableValue('');
    setCouponCode('');
    setStartDate('');
    setEndDate('');
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(nextMonth);
    setApplicableValue(brands[0]?.name || '');
    setIsModalOpen(true);
  };

  const openEditModal = (offer) => {
    setEditingId(offer.id);
    setTitle(offer.title);
    setDescription(offer.description || '');
    setDiscountPercent(offer.discountPercent);
    setApplicableTo(offer.applicableTo || 'brand');
    setApplicableValue(offer.applicableValue || '');
    setCouponCode(offer.couponCode || '');
    setStartDate(offer.startDate || '');
    setEndDate(offer.endDate || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      discountPercent: Number(discountPercent),
      applicableTo,
      applicableValue,
      couponCode: couponCode.trim().toUpperCase(),
      startDate,
      endDate
    };

    if (editingId) {
      updateOffer(editingId, payload);
    } else {
      addOffer(payload);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const getStatusLabel = (offer) => {
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);

    if (!offer.enabled) return { text: 'Disabled', color: 'bg-gray-100 text-gray-500 border-gray-200' };
    if (now < start) return { text: 'Upcoming', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (now > end) return { text: 'Expired', color: 'bg-red-100 text-red-800 border-red-200' };
    return { text: 'Active', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  const applicableOptions = applicableTo === 'brand'
    ? brands.map((b) => b.name)
    : categories.map((c) => c.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
            Offers & Promotions
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create and manage discount offers, flash sales, and promo codes for your storefront.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs text-center">
          <div className="text-2xl font-heading font-black text-slate-900">{offers.length}</div>
          <div className="text-[11px] text-gray-500 font-bold">Total Offers</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs text-center">
          <div className="text-2xl font-heading font-black text-emerald-700">
            {offers.filter((o) => {
              const now = new Date();
              return o.enabled && new Date(o.startDate) <= now && new Date(o.endDate) >= now;
            }).length}
          </div>
          <div className="text-[11px] text-gray-500 font-bold">Active Now</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs text-center">
          <div className="text-2xl font-heading font-black text-blue-700">
            {offers.filter((o) => new Date(o.startDate) > new Date()).length}
          </div>
          <div className="text-[11px] text-gray-500 font-bold">Upcoming</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs text-center">
          <div className="text-2xl font-heading font-black text-red-700">
            {offers.filter((o) => new Date(o.endDate) < new Date()).length}
          </div>
          <div className="text-[11px] text-gray-500 font-bold">Expired</div>
        </div>
      </div>

      {/* Offers List */}
      {offers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-xs">
          <Percent className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No offers created yet. Click "Create New Offer" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => {
            const status = getStatusLabel(offer);
            return (
              <div
                key={offer.id}
                className="p-5 rounded-2xl bg-white border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs hover:border-amber-400 transition-all"
              >
                {/* Offer Info */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${status.color}`}>
                      {status.text}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      {offer.discountPercent}% OFF
                    </span>
                    {offer.couponCode && (
                      <span className="text-[10px] font-mono font-bold text-slate-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-amber-500" />
                        {offer.couponCode}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{offer.title}</h3>
                  {offer.description && (
                    <p className="text-xs text-gray-500 line-clamp-1">{offer.description}</p>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {offer.startDate} → {offer.endDate}
                    </span>
                    <span>
                      Applies to: <strong className="text-slate-700">{offer.applicableTo === 'brand' ? 'Brand' : 'Category'}: {offer.applicableValue}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <button
                    onClick={() => toggleOffer(offer.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      offer.enabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {offer.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{offer.enabled ? 'On' : 'Off'}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(offer)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Edit Offer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete offer "${offer.title}"?`)) {
                        deleteOffer(offer.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete Offer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add / Edit Offer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full p-6 rounded-2xl bg-white border border-gray-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Offer' : 'Create New Offer'}
              </h3>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Offer Title */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Monsoon Mega Sale, Diwali Special"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-semibold text-slate-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the offer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              {/* Discount & Coupon Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Discount % *</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="90"
                      required
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-black text-slate-900"
                    />
                    <Percent className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. MONSOON15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Applicable To */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Applies To *</label>
                  <select
                    value={applicableTo}
                    onChange={(e) => {
                      setApplicableTo(e.target.value);
                      setApplicableValue('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="brand">Brand</option>
                    <option value="category">Category</option>
                    <option value="all">All Products</option>
                  </select>
                </div>
                {applicableTo !== 'all' && (
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      {applicableTo === 'brand' ? 'Select Brand' : 'Select Category'} *
                    </label>
                    <select
                      value={applicableValue}
                      onChange={(e) => setApplicableValue(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Choose...</option>
                      {applicableOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Preview */}
              {title && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Offer Preview</div>
                  <div className="font-bold text-slate-900 text-sm">{title}</div>
                  <div className="text-xs text-gray-600">
                    <strong className="text-emerald-700">{discountPercent}% OFF</strong>
                    {applicableTo !== 'all' && ` on ${applicableTo}: ${applicableValue || '...'}`}
                    {applicableTo === 'all' && ' on all products'}
                    {couponCode && <> · Code: <span className="font-mono font-bold">{couponCode}</span></>}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {startDate} → {endDate}
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
