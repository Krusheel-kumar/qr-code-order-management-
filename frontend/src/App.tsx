import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStoreSettings } from './api';
import { useMenuStore } from './store/useMenuStore';

// Screens
import SplashScreen from './pages/customer/SplashScreen';
import DiscoveryHome from './pages/customer/DiscoveryHome';
import PickupLocations from './pages/customer/PickupLocations';
import DeliveryOptions from './pages/customer/DeliveryOptions';
import CategoryHub from './pages/customer/CategoryHub';
import OffersHub from './pages/customer/OffersHub';
import FullMenu from './pages/customer/FullMenu';
import Cart from './pages/customer/Cart';
import OrderTracking from './pages/customer/OrderTracking';
import Profile from './pages/customer/Profile';

import AIChatScreen from './pages/customer/chat/AIChatScreen';

import BottomNavigation from './components/ui/BottomNavigation';
import FloatingCartButton from './components/ui/FloatingCartButton';
import FloatingAIButton from './components/ui/FloatingAIButton';
import SocialWidgets from './components/ui/SocialWidgets';

// Layout with Bottom Navigation
const MainLayout = () => (
  <div className="min-h-[100dvh] bg-[var(--color-background)] font-sans relative pb-[80px]">
    <Outlet />
    <SocialWidgets />
    <FloatingCartButton />
    <FloatingAIButton />
    <BottomNavigation />
  </div>
);

const StoreClosedOverlay = () => (
  <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
    <div className="w-24 h-24 mb-6 rounded-full bg-red-100 flex items-center justify-center">
      <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Store is currently closed</h1>
    <p className="text-[var(--color-text-secondary)] text-lg">
      We're taking a short break right now. Please check back later to place your order!
    </p>
  </div>
);

function App() {
  const [isStoreActive, setIsStoreActive] = useState(true);

  useEffect(() => {
    // Detect table number from QR code URL (e.g. ?table=5&storeId=2)
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    const storeParam = params.get('storeId');
    if (tableParam) {
      import('./store/useCartStore').then(m => {
        const state = m.useCartStore.getState();
        state.setTableNumber(tableParam);
        state.setOrderType('DINE_IN');
        if (storeParam) state.setStoreId(storeParam);
      });
    } else {
      import('./store/useCartStore').then(m => {
        // Clear it immediately and also wait for hydration to complete to avoid being overwritten
        const clearDineIn = () => {
          const state = m.useCartStore.getState();
          state.setTableNumber(''); // ALWAYS clear ghost table numbers if we aren't scanning a QR code!
          if (!state.orderType || state.orderType === 'DINE_IN') {
             state.setOrderType('PICKUP');
          }
        };
        clearDineIn();
        setTimeout(clearDineIn, 500); // Failsafe for hydration
      });
    }

    useMenuStore.getState().initializeMenu();
    useMenuStore.getState().startPolling();

    // Fetch store status dynamically
    const fetchStatus = () => {
      getStoreSettings().then(settings => {
        // Evaluate the boolean cleanly from the response
        if (settings && typeof settings.storeActive === 'boolean') {
          setIsStoreActive(settings.storeActive);
        } else {
          // Default to true if undefined, null, or missing
          setIsStoreActive(true); 
        }
      }).catch(console.error);
    };

    fetchStatus();
    // Poll every 15 seconds
    const interval = setInterval(fetchStatus, 15000);
    return () => {
      clearInterval(interval);
      useMenuStore.getState().stopPolling();
    };
  }, []);

  return (
    <>
      {!isStoreActive && <StoreClosedOverlay />}
      <Router>
        <Routes>
          {/* Screen 01 */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/pickup-locations" element={<PickupLocations />} />
          <Route path="/delivery-options" element={<DeliveryOptions />} />
          
          {/* Screens with Bottom Nav */}
          <Route element={<MainLayout />}>
            {/* Screen 02 - 08 */}
            <Route path="/home" element={<DiscoveryHome />} />
            
            {/* Screen 09 */}
            <Route path="/categories" element={<CategoryHub />} />
            <Route path="/offers" element={<OffersHub />} />
            
            {/* Screen 10 */}
            <Route path="/menu" element={<FullMenu />} />

            {/* Screen 17 */}
            <Route path="/cart" element={<Cart />} />
            
            {/* User Profile */}
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Full Screen Flows (No Bottom Nav) */}
          
          {/* AI Chatbot Flow */}
          <Route path="/quiz" element={<AIChatScreen />} />
          
          {/* Screen 18 */}
          <Route path="/tracking/:id" element={<OrderTracking />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
