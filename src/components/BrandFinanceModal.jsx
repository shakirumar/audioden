import { useState } from 'react';
import { X, CreditCard, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Building2, Zap } from 'lucide-react';

export default function BrandFinanceModal({ product, isOpen, onClose }) {
  const [selectedTenure, setSelectedTenure] = useState(6);

  if (!isOpen || !product) return null;

  const price = product.salePrice || product.price || 50000;
  
  // Calculate EMI for different tenures
  const calculateEMI = (months) => Math.round(price / months);

  const tenures = [
    { months: 3, label: '3 Months (No Cost)', emi: calculateEMI(3), processingFee: 0 },
    { months: 6, label: '6 Months (No Cost)', emi: calculateEMI(6), processingFee: 0, popular: true },
    { months: 9, label: '9 Months (Special)', emi: calculateEMI(9), processingFee: 0 },
    { months: 12, label: '12 Months (Special Scheme)', emi: calculateEMI(12), processingFee: 0 }
  ];

  const currentEmi = calculateEMI(selectedTenure);

  const financePartners = [
    {
      name: 'Bajaj Finance',
      scheme: '0% Interest No-Cost EMI',
      tag: 'Instant Approval',
      color: 'border-blue-500 bg-blue-50/50 text-blue-900',
      docs: 'Aadhaar Card + PAN Card'
    },
    {
      name: 'HDB Finance',
      scheme: 'HDB Financial Services Consumer Loan',
      tag: 'Instant KYC',
      color: 'border-cyan-500 bg-cyan-50/50 text-cyan-900',
      docs: 'Instant KYC Verification'
    },
    {
      name: 'Poonawalla Finance',
      scheme: 'Poonawalla Fincorp Easy EMI',
      tag: 'Lowest Processing Fee',
      color: 'border-orange-500 bg-orange-50/50 text-orange-900',
      docs: 'Paperless Digital Onboarding'
    },
    {
      name: 'TVS Finance',
      scheme: 'TVS Credit Consumer Durable Loan',
      tag: 'Special Showroom Scheme',
      color: 'border-red-500 bg-red-50/50 text-red-900',
      docs: 'Quick 3-Minute Approval'
    },
    {
      name: 'DMI Finance',
      scheme: 'Digital Mobile & Appliance Financing',
      tag: 'Pre-Approved Limit',
      color: 'border-indigo-500 bg-indigo-50/50 text-indigo-900',
      docs: 'PAN + Mobile OTP'
    },
    {
      name: 'Chola Finance',
      scheme: 'Cholamandalam Electronics Financing',
      tag: 'Flexible Tenures',
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900',
      docs: 'Aadhaar + Bank Details'
    },
    {
      name: 'IDFC Finance',
      scheme: 'IDFC FIRST Bank Consumer Loan',
      tag: '0% Interest No Cost EMI',
      color: 'border-amber-500 bg-amber-50/50 text-amber-900',
      docs: 'Zero Foreclosure Fee'
    },
    {
      name: 'Axio Finance',
      scheme: 'Axio (Capital Float) Cardless EMI',
      tag: 'Instant Digital Credit',
      color: 'border-purple-500 bg-purple-50/50 text-purple-900',
      docs: '100% Online Paperless'
    },
    {
      name: 'Home Credit',
      scheme: 'Home Credit India 0% Interest EMI',
      tag: 'Fast Loan Disbursal',
      color: 'border-rose-500 bg-rose-50/50 text-rose-900',
      docs: '2 ID Proofs Required'
    },
    {
      name: 'Benow Finance',
      scheme: 'Benow Brand-Subsidized EMI Network',
      tag: 'Brand Cashback',
      color: 'border-teal-500 bg-teal-50/50 text-teal-900',
      docs: 'Instant Showroom POS'
    },
    {
      name: 'Pine Labs',
      scheme: 'Pine Labs Multi-Bank Cardless & Card EMI',
      tag: 'All Banks Supported',
      color: 'border-green-500 bg-green-50/50 text-green-900',
      docs: 'Debit & Credit Cards'
    },
    {
      name: 'Innoviti Link',
      scheme: 'Innoviti Payment Solutions Brand EMI',
      tag: 'Instant Payment Link',
      color: 'border-sky-500 bg-sky-50/50 text-sky-900',
      docs: 'Online & Store Counter'
    },
    {
      name: 'Paytm',
      scheme: 'Paytm Postpaid & Cardless EMI POS',
      tag: 'Instant QR Scan Disbursal',
      color: 'border-blue-600 bg-blue-50/60 text-blue-950',
      docs: 'Paytm Verified Users'
    }
  ];

  const handleWhatsAppInquiry = () => {
    const text = `Hello Audio Den Showroom, I want to check Brand Finance / No Cost EMI availability for:
• Product: ${product.name}
• Price: ₹${price.toLocaleString('en-IN')}
• Preferred Tenure: ${selectedTenure} Months (₹${currentEmi.toLocaleString('en-IN')}/mo)
Available Options: Bajaj Finance, HDB, Poonawalla, TVS, DMI, Chola, IDFC, Axio, Home Credit, Benow, Pine Labs, Innoviti, Paytm.
Please confirm document requirements and instant approval at New Katra store.`;

    window.open(`https://wa.me/919935102727?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex justify-between items-start border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              All Brand Finance Available
            </div>
            <h3 className="text-base sm:text-lg font-black font-heading leading-snug">
              0% Interest Brand Finance & No Cost EMI
            </h3>
            <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">
              Available for: <strong className="text-white">{product.name}</strong> (₹{price.toLocaleString('en-IN')})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Quick Highlight Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black flex-shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  Starting at ₹{calculateEMI(12).toLocaleString('en-IN')} / month
                </div>
                <div className="text-[11px] text-amber-900 font-bold">
                  0% Interest No-Cost EMI • Instant 5-Minute Showroom Approval
                </div>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-slate-900 text-amber-400 font-black text-[10px] uppercase">
              0% Interest EMI
            </span>
          </div>

          {/* Tenure Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 uppercase tracking-wide text-[11px] block">
              Select 0% Interest EMI Tenure:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {tenures.map((t) => (
                <button
                  key={t.months}
                  type="button"
                  onClick={() => setSelectedTenure(t.months)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    selectedTenure === t.months
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                      : 'border-gray-200 hover:border-slate-400 bg-white text-slate-800'
                  }`}
                >
                  {t.popular && (
                    <span className="absolute -top-2 right-2 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded shadow-xs uppercase">
                      Popular
                    </span>
                  )}
                  <div className={`text-[11px] font-semibold ${selectedTenure === t.months ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t.months} Months
                  </div>
                  <div className="text-sm font-black mt-0.5">
                    ₹{t.emi.toLocaleString('en-IN')}<span className="text-[10px] font-normal">/mo</span>
                  </div>
                  <div className={`text-[10px] font-bold mt-1 ${selectedTenure === t.months ? 'text-amber-400' : 'text-emerald-700'}`}>
                    0% Interest EMI
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Finance Partners Grid */}
          <div className="space-y-2.5">
            <label className="font-bold text-slate-900 uppercase tracking-wide text-[11px] block">
              Approved Brand Finance Partners at Audio Den:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {financePartners.map((partner, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border ${partner.color} space-y-1.5 relative`}>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                      {partner.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-bold border border-gray-200">
                      {partner.tag}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-700">
                    {partner.scheme}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-1 border-t border-black/5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span>Req: {partner.docs}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works in Showroom */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-700" />
              How to Avail at Audio Den Showroom (Prayagraj):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gray-600">
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span>Bring your Aadhaar & PAN Card to our New Katra store</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span>Our desk verifies pre-approved limit in under 3 minutes</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span>Take your new device home immediately with easy monthly installments</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer / Direct WhatsApp Action */}
        <div className="p-4 bg-slate-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left text-xs">
            <span className="text-gray-500">Selected EMI: </span>
            <strong className="text-slate-900 font-black">₹{currentEmi.toLocaleString('en-IN')}/month</strong>
            <span className="text-emerald-700 font-bold ml-1">({selectedTenure} Months No Cost)</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-slate-700 font-bold text-xs hover:bg-gray-100 transition-colors flex-1 sm:flex-none"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs inline-flex items-center justify-center gap-2 transition-all shadow-sm flex-1 sm:flex-none"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Check Eligibility on WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
