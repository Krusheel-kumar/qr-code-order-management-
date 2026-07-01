import { useState, useEffect } from 'react';
import { getOrderHistory } from '../../api';
import { STORES } from '../../data/stores';
import { Search, ChevronDown, ChevronUp, Calendar, Filter, FileText } from 'lucide-react';

import InvoiceView from './InvoiceView';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  customizations: string;
  specialInstructions: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  tableNumber: string;
  orderType?: string;
  storeId?: number;
  paymentReference: string;
  paymentStatus: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getOrderHistory();
      setOrders(data);
    } catch (e) {
      console.error('Failed to fetch order history', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedOrders(newExpanded);
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'READY': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PREPARING': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'PLACED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-500 mt-1">View all past and present orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 shadow-sm transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
          <div className="col-span-2">Order ID & Date</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Table / Status</div>
          <div className="col-span-2">Payment</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-1 text-center">Details</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <FileText className="w-12 h-12 mb-2 opacity-20" />
              <p>No orders found matching your search.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredOrders.map(order => {
                const isExpanded = expandedOrders.has(order.id);
                return (
                  <div key={order.id} className={`transition-colors ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                    {/* Main Row */}
                    <div 
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer"
                      onClick={() => toggleExpand(order.id)}
                    >
                      <div className="col-span-2 flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">{order.orderNumber || `#${order.id.substring(0, 8).toUpperCase()}`}</span>
                        <div className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <div className="col-span-3 flex flex-col">
                        <span className="font-semibold text-gray-800 text-sm">{order.customerName || 'Guest'}</span>
                        {order.customerPhone && <span className="text-xs text-gray-500 mt-0.5">{order.customerPhone}</span>}
                      </div>
                      
                      <div className="col-span-2 flex flex-col items-start gap-1.5">
                        <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200">
                          {order.orderType === 'PICKUP' ? (
                            <span className="flex flex-col">
                              <span>PICKUP</span>
                              {order.storeId && (
                                <span className="text-[10px] font-bold text-indigo-600">
                                  {STORES.find(s => s.id === order.storeId?.toString())?.name || `Store ${order.storeId}`}
                                </span>
                              )}
                            </span>
                          ) : `Table ${order.tableNumber || '?'}`}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="col-span-2 flex flex-col">
                        <span className={`text-xs font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-orange-500'}`}>
                          {order.paymentStatus}
                        </span>
                        {order.paymentReference && (
                          <span className="text-[10px] text-gray-400 mt-0.5 truncate max-w-full font-mono" title={order.paymentReference}>
                            {order.paymentReference}
                          </span>
                        )}
                      </div>
                      
                      <div className="col-span-2 text-right flex flex-col justify-center">
                        <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{order.items?.length || 0} items</span>
                      </div>
                      
                      <div className="col-span-1 flex justify-center items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedInvoice(order); }}
                          className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                          title="View Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details Area (Swiggy Style Order Summary) */}
                    {isExpanded && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 shadow-inner flex gap-8">
                        <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Order Items</h4>
                          <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <div className="flex gap-3">
                                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs shrink-0 border border-gray-200">
                                    {item.quantity}x
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">{item.productName}</p>
                                    {item.customizations && (
                                      <p className="text-xs text-gray-500 mt-0.5">{item.customizations}</p>
                                    )}
                                    {item.specialInstructions && (
                                      <p className="text-xs text-red-500 mt-0.5 italic">Note: {item.specialInstructions}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="font-bold text-gray-900">
                                  ₹{item.subtotal}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="w-72 bg-white p-5 rounded-xl border border-gray-200 shadow-sm self-start">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Bill Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                              <span>Item Total</span>
                              <span className="font-medium">₹{order.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Taxes & Charges</span>
                              <span className="font-medium">₹{Math.max(0, order.totalAmount - (order.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0))}</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between items-center">
                              <span className="font-bold text-gray-900">Grand Total</span>
                              <span className="font-black text-lg text-gray-900">₹{order.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceView order={selectedInvoice as any} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
}
