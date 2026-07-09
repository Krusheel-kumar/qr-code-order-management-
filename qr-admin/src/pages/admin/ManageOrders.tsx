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
        body: "A new order just arrived at POP O'BOB®. Please check the Admin Panel.",
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

  const renderOrderCard = (order: Order, nextStatus: string, nextStatusLabel: string) => (
    <div key={order.id} className="glass-panel rounded-2xl border border-[#FAEDCD] p-5 mb-4 flex flex-col hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-heading font-black text-[#2A1B16] text-lg">{order.orderNumber || `#${order.id.substring(0, 8).toUpperCase()}`}</h3>
          <p className="text-xs text-[#8D6E63] font-semibold mt-0.5">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider ${order.orderType === 'PICKUP' ? 'bg-[#FFB5A7]/25 text-[#C26B5C] border border-[#FFB5A7]/30' : 'bg-[#FFD54F]/25 text-[#2A1B16] border border-[#FFD54F]/30'}`}>
          {order.orderType === 'PICKUP' ? 'PICKUP' : 'DINE-IN'}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <p className="font-bold text-[#2A1B16] text-sm">{order.customerName}</p>
        <div className={`px-2 py-0.5 rounded-lg text-xs font-semibold flex flex-col items-end`}>
          {order.orderType === 'PICKUP' ? (
            <>
              <span className="text-[#8D6E63] font-mono">{order.customerPhone || 'No Phone'}</span>
              {order.storeId && (
                <span className="text-[9px] font-black text-[#B87A42] uppercase tracking-wider mt-0.5">
                  {STORES.find(s => s.id === order.storeId?.toString())?.name || `Store ${order.storeId}`}
                </span>
              )}
            </>
          ) : (
            <span className="bg-[#A3B18A]/15 text-[#5B6D49] border border-[#A3B18A]/30 px-2 py-0.5 rounded-lg font-bold text-[11px]">
              Table {order.tableNumber || '?'}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 space-y-2.5 mb-5 border-t border-[#FAEDCD]/50 pt-3">
        {order.items?.map(item => (
          <div key={item.id} className="text-sm text-[#2A1B16] font-medium leading-relaxed">
            <span className="font-black bg-[#FAEDCD]/60 px-1.5 py-0.5 rounded mr-2 text-xs text-[#2A1B16]">{item.quantity}x</span> 
            {item.productName}
            {item.customizations && (
              <p className="text-xs text-[#8D6E63] italic ml-7 mt-1 bg-[#FFF8E8] px-2 py-0.5 rounded border border-[#FAEDCD]/30 inline-block">{item.customizations}</p>
            )}
            {item.specialInstructions && (
              <p className="text-xs text-red-500 font-bold bg-red-50/50 border border-red-100/80 rounded-xl p-2.5 mt-1.5 ml-7">
                Note: {item.specialInstructions}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#FAEDCD]/40">
        <span className="font-heading font-black text-lg text-[#2A1B16]">₹{order.totalAmount}</span>
        {nextStatus && (
          <button 
            onClick={() => handleStatusUpdate(order.id, nextStatus)}
            className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer ${
              nextStatus === 'PREPARING' ? 'bg-[#D4A373] hover:bg-[#C28C5C]' :
              nextStatus === 'READY' ? 'bg-[#A3B18A] hover:bg-[#8F9F76]' :
              'bg-[#2A1B16] hover:bg-[#3D2921]'
            }`}
          >
            {nextStatusLabel}
          </button>
        )}
        {!nextStatus && order.status === 'READY' && (
          <button 
            onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
            className="px-4 py-2 rounded-xl bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Mark Picked Up
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans">
      <audio ref={audioRef} src={alarmSound} preload="auto" />
      
      {/* KDS Title Header */}
      <div className="mb-6 shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight">Manage Orders</h1>
          <p className="text-[#8D6E63] font-medium mt-1">Live Kitchen Display System (KDS)</p>
        </div>
        <button 
          onClick={toggleSound}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
            isSoundEnabled 
              ? 'bg-[#FFD54F] text-[#2A1B16] border border-[#FFD54F]/50 shadow-sm' 
              : 'bg-[#FAEDCD]/50 text-[#8D6E63] border border-transparent hover:bg-[#FAEDCD] hover:text-[#2A1B16]'
          }`}
        >
          {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          {isSoundEnabled ? 'Alerts On' : 'Alerts Off'}
        </button>
      </div>

      {/* KDS Columns Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
        
        {/* PLACED COLUMN */}
        <div className="flex flex-col h-full bg-[#FFF8E8]/30 rounded-2xl border border-[#FAEDCD]/60 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-[#FAEDCD]/60 bg-[#FFD54F]/10 rounded-t-2xl shrink-0 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2A1B16]" />
            <h2 className="font-heading font-bold text-sm text-[#2A1B16]">
              New Orders 
            </h2>
            <span className="bg-[#2A1B16] text-[#FFD54F] px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm ml-auto">
              {placedOrders.length}
            </span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
            {placedOrders.map(o => renderOrderCard(o, 'PREPARING', 'Start Preparing'))}
            {placedOrders.length === 0 && (
              <div className="text-[#8D6E63]/70 text-center mt-12 p-6 border-2 border-dashed border-[#FAEDCD] rounded-2xl text-xs font-semibold">
                No new orders
              </div>
            )}
          </div>
        </div>

        {/* PREPARING COLUMN */}
        <div className="flex flex-col h-full bg-[#FFF8E8]/30 rounded-2xl border border-[#FAEDCD]/60 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-[#FAEDCD]/60 bg-[#D4A373]/10 rounded-t-2xl shrink-0 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#B87A42]" />
            <h2 className="font-heading font-bold text-sm text-[#2A1B16]">
              Preparing
            </h2>
            <span className="bg-[#2A1B16] text-[#FFD54F] px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm ml-auto">
              {preparingOrders.length}
            </span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
            {preparingOrders.map(o => renderOrderCard(o, 'READY', 'Mark Ready'))}
            {preparingOrders.length === 0 && (
              <div className="text-[#8D6E63]/70 text-center mt-12 p-6 border-2 border-dashed border-[#FAEDCD] rounded-2xl text-xs font-semibold">
                Nothing preparing
              </div>
            )}
          </div>
        </div>

        {/* READY COLUMN */}
        <div className="flex flex-col h-full bg-[#FFF8E8]/30 rounded-2xl border border-[#FAEDCD]/60 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-[#FAEDCD]/60 bg-[#A3B18A]/10 rounded-t-2xl shrink-0 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#5B6D49]" />
            <h2 className="font-heading font-bold text-sm text-[#2A1B16]">
              Ready For Pickup
            </h2>
            <span className="bg-[#2A1B16] text-[#FFD54F] px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm ml-auto">
              {readyOrders.length}
            </span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
            {readyOrders.map(o => renderOrderCard(o, '', ''))}
            {readyOrders.length === 0 && (
              <div className="text-[#8D6E63]/70 text-center mt-12 p-6 border-2 border-dashed border-[#FAEDCD] rounded-2xl text-xs font-semibold">
                No orders ready
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
