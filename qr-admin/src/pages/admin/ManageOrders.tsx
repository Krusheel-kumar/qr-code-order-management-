import { useState, useEffect, useRef } from 'react';
import alarmSound from '../../assets/alarm.mp3';
import { getActiveOrders, updateOrderStatus } from '../../api';
import { ChefHat, CheckCircle2, Clock, Volume2, VolumeX } from 'lucide-react';
import { STORES } from '../../data/stores';

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
  orderNumber?: string;
  customerName: string;
  customerPhone?: string;
  tableNumber: string;
  orderType?: string;
  storeId?: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoad = useRef(true);

  const fetchOrders = async () => {
    try {
      const data = await getActiveOrders();
      setOrders(data);
    } catch (e) {
      console.error('Failed to fetch orders', e);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Use a Web Worker for polling so that modern browsers don't throttle
    // the interval down to 1 minute when the tab is in the background.
    const workerCode = `
      let intervalId;
      self.onmessage = function(e) {
        if (e.data === 'start') {
          intervalId = setInterval(() => self.postMessage('tick'), 3000);
        } else if (e.data === 'stop') {
          clearInterval(intervalId);
        }
      };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = () => {
      fetchOrders();
    };
    worker.postMessage('start');
    
    return () => {
      worker.postMessage('stop');
      worker.terminate();
    };
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    // Optimistic UI update for instant feedback
    setOrders(prevOrders => prevOrders.map(o => o.id === id ? { ...o, status } : o));
    
    try {
      await updateOrderStatus(id, status);
      fetchOrders(); // Refresh to sync any other changes
    } catch (e) {
      console.error('Failed to update status', e);
      fetchOrders(); // Revert back to true state on failure
    }
  };

  const placedOrders = orders.filter(o => o.status === 'PLACED' || o.status === 'NEW');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    } else {
      const audio = new Audio(alarmSound);
      audio.play().catch(e => console.error("Audio fallback playback failed:", e));
    }

    // If the tab is in the background, trigger an OS-level notification
    if (document.hidden && "Notification" in window && Notification.permission === "granted") {
      new Notification("New Order Received!", {
        body: "A new order just arrived at Pop O Bob. Please check the Admin Panel.",
      });
    }
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      knownOrderIdsRef.current = new Set(placedOrders.map(o => o.id));
      return;
    }

    let hasNewOrder = false;
    placedOrders.forEach(o => {
      if (!knownOrderIdsRef.current.has(o.id)) {
        hasNewOrder = true;
        knownOrderIdsRef.current.add(o.id);
      }
    });

    if (hasNewOrder && isSoundEnabled) {
      playAlarm();
    }
  }, [placedOrders, isSoundEnabled]);

  const toggleSound = () => {
    if (!isSoundEnabled) {
      playAlarm(); // Play immediately to confirm and unlock browser audio
      
      // Request notification permissions when enabling alerts
      if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
    setIsSoundEnabled(!isSoundEnabled);
  };

  const renderOrderCard = (order: Order, nextStatus: string, nextStatusLabel: string, colorClass: string) => (
    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{order.orderNumber || `#${order.id.substring(0, 8).toUpperCase()}`}</h3>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>
        <div className={`px-2 py-1 rounded-lg text-xs font-bold ${order.orderType === 'PICKUP' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {order.orderType === 'PICKUP' ? 'PICKUP' : 'DINE-IN'}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-gray-800">{order.customerName}</p>
        <div className={`px-2 py-1 rounded-lg text-xs font-bold flex flex-col items-end ${colorClass}`}>
          {order.orderType === 'PICKUP' ? (
            <>
              <span>{order.customerPhone || 'No Phone'}</span>
              {order.storeId && (
                <span className="text-[10px] opacity-90 mt-0.5">
                  {STORES.find(s => s.id === order.storeId?.toString())?.name || `Store ${order.storeId}`}
                </span>
              )}
            </>
          ) : `Table ${order.tableNumber || '?'}`}
        </div>
      </div>
      
      <div className="flex-1 space-y-2 mb-4">
        {order.items?.map(item => (
          <div key={item.id} className="text-sm">
            <span className="font-bold">{item.quantity}x</span> {item.productName}
            {item.customizations && (
              <p className="text-xs text-gray-500 ml-5">{item.customizations}</p>
            )}
            {item.specialInstructions && (
              <p className="text-xs text-red-400 ml-5">Note: {item.specialInstructions}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <span className="font-bold">₹{order.totalAmount}</span>
        {nextStatus && (
          <button 
            onClick={() => handleStatusUpdate(order.id, nextStatus)}
            className={`px-4 py-2 rounded-lg text-white font-bold text-sm shadow-sm transition-transform active:scale-95 ${
              nextStatus === 'PREPARING' ? 'bg-orange-500 hover:bg-orange-600' :
              nextStatus === 'READY' ? 'bg-emerald-500 hover:bg-emerald-600' :
              'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {nextStatusLabel}
          </button>
        )}
        {!nextStatus && order.status === 'READY' && (
          <button 
            onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-bold text-sm shadow-sm transition-transform active:scale-95"
          >
            Mark Picked Up
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <audio ref={audioRef} src={alarmSound} preload="auto" />
      <div className="mb-6 shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 mt-1">Live Kitchen Display System (KDS)</p>
        </div>
        <button 
          onClick={toggleSound}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${isSoundEnabled ? 'bg-[#FFB300] text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
        >
          {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          {isSoundEnabled ? 'Alerts On' : 'Alerts Off'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 min-h-0 overflow-hidden">
        
        {/* PLACED COLUMN */}
        <div className="flex flex-col h-full bg-blue-50/50 rounded-xl border border-blue-100 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-blue-100 bg-blue-50 rounded-t-xl shrink-0">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              New Orders 
              <span className="bg-white px-2 py-0.5 rounded-md text-xs font-bold text-gray-700 shadow-sm ml-auto">
                {placedOrders.length}
              </span>
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            {placedOrders.map(o => renderOrderCard(o, 'PREPARING', 'Start Preparing', 'bg-blue-100 text-blue-700'))}
            {placedOrders.length === 0 && <div className="text-gray-400 text-center mt-10 p-4 border-2 border-dashed border-gray-200 rounded-lg text-sm">No new orders</div>}
          </div>
        </div>

        {/* PREPARING COLUMN */}
        <div className="flex flex-col h-full bg-orange-50/50 rounded-xl border border-orange-100 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-orange-100 bg-orange-50 rounded-t-xl shrink-0">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-600" />
              Preparing
              <span className="bg-white px-2 py-0.5 rounded-md text-xs font-bold text-gray-700 shadow-sm ml-auto">
                {preparingOrders.length}
              </span>
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            {preparingOrders.map(o => renderOrderCard(o, 'READY', 'Mark Ready', 'bg-orange-100 text-orange-700'))}
            {preparingOrders.length === 0 && <div className="text-gray-400 text-center mt-10 p-4 border-2 border-dashed border-gray-200 rounded-lg text-sm">Nothing preparing</div>}
          </div>
        </div>

        {/* READY COLUMN */}
        <div className="flex flex-col h-full bg-emerald-50/50 rounded-xl border border-emerald-100 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-emerald-100 bg-emerald-50 rounded-t-xl shrink-0">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Ready For Pickup
              <span className="bg-white px-2 py-0.5 rounded-md text-xs font-bold text-gray-700 shadow-sm ml-auto">
                {readyOrders.length}
              </span>
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            {readyOrders.map(o => renderOrderCard(o, '', '', 'bg-emerald-100 text-emerald-700'))}
            {readyOrders.length === 0 && <div className="text-gray-400 text-center mt-10 p-4 border-2 border-dashed border-gray-200 rounded-lg text-sm">No orders ready</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
