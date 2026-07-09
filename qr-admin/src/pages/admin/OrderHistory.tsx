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
      case 'DELIVERED': return 'bg-[#A3B18A]/15 text-[#5B6D49] border-[#A3B18A]/30';
      case 'READY': return 'bg-[#FFD54F]/25 text-[#2A1B16] border-[#FFD54F]/40';
      case 'PREPARING': return 'bg-[#D4A373]/20 text-[#B87A42] border-[#D4A373]/30';
      case 'PLACED': return 'bg-[#FFB5A7]/25 text-[#C26B5C] border-[#FFB5A7]/30';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full font-sans pb-12">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight">Order History</h1>
          <p className="text-[#8D6E63] font-medium mt-1">View all past and present orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D6E63]/60" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[#FAEDCD] rounded-xl bg-white/80 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30 w-64 shadow-inner"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#FAEDCD] rounded-xl text-xs font-bold hover:bg-[#FFF8E8] text-[#8D6E63] hover:text-[#2A1B16] transition-colors cursor-pointer shadow-2xs">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel border border-[#FAEDCD] rounded-2xl shadow-xs overflow-hidden flex flex-col bg-[#FFFDF8]">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#FFF8E8]/60 border-b border-[#FAEDCD]/40 text-2xs font-bold text-[#8D6E63] uppercase tracking-widest shrink-0">
          <div className="col-span-2">Order ID & Date</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Table / Status</div>
          <div className="col-span-2">Payment</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-1 text-center">Details</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-[#2A1B16] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#8D6E63] italic">
              <FileText className="w-12 h-12 mb-2 opacity-20 text-[#8D6E63]" />
              <p className="text-sm font-semibold">No orders found matching your search.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#FAEDCD]/30 bg-transparent">
              {filteredOrders.map(order => {
                const isExpanded = expandedOrders.has(order.id);
                return (
                  <div key={order.id} className={`transition-colors ${isExpanded ? 'bg-[#FFD54F]/10' : 'hover:bg-white/45'}`}>
                    {/* Main Row */}
                    <div 
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer"
                      onClick={() => toggleExpand(order.id)}
                    >
                      <div className="col-span-2 flex flex-col">
                        <span className="font-heading font-black text-[#2A1B16] text-sm">{order.orderNumber || `#${order.id.substring(0, 8).toUpperCase()}`}</span>
                        <div className="flex items-center text-xs text-[#8D6E63] mt-1 gap-1 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-[#8D6E63]/60" />
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <div className="col-span-3 flex flex-col">
                        <span className="font-bold text-[#2A1B16] text-sm">{order.customerName || 'Guest'}</span>
                        {order.customerPhone && <span className="text-xs text-[#8D6E63] mt-0.5 font-mono">{order.customerPhone}</span>}
                      </div>
                      
                      <div className="col-span-2 flex flex-col items-start gap-1.5">
                        <span className="text-xs font-bold bg-[#FAEDCD]/50 text-[#2A1B16] px-2 py-0.5 rounded-lg border border-[#FAEDCD]/70">
                          {order.orderType === 'PICKUP' ? (
                            <span className="flex flex-col">
                              <span>PICKUP</span>
                              {order.storeId && (
                                <span className="text-[9px] font-black text-[#B87A42] uppercase tracking-wider mt-0.5">
                                  {STORES.find(s => s.id === order.storeId?.toString())?.name || `Store ${order.storeId}`}
                                </span>
                              )}
                            </span>
                          ) : `Table ${order.tableNumber || '?'}`}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="col-span-2 flex flex-col">
                        <span className={`text-xs font-bold ${order.paymentStatus === 'PAID' ? 'text-[#22C55E]' : 'text-[#D4A373]'}`}>
                          {order.paymentStatus}
                        </span>
                        {order.paymentReference && (
                          <span className="text-[10px] text-[#8D6E63]/60 mt-0.5 truncate max-w-full font-mono" title={order.paymentReference}>
                            {order.paymentReference}
                          </span>
                        )}
                      </div>
                      
                      <div className="col-span-2 text-right flex flex-col justify-center">
                        <span className="font-heading font-black text-base text-[#2A1B16]">₹{order.totalAmount}</span>
                        <span className="text-xs text-[#8D6E63] font-semibold mt-0.5">{order.items?.length || 0} items</span>
                      </div>
                      
                      <div className="col-span-1 flex justify-center items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedInvoice(order); }}
                          className="p-2 rounded-xl hover:bg-[#FFD54F]/25 text-[#2A1B16] transition-colors cursor-pointer"
                          title="View Invoice"
                        >
                          <FileText className="w-4.5 h-4.5" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-black/5 text-[#8D6E63] hover:text-[#2A1B16] transition-colors cursor-pointer">
                          {isExpanded ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details Area (Swiggy Style Order Summary) */}
                    {isExpanded && (
                      <div className="px-6 py-5 bg-[#FFF8E8]/20 border-t border-[#FAEDCD]/40 flex gap-8 shadow-inner">
                        <div className="flex-1 bg-white p-5 rounded-2xl border border-[#FAEDCD] shadow-xs">
                          <h4 className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-4 border-b border-[#FAEDCD]/40 pb-2">Order Items</h4>
                          <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <div className="flex gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-[#FAEDCD]/60 flex items-center justify-center font-black text-[#2A1B16] text-xs shrink-0 border border-[#FAEDCD]/80">
                                    {item.quantity}x
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#2A1B16]">{item.productName}</p>
                                    {item.customizations && (
                                      <p className="text-xs text-[#8D6E63] mt-0.5 bg-[#FFF8E8] px-2 py-0.5 rounded border border-[#FAEDCD]/30 inline-block font-semibold">{item.customizations}</p>
                                    )}
                                    {item.specialInstructions && (
                                      <p className="text-xs text-red-500 font-bold bg-red-50/50 border border-red-100/80 rounded-xl p-2 mt-1.5 flex items-start gap-1">Note: {item.specialInstructions}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="font-heading font-black text-[#2A1B16] text-sm">
                                  ₹{item.subtotal}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="w-72 bg-white p-5 rounded-2xl border border-[#FAEDCD] shadow-xs self-start">
                          <h4 className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-4 border-b border-[#FAEDCD]/40 pb-2">Bill Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-[#8D6E63] font-semibold">
                              <span>Item Total</span>
                              <span className="font-bold text-[#2A1B16]">₹{order.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0}</span>
                            </div>
                            <div className="flex justify-between text-[#8D6E63] font-semibold">
                              <span>Taxes & Charges</span>
                              <span className="font-bold text-[#2A1B16]">₹{Math.max(0, order.totalAmount - (order.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0))}</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-[#FAEDCD]/30 flex justify-between items-center">
                              <span className="font-bold text-[#2A1B16]">Grand Total</span>
                              <span className="font-heading font-black text-lg text-[#2A1B16]">₹{order.totalAmount}</span>
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

