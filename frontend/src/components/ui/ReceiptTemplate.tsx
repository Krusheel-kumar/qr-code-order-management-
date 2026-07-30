import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { STORES } from '../../data/stores';

interface ReceiptTemplateProps {
  order: any; // The full order object
  onCallStore?: () => void;
}

export default function ReceiptTemplate({ order, onCallStore }: ReceiptTemplateProps) {
  if (!order) return null;

  const storeInfo = STORES.find(s => s.id === (order.storeId || '1'));
  
  // Format Date using native JS
  let dateFormatted = '';
  try {
    const d = new Date(order.createdAt);
    dateFormatted = d.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    dateFormatted = 'Unknown Date';
  }

  const getStatusColor = (status: string) => {
    const s = status?.toUpperCase() || '';
    if (s === 'COMPLETED' || s === 'DELIVERED') return 'text-green-600 bg-green-50';
    if (s === 'CANCELLED' || s === 'REJECTED') return 'text-red-600 bg-red-50';
    if (s === 'READY') return 'text-[#D4AF37] bg-[#FFFBF2]';
    return 'text-blue-600 bg-blue-50';
  };

  const getStatusText = (status: string) => {
    const s = status?.toUpperCase() || '';
    if (s === 'PLACED' || s === 'NEW') return 'Order Placed';
    if (s === 'PREPARING') return 'Preparing';
    if (s === 'READY') return 'Ready For Pickup';
    if (s === 'DELIVERED' || s === 'COMPLETED') return 'Completed';
    if (s === 'CANCELLED') return 'Cancelled';
    return s;
  };

  return (
    <div id="receipt-container" className="bg-white max-w-md w-full mx-auto relative rounded-b-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
      {/* Receipt Header (Zig Zag edge top) */}
      <div className="relative bg-[#1A0B05] text-white p-6 pt-8 pb-10 text-center rounded-t-[24px]">
        <img src="/assets/horizontal_logo_dark.png" alt="POP O'BOB" className="h-8 mx-auto mb-4" onError={(e) => { e.currentTarget.src = '/assets/horizontal_logo.png'; }} />
        <h2 className="font-heading font-black text-2xl mb-1">{storeInfo?.name || "POP O'BOB®"}</h2>
        <p className="text-gray-400 text-sm">{storeInfo?.address || 'Film Nagar, Hyderabad'}</p>
        <p className="text-gray-400 text-sm mt-1">{storeInfo?.phone || '+91 9999999999'}</p>
        
        <div className="mt-6 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
          <span className="text-sm font-medium text-gray-300">Order No:</span>
          <span className="font-black tracking-wider text-[#D4AF37]">
            #{order.orderNumber || order.id?.substring(0, 5)}
          </span>
        </div>
      </div>

      {/* Receipt Body */}
      <div className="p-6 relative bg-white">
        {/* Status Badge */}
        <div className="flex justify-center -mt-10 mb-6 relative z-10">
          <div className={`px-6 py-2 rounded-full border border-gray-100 shadow-md flex items-center gap-2 font-black text-sm uppercase tracking-widest ${getStatusColor(order.status)}`}>
            {order.status === 'COMPLETED' || order.status === 'DELIVERED' ? (
              <CheckCircle2 size={16} />
            ) : order.status === 'CANCELLED' ? (
              <AlertCircle size={16} />
            ) : (
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            )}
            {getStatusText(order.status)}
          </div>
        </div>

        {/* Order Meta Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1">Date & Time</p>
            <p className="font-bold text-[#1A0B05]">{dateFormatted}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 font-medium mb-1">Order Type</p>
            <p className="font-bold text-[#1A0B05]">
              {order.orderType === 'PICKUP' ? 'Store Pickup' : order.orderType === 'DINE_IN' ? 'Dine In' : 'Delivery'}
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Customer Details</p>
          <p className="font-bold text-[#1A0B05]">{order.customerName || order.user?.username || 'Guest Customer'}</p>
          {(order.customerPhone || order.user?.phoneNumber) && (
            <p className="text-sm text-gray-600 font-medium mt-1">{order.customerPhone || order.user?.phoneNumber}</p>
          )}
          {order.user?.email && (
            <p className="text-sm text-gray-600 font-medium mt-1">{order.user?.email}</p>
          )}
        </div>

        {/* Items List */}
        <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-6">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">Order Items</p>
          <div className="space-y-4">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center font-black text-xs text-gray-600 shrink-0 mt-0.5">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-bold text-[#1A0B05] text-[15px]">{item.productName}</p>
                    {item.customizationsList && item.customizationsList.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1 font-medium leading-tight">
                        {item.customizationsList.map((c: any) => c.name).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="font-black text-[#1A0B05] shrink-0 pl-4">
                  ₹{(item.subtotal || 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Details */}
        <div className="border-t-2 border-dashed border-gray-200 pt-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Subtotal</span>
            <span className="font-bold text-[#1A0B05]">₹{(order.subtotalAmount || 0).toFixed(2)}</span>
          </div>
          
          {(order.couponDiscount > 0 || order.walletDiscount > 0 || order.discountTotal > 0) && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="font-medium">Total Discount</span>
              <span className="font-bold">-₹{(order.discountTotal || (order.couponDiscount || 0) + (order.walletDiscount || 0)).toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Taxes</span>
            <span className="font-bold text-[#1A0B05]">₹{(order.taxAmount || 0).toFixed(2)}</span>
          </div>

          {order.packingChargeAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">Packing Charge</span>
              <span className="font-bold text-[#1A0B05]">₹{(order.packingChargeAmount || 0).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="border-t-2 border-[#1A0B05] pt-4 mb-6 flex justify-between items-center">
          <span className="font-black text-lg text-[#1A0B05] uppercase tracking-widest">Grand Total</span>
          <span className="font-black text-2xl text-[#D4AF37]">₹{(order.totalAmount || order.total || 0).toFixed(2)}</span>
        </div>

        {/* Payment Details */}
        <div className="bg-[#F8F9FA] rounded-xl p-4 mb-6 flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Payment</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="font-bold text-[#1A0B05] text-sm">
                {order.paymentStatus === 'PAID' ? 'Success (Online)' : (order.paymentStatus || 'Success')}
              </span>
            </div>
          </div>
          {order.paymentReference && (
            <div className="text-right">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Txn ID</p>
              <p className="font-bold text-[#1A0B05] text-xs font-mono">{order.paymentReference}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="text-center pb-2">
          <p className="text-sm font-black text-gray-400 mb-4 tracking-widest uppercase">Thank you for visiting!</p>
          
          <button 
            onClick={() => onCallStore ? onCallStore() : window.open(`tel:${storeInfo?.phone || '+919999999999'}`, '_self')}
            className="w-full py-4 bg-white border-2 border-gray-100 hover:border-gray-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-[#1A0B05] transition-all active:scale-[0.98]"
          >
            <Phone size={18} className="text-[#D4AF37]" />
            Need Help? Call Store
          </button>
        </div>
      </div>
    </div>
  );
}
