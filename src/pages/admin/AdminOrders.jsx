import { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { 
  Search, CheckCircle2, Clock, Truck, XCircle, AlertCircle, Trash2, 
  MessageCircle, Mail, Printer, Eye, X, ShieldCheck
} from 'lucide-react';
import { 
  formatClientEmail, 
  printGstInvoice 
} from '../../services/notificationService';

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.customerPhone && o.customerPhone.includes(searchTerm));

    const matchesStatus = statusFilter === 'ALL' || o.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3 h-3" /> Processing</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200"><AlertCircle className="w-3 h-3" /> Pending</span>;
    }
  };

  const handleSendStatusWhatsApp = (order) => {
    const cleanPhone = (order.customerPhone || '').replace(/\D/g, '').slice(-10);
    const msg = `*AUDIO DEN - ORDER UPDATE #${order.id}*\n\nHello ${order.customerName},\nYour order is currently *${order.status?.toUpperCase() || 'CONFIRMED'}*.\n\n*Total Amount:* ₹${(order.totalAmount || 0).toLocaleString('en-IN')}\n*Blue Dart AWB:* ${order.trackingNumber || 'In allocation'}\n*Delivery Address:* ${order.shippingAddress}\n\nOur team is preparing your package. For queries, contact +91 9935102727.\nThank you!`;
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
            Order Management & Notifications
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Fulfill orders, dispatch WhatsApp updates, send customer emails, and print official GST invoices.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Live Store Orders: {orders.length}</span>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, customer name, phone, email..."
            className="w-full px-3.5 py-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">Order ID / Date</th>
                <th scope="col" className="px-4 py-3 text-left">Customer Details</th>
                <th scope="col" className="px-4 py-3 text-left">Items Ordered</th>
                <th scope="col" className="px-4 py-3 text-left">Total</th>
                <th scope="col" className="px-4 py-3 text-left">Status</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedOrder(ord)}
                        className="font-mono font-bold text-blue-600 hover:underline block text-left"
                      >
                        #{ord.id}
                      </button>
                      <span className="text-[10px] text-gray-400">{ord.date}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                      <span className="text-[11px] text-gray-500 block font-mono">{ord.customerPhone}</span>
                      <span className="text-[10px] text-gray-400 truncate max-w-xs block">{ord.shippingAddress}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-800">{ord.items?.length || 1} items</span>
                      <div className="text-[10px] text-gray-500 truncate max-w-xs">
                        {ord.items?.map((it) => it.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-black text-slate-900">
                      ₹{ord.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Inspect Order Details */}
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-700 transition-colors"
                          title="View Full Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* WhatsApp Customer */}
                        <button
                          onClick={() => handleSendStatusWhatsApp(ord)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                          title="Send WhatsApp Update to Customer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        {/* Print Invoice */}
                        <button
                          onClick={() => printGstInvoice(ord)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                          title="Print GST Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Status Select */}
                        <select
                          value={ord.status || 'Pending'}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className="p-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-amber-500 font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete order #${ord.id} (${ord.customerName || 'Customer'})? This action cannot be undone.`)) {
                              deleteOrder(ord.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-colors"
                          title="Delete Order"
                          aria-label={`Delete order ${ord.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-lg text-slate-900">
                    Order #{selectedOrder.id}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {selectedOrder.date} • Invoice: {selectedOrder.invoiceNumber || 'AD-INV-2026'}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                  Customer Information
                </span>
                <div className="font-bold text-sm text-slate-900">{selectedOrder.customerName}</div>
                <div className="text-gray-600">Mobile: <strong>+91 {selectedOrder.customerPhone}</strong></div>
                <div className="text-gray-600">Email: <strong>{selectedOrder.customerEmail}</strong></div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                  Shipping & Courier
                </span>
                <div className="font-semibold text-slate-800">{selectedOrder.shippingAddress}</div>
                <div className="text-gray-600 mt-1">Courier: <strong>{selectedOrder.courier || 'Blue Dart Express'}</strong></div>
                <div className="text-gray-600">AWB Tracking: <strong className="font-mono">{selectedOrder.trackingNumber || 'N/A'}</strong></div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Products in Order
              </h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {it.image && (
                        <img
                          src={it.image}
                          alt=""
                          className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 border border-gray-200"
                        />
                      )}
                      <div>
                        <div className="font-bold text-slate-900">{it.name}</div>
                        <div className="text-[11px] text-gray-500">
                          Qty: <strong>{it.quantity}</strong> × ₹{(it.price || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <div className="font-black text-slate-900 text-sm">
                      ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Payment Mode: {selectedOrder.paymentMethod}</span>
                <span className="text-emerald-400 font-bold">Status: {selectedOrder.paymentStatus}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block text-[11px]">Total Amount</span>
                <span className="text-xl font-heading font-black text-amber-400">
                  ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-gray-200">
              {/* WhatsApp Notification */}
              <button
                onClick={() => handleSendStatusWhatsApp(selectedOrder)}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Customer</span>
              </button>

              {/* Email Notification */}
              <a
                href={formatClientEmail(selectedOrder).mailtoUrl}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>

              {/* Print GST Invoice */}
              <button
                onClick={() => printGstInvoice(selectedOrder)}
                className="py-2 px-4 rounded-xl bg-gray-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print GST Invoice</span>
              </button>

              {/* Delete Order Button in Modal */}
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to permanently delete order #${selectedOrder.id}? This action cannot be undone.`)) {
                    deleteOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }
                }}
                className="py-2 px-4 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                title="Permanently Delete This Order"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Order</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="ml-auto py-2 px-4 rounded-xl border border-gray-300 text-slate-700 font-bold text-xs hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
