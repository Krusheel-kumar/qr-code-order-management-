import { Link } from 'react-router-dom';
import { Home, Grid, Gift, ShoppingCart, User } from 'lucide-react';

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-100 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center max-w-md mx-auto h-[60px] px-6">
        <NavItem to="/home" icon={<Home size={22} />} label="Home" active />
        <NavItem to="/menu" icon={<Grid size={22} />} label="Menu" />
        <NavItem to="/offers" icon={<Gift size={22} />} label="Offers" />
        <NavItem to="/cart" icon={<ShoppingCart size={22} />} label="Cart" badge="2" />
        <NavItem to="/profile" icon={<User size={22} />} label="Account" />
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, active = false, badge }: { to: string, icon: React.ReactNode, label: string, active?: boolean, badge?: string }) {
  return (
    <Link to={to} className={`flex flex-col items-center justify-center space-y-1 w-14 transition-colors ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-500'}`}>
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center shadow-sm border border-white">
            {badge}
          </span>
        )}
      </div>
      <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </Link>
  );
}
