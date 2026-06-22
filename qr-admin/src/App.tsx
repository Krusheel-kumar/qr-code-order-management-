import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Admin Screens
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageOrders from './pages/admin/ManageOrders';
import ManageMenu from './pages/admin/ManageMenu';
import DiscoverySettings from './pages/admin/DiscoverySettings';
import AISettings from './pages/admin/AISettings';
import StoreSettings from './pages/admin/StoreSettings';
import ManageCoupons from './pages/admin/ManageCoupons';
import OrderHistory from './pages/admin/OrderHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Admin Flows */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="menu" element={<ManageMenu />} />
          <Route path="discovery" element={<DiscoverySettings />} />
          <Route path="ai-settings" element={<AISettings />} />
          <Route path="store-settings" element={<StoreSettings />} />
          <Route path="coupons" element={<ManageCoupons />} />
          <Route path="history" element={<OrderHistory />} />
          
          {/* Dummy routes for other sidebar items to prevent errors */}
          <Route path="profile" element={<div className="p-8">Profile settings...</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
