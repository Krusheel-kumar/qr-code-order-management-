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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:bg-white print:p-0">
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
      
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto print:shadow-none print:w-full">
        {/* Controls Header (Hidden in print) */}
        <div className="no-print bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Invoice Preview</h2>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors">
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-invoice" ref={printRef} className="p-8 md:p-12 bg-white flex-1">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">POP O'BOB®</h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">Smart Cafe & Boba</p>
              <p className="text-gray-400 text-sm mt-1">123 Cafe Street, Food City</p>
              <p className="text-gray-400 text-sm">Phone: +91 98765 43210</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-200 uppercase tracking-widest">Invoice</h2>
              <p className="text-lg font-bold text-gray-900 mt-2">{order.orderNumber || `#${order.id.substring(0, 8).toUpperCase()}`}</p>
              <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Billed To</p>
              <p className="text-lg font-bold text-gray-900">{order.customerName || 'Guest Customer'}</p>
              {order.customerPhone && <p className="text-gray-600 text-sm mt-1">{order.customerPhone}</p>}
            </div>
            <div className="text-right bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dine-In Details</p>
              <p className="font-bold text-gray-900">Table {order.tableNumber || 'N/A'}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-y-2 border-gray-100">
                <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider w-12 text-center">Qty</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Item Description</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-24">Price</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => (
                <tr key={idx} className="group">
                  <td className="py-4 px-2 text-center font-bold text-gray-700 align-top">{item.quantity}</td>
                  <td className="py-4 px-2 align-top">
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    {item.customizations && <p className="text-sm text-gray-500 mt-0.5">{item.customizations}</p>}
                  </td>
                  <td className="py-4 px-2 text-right text-gray-600 align-top">₹{(item.subtotal / item.quantity).toFixed(2)}</td>
                  <td className="py-4 px-2 text-right font-bold text-gray-900 align-top">₹{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end border-t-2 border-gray-100 pt-6">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">₹{order.items?.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (GST Included)</span>
                <span className="font-medium">₹0.00</span>
              </div>
              {order.totalAmount < (order.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0) && (
                <div className="flex justify-between text-green-600">
                  <span>Loyalty Discount</span>
                  <span className="font-medium">-₹{((order.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0) - order.totalAmount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
                <span className="text-lg font-black text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            <p className="font-bold text-gray-800 mb-1">Thank you for dining with POP O'BOB®!</p>
            <p>Payment Status: <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>{order.paymentStatus}</span></p>
            {order.paymentReference && <p className="text-xs text-gray-400 mt-1 font-mono">{order.paymentReference}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
