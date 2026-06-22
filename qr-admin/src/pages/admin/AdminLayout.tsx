import { Outlet, NavLink } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import { Store, LayoutDashboard, Settings, Star, User, Bell, ShoppingBag, Coffee, Bot, Ticket, FileText } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { isStoreActive, toggleStoreActive, initializeStore } = useAdminStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Live Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'History', path: '/admin/history', icon: FileText },
    { name: 'Menu', path: '/admin/menu', icon: Coffee },
    { name: 'Discovery', path: '/admin/discovery', icon: Star },
    { name: 'AI Settings', path: '/admin/ai-settings', icon: Bot },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Store Settings', path: '/admin/store-settings', icon: Settings },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Store className="text-blue-600 w-6 h-6 mr-3" />
          <span className="text-gray-900 font-bold text-lg tracking-tight">
            QR Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center">
            {/* Can put breadcrumbs or page title here if needed, but keeping it clean */}
          </div>

          <div className="flex items-center gap-6">
            {/* Simple Store Toggle */}
            <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-gray-900">Pop O'Bob</span>
                <span className={`text-xs font-medium ${isStoreActive ? 'text-green-600' : 'text-red-500'}`}>
                  {isStoreActive ? 'Accepting Orders' : 'Store Offline'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isStoreActive}
                  onChange={toggleStoreActive}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
