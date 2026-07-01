import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChefHat, CheckCircle2, Clock } from 'lucide-react';

// Using the same API_URL configured in index.ts
const API_URL = import.meta.env.VITE_API_URL || 'https://qr-code-order-management-production.up.railway.app/api';

export default function KDS() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/active`);
      setOrders(data);
    } catch (e) {
      console.error("Failed to fetch active orders", e);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}/status?status=${status}`);
      fetchOrders();
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const getColColor = (status: string) => {
    switch(status) {
      case 'PLACED': return 'bg-yellow-50 border-yellow-200';
      case 'PREPARING': return 'bg-blue-50 border-blue-200';
      case 'READY': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const renderColumn = (title: string, status: string, icon: any) => {
    const colOrders = orders.filter(o => o.status === status);
    
    return (
      <div className={`flex-1 rounded-2xl border p-4 flex flex-col h-[calc(100vh-100px)] ${getColColor(status)}`}>
        <h2 className="font-heading font-black text-xl mb-4 flex items-center gap-2">
          {icon} {title} <span className="bg-white px-2 py-0.5 rounded-full text-sm">{colOrders.length}</span>
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {colOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2 border-b border-gray-100 pb-2">
                <div>
                  <h3 className="font-black text-lg">Table #{order.tableNumber}</h3>
                  <p className="text-xs font-bold text-gray-500">Order #{order.id.split('-')[0].toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-800">{order.customerName}</p>
                  {order.customerPhone && <p className="text-xs text-gray-500 font-medium">{order.customerPhone}</p>}
                </div>
              </div>
              
              <div className="mb-3 space-y-2">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="font-black bg-gray-100 px-2 py-0.5 rounded">{item.quantity}x</span>
                    <div>
                      <p className="font-bold">{item.productName}</p>
                      {item.customizations && (
                        <p className="text-[11px] text-gray-500 leading-tight bg-gray-50 p-1 rounded mt-0.5">{item.customizations}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div>
                  {order.paymentStatus === 'PAID' ? (
                     <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded">PAID ({order.paymentReference})</span>
                  ) : (
                     <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">PAYMENT PENDING</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {status === 'PLACED' && (
                    <button onClick={() => updateStatus(order.id, 'PREPARING')} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all">Start</button>
                  )}
                  {status === 'PREPARING' && (
                    <button onClick={() => updateStatus(order.id, 'READY')} className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition-all">Done</button>
                  )}
                  {status === 'READY' && (
                    <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-black active:scale-95 transition-all">Deliver</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {colOrders.length === 0 && (
             <div className="h-32 flex items-center justify-center text-gray-400 font-bold text-sm opacity-50">
               No orders
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading font-black text-3xl text-gray-900 tracking-tight">Kitchen Display System</h1>
          <p className="text-gray-500 font-medium">Real-time Order Management</p>
        </div>
      </header>
      
      <div className="flex gap-6">
        {renderColumn('Incoming', 'PLACED', <Clock className="text-orange-500" />)}
        {renderColumn('Preparing', 'PREPARING', <ChefHat className="text-blue-500" />)}
        {renderColumn('Ready', 'READY', <CheckCircle2 className="text-green-500" />)}
      </div>
    </div>
  );
}
