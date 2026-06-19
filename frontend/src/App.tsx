import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStoreSettings } from './api';

// Screens
import SplashScreen from './pages/customer/SplashScreen';
import DiscoveryHome from './pages/customer/DiscoveryHome';
import CategoryHub from './pages/customer/CategoryHub';
import FullMenu from './pages/customer/FullMenu';
import Cart from './pages/customer/Cart';
import OrderTracking from './pages/customer/OrderTracking';

import AIChatScreen from './pages/customer/chat/AIChatScreen';

import BottomNavigation from './components/ui/BottomNavigation';
import FloatingCartButton from './components/ui/FloatingCartButton';
import FloatingAIButton from './components/ui/FloatingAIButton';

// Layout with Bottom Navigation
const MainLayout = () => (
  <div className="min-h-[100dvh] bg-[var(--color-background)] font-sans relative pb-[80px]">
    <Outlet />
    <FloatingCartButton />
    <FloatingAIButton />
    <BottomNavigation />
  </div>
);

const StoreClosedOverlay = () => (
  <div className="fixed inset-0 z-50 bg-[var(--color-background)] flex flex-col items-center justify-center p-6 text-center">
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
    // Detect table number from QR code URL (e.g. ?table=5)
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      import('./store/useCartStore').then(m => m.useCartStore.getState().setTableNumber(tableParam));
    }

    // Poll or fetch once. For now, fetch once on load and every 2s.
    const fetchStatus = () => {
      getStoreSettings().then(settings => {
        if (settings && settings.isStoreActive === false) {
          setIsStoreActive(false);
        } else {
          setIsStoreActive(true);
        }
      }).catch(console.error);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!isStoreActive && <StoreClosedOverlay />}
      <Router>
        <Routes>
          {/* Screen 01 */}
          <Route path="/" element={<SplashScreen />} />
          
          {/* Screens with Bottom Nav */}
          <Route element={<MainLayout />}>
            {/* Screen 02 - 08 */}
            <Route path="/home" element={<DiscoveryHome />} />
            
            {/* Screen 09 */}
            <Route path="/categories" element={<CategoryHub />} />
            
            {/* Screen 10 */}
            <Route path="/menu" element={<FullMenu />} />

            {/* Screen 17 */}
            <Route path="/cart" element={<Cart />} />
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
