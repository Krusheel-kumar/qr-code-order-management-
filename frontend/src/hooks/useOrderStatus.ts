import { useState, useEffect, useMemo } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { getOrderById } from '../api';

export function useOrderStatus() {
  const { orders, clearOrder, markTerminal } = useOrderStore();
  const [fetchedOrders, setFetchedOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter out dismissed orders upfront
  const activeAndRecentStoreOrders = useMemo(() => {
    return orders.filter(o => !o.isDismissed);
  }, [orders]);

  // Check 24 hour expiration & cleanup
  useEffect(() => {
    activeAndRecentStoreOrders.forEach(order => {
      if (order.terminalTimestamp) {
        const isExpired = Date.now() - order.terminalTimestamp > 24 * 60 * 60 * 1000;
        if (isExpired) {
          clearOrder(order.id);
        }
      }
    });
  }, [activeAndRecentStoreOrders, clearOrder]);

  // Fetch Orders
  useEffect(() => {
    if (activeAndRecentStoreOrders.length === 0) {
      setFetchedOrders([]);
      return;
    }

    let isMounted = true;
    
    const fetchAllOrders = async () => {
      try {
        if (fetchedOrders.length === 0) setIsLoading(true);
        
        // Fetch all orders concurrently
        const promises = activeAndRecentStoreOrders.map(o => getOrderById(o.id).catch(() => null));
        const results = await Promise.all(promises);
        
        if (isMounted) {
          const validOrders = results.filter(Boolean);
          setFetchedOrders(validOrders);
          
          // Check terminal states and mark them if not already marked
          validOrders.forEach(data => {
            const storeRef = activeAndRecentStoreOrders.find(o => o.id === data.id);
            const terminalStates = ['DELIVERED', 'COMPLETED', 'CANCELLED', 'REJECTED'];
            
            if (terminalStates.includes(data.status) && storeRef && !storeRef.terminalTimestamp) {
              markTerminal(data.id, Date.now());
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch multiple order statuses", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAllOrders();
    
    // Determine if we need to poll (if at least one order is NOT terminal)
    const hasActivePollingNeeded = activeAndRecentStoreOrders.some(o => !o.terminalTimestamp);
    
    let interval: ReturnType<typeof setInterval> | null = null;
    if (hasActivePollingNeeded) {
      interval = setInterval(fetchAllOrders, 3000);
    }
    
    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [activeAndRecentStoreOrders, markTerminal]);

  // Derive categories
  const activeOrders = fetchedOrders.filter(data => {
    const storeRef = activeAndRecentStoreOrders.find(o => o.id === data.id);
    return storeRef && !storeRef.terminalTimestamp;
  });

  const recentOrders = fetchedOrders.filter(data => {
    const storeRef = activeAndRecentStoreOrders.find(o => o.id === data.id);
    return storeRef && storeRef.terminalTimestamp;
  });

  const mostRecentOrder = fetchedOrders.length > 0 ? fetchedOrders[0] : null;
  const isMostRecentRecent = mostRecentOrder ? !!activeAndRecentStoreOrders.find(o => o.id === mostRecentOrder.id)?.terminalTimestamp : false;

  return { 
    fetchedOrders, 
    activeOrders, 
    recentOrders, 
    mostRecentOrder,
    isMostRecentRecent,
    isLoading 
  };
}
