import { useRef } from 'react';
import { Printer } from 'lucide-react';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  customizations: string;
  specialInstructions: string;
}

export interface InvoiceOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  tableNumber: string;
  paymentReference: string;
  paymentStatus: string;
  status: string;
  totalAmount: number;
  subtotalAmount?: number;
  couponDiscount?: number;
  walletDiscount?: number;
  discountTotal?: number;
  taxAmount?: number;
  taxRateApplied?: number;
  packingChargeAmount?: number;
  packingChargeApplied?: boolean;
  createdAt: string;
  items: OrderItem[];
}

export default function InvoiceView({ order, onClose }: { order: InvoiceOrder; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // We add print-specific styles via a style tag so it formats beautifully on paper
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:bg-white print:p-0 font-sans">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-[#FAEDCD] print:border-none print:shadow-none print:w-full">
        {/* Controls Header (Hidden in print) */}
        <div className="no-print bg-[#FFF8E8] px-6 py-4 border-b border-[#FAEDCD] flex justify-between items-center shrink-0">
          <h2 className="text-base font-heading font-bold text-[#2A1B16]">Invoice Preview</h2>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2.5 text-xs font-bold text-[#8D6E63] hover:bg-gray-100 rounded-xl transition-all cursor-pointer">
              Cancel
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95">
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-invoice" ref={printRef} className="p-8 md:p-12 bg-white flex-1">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#FAEDCD]/60 pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-heading font-black text-[#B87A42] tracking-tight">POP O'BOB®</h1>
              <p className="text-[#8D6E63] mt-1 text-sm font-semibold">Smart Cafe & Boba</p>
              <p className="text-[#8D6E63]/80 text-xs mt-1">123 Cafe Street, Food City</p>
              <p className="text-[#8D6E63]/80 text-xs">Phone: +91 98765 43210</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-heading font-bold text-[#FAEDCD] uppercase tracking-widest leading-none">Invoice</h2>
              <p className="text-lg font-heading font-black text-[#2A1B16] mt-2.5">{order.orderNumber || `#${order.id.substring(0, 8).toUpperCase()}`}</p>
              <p className="text-xs text-[#8D6E63] mt-1 font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-1">Billed To</p>
              <p className="text-lg font-black text-[#2A1B16]">{order.customerName || 'Guest Customer'}</p>
              {order.customerPhone && <p className="text-[#8D6E63] text-sm mt-1 font-semibold">{order.customerPhone}</p>}
            </div>
            <div className="text-right bg-[#FFF8E8]/40 px-4 py-2.5 rounded-xl border border-[#FAEDCD]/60">
              <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-1">Dine-In Details</p>
              <p className="font-bold text-[#2A1B16]">Table {order.tableNumber || 'N/A'}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-y border-[#FAEDCD]/60">
                <th className="py-3 px-2 text-2xs font-bold text-[#8D6E63] uppercase tracking-wider w-12 text-center">Qty</th>
                <th className="py-3 px-2 text-2xs font-bold text-[#8D6E63] uppercase tracking-wider">Item Description</th>
                <th className="py-3 px-2 text-2xs font-bold text-[#8D6E63] uppercase tracking-wider text-right w-24">Price</th>
                <th className="py-3 px-2 text-2xs font-bold text-[#8D6E63] uppercase tracking-wider text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAEDCD]/30">
              {order.items?.map((item, idx) => (
                <tr key={idx} className="group">
                  <td className="py-4 px-2 text-center font-bold text-[#2A1B16] align-top">{item.quantity}</td>
                  <td className="py-4 px-2 align-top">
                    <p className="font-bold text-[#2A1B16]">{item.productName}</p>
                    {item.customizations && <p className="text-xs text-[#8D6E63] mt-0.5 font-semibold bg-[#FFF8E8]/45 px-2 py-0.5 rounded inline-block border border-[#FAEDCD]/20">{item.customizations}</p>}
                  </td>
                  <td className="py-4 px-2 text-right text-[#8D6E63] align-top font-medium">₹{(item.subtotal / item.quantity).toFixed(2)}</td>
                  <td className="py-4 px-2 text-right font-bold text-[#2A1B16] align-top">₹{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end border-t border-[#FAEDCD]/60 pt-6">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-[#8D6E63] font-semibold text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-[#2A1B16]">₹{(order.subtotalAmount || order.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0).toFixed(2)}</span>
              </div>
              
              {!!order.couponDiscount && order.couponDiscount > 0 && (
                <div className="flex justify-between text-[#22C55E] font-bold text-sm">
                  <span>Coupon Discount</span>
                  <span>-₹{order.couponDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {!!order.walletDiscount && order.walletDiscount > 0 && (
                <div className="flex justify-between text-[#22C55E] font-bold text-sm">
                  <span>Loyalty Points Used</span>
                  <span>-₹{order.walletDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-[#8D6E63] font-semibold text-sm">
                <span>Tax {order.taxRateApplied ? `(${order.taxRateApplied}%)` : '(GST Included)'}</span>
                <span className="font-bold text-[#2A1B16]">₹{(order.taxAmount || 0).toFixed(2)}</span>
              </div>
              
              {!!order.packingChargeApplied && !!order.packingChargeAmount && order.packingChargeAmount > 0 && (
                <div className="flex justify-between text-[#8D6E63] font-semibold text-sm">
                  <span>Packing Charge</span>
                  <span className="font-bold text-[#2A1B16]">₹{order.packingChargeAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t border-[#FAEDCD]/60 pt-3 mt-3">
                <span className="text-lg font-bold text-[#2A1B16]">Total</span>
                <span className="text-2xl font-heading font-black text-[#2A1B16]">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-[#FAEDCD]/40 text-center text-sm text-[#8D6E63]">
            <p className="font-bold text-[#2A1B16] mb-1">Thank you for dining with POP O'BOB®!</p>
            <p className="font-semibold">Payment Status: <span className={`font-black ${order.paymentStatus === 'PAID' ? 'text-[#22C55E]' : 'text-[#D4A373]'}`}>{order.paymentStatus}</span></p>
            {order.paymentReference && <p className="text-xs text-[#8D6E63]/60 mt-1.5 font-mono">{order.paymentReference}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

