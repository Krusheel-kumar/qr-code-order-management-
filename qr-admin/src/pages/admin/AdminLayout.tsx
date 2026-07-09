import { Outlet, NavLink } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Store, LayoutDashboard, Settings, Star, User, Bell, ShoppingBag, Coffee, Bot, Ticket, FileText, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import brandLogo from '../../assets/Brand Emblem.png';

export default function AdminLayout() {
  const { isStoreActive, toggleStoreActive, initializeStore } = useAdminStore();
  const logout = useAuthStore((state) => state.logout);

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
    { name: 'QR & Tables', path: '/admin/qr-generator', icon: Store },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#FFFDF8] font-sans text-[#2A1B16] overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#FFF8E8] border-r border-[#FAEDCD] flex flex-col shrink-0 z-20 shadow-sm">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-[#FAEDCD] gap-2.5">
          <div className="w-8 h-8 drop-shadow-sm">
            <img src={brandLogo} alt="POP O'BOB Emblem" className="w-full h-full object-contain" />
          </div>
          <span className="text-[#2A1B16] font-heading font-black text-base tracking-wider">
            POP O'BOB®
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 border-l-4 ${
                  isActive
                    ? 'bg-[#FFD54F]/25 text-[#2A1B16] font-bold border-[#FFD54F]'
                    : 'text-[#8D6E63] hover:bg-[#FFFDF8] hover:text-[#2A1B16] border-transparent font-medium'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 shrink-0" />
              <span className="text-sm tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-[#FFF8E8]/70 backdrop-blur-md border-b border-[#FAEDCD] px-8 flex items-center justify-between shrink-0 z-10 shadow-xs">
          <div className="flex items-center">
            {/* Breadcrumbs or page title placeholder */}
          </div>

          <div className="flex items-center gap-6">
            {/* Simple Store Toggle */}
            <div className="flex items-center gap-3 border-r border-[#FAEDCD] pr-6">
              <div className="flex flex-col text-right">
                <span className="text-sm font-heading font-black text-[#2A1B16] tracking-wide">POP O'BOB®</span>
                <span className={`text-xs font-bold ${isStoreActive ? 'text-[#22C55E]' : 'text-red-500'}`}>
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
                <div className="w-11 h-6 bg-[#FAEDCD] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22C55E]"></div>
              </label>
            </div>

            <button className="relative p-2.5 text-[#8D6E63] hover:text-[#2A1B16] hover:bg-[#FFF8E8] rounded-xl transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <button 
              onClick={logout}
              className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all duration-200 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
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
