import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Screens
import SplashScreen from './pages/customer/SplashScreen';
import DiscoveryHome from './pages/customer/DiscoveryHome';
import CategoryHub from './pages/customer/CategoryHub';
import FullMenu from './pages/customer/FullMenu';
import Cart from './pages/customer/Cart';
import OrderTracking from './pages/customer/OrderTracking';

import QuizScreen from './pages/customer/experience/QuizScreen';
import PersonalityReveal from './pages/customer/experience/PersonalityReveal';
import RecommendationResult from './pages/customer/experience/RecommendationResult';

import BottomNavigation from './components/ui/BottomNavigation';
import FloatingCartButton from './components/ui/FloatingCartButton';

// Layout with Bottom Navigation
const MainLayout = () => (
  <div className="min-h-screen bg-[var(--color-background)] font-sans relative pb-[80px]">
    <Outlet />
    <FloatingCartButton />
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
        </Route>

        {/* Full Screen Flows (No Bottom Nav) */}
        
        {/* Screen 17 (Cart is full screen so nav doesn't block checkout button) */}
        <Route path="/cart" element={<Cart />} />
        
        {/* Screen 11, 12 removed for unified bottom sheet */}
        
        {/* Screen 13, 14 */}
        <Route path="/quiz" element={<QuizScreen />} />
        
        {/* Screen 15 */}
        <Route path="/personality" element={<PersonalityReveal />} />
        
        {/* Screen 16 */}
        <Route path="/recommendation" element={<RecommendationResult />} />
        
        {/* Screen 18 */}
        <Route path="/tracking/:id" element={<OrderTracking />} />

      </Routes>
    </Router>
  );
}

export default App;
