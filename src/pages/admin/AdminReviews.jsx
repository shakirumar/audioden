import { useProductStore } from '../../store/useProductStore';
import { Star, Check, Trash2, MessageSquare } from 'lucide-react';

export default function AdminReviews() {
  const { reviews, approveReview, deleteReview, products } = useProductStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
            Review Moderation
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Moderate customer feedback, approve ratings, and manage reviews on showroom products.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-xs">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No customer reviews submitted yet.</p>
          </div>
        ) : (
          reviews.map((rev) => {
            const product = products.find((p) => p.id === rev.productId);

            return (
              <div
                key={rev.id}
                className="p-5 rounded-xl bg-white border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-amber-400 shadow-xs transition-all"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-sm">{rev.userName}</span>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                    {rev.approved ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        Live on Store
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        Pending Approval
                      </span>
                    )}
                  </div>

                  {product && (
                    <span className="text-xs text-amber-600 block font-bold">
                      Product: {product.name}
                    </span>
                  )}

                  <h4 className="font-bold text-slate-900 text-xs">{rev.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{rev.comment}"</p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  {!rev.approved && (
                    <button
                      onClick={() => approveReview(rev.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
