import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

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

function App() {
  return (
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
  );
}

export default App;
