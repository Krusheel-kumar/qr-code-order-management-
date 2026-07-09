import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, IndianRupee, PieChart, Award } from 'lucide-react';
import { getOrderHistory, getLoyaltyAnalytics } from '../../api';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  createdAt: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersToday: 0,
    activeCustomers: 0,
    avgOrderValue: 0
  });

  const [loading, setLoading] = useState(true);
  const [loyaltyStats, setLoyaltyStats] = useState({
    pendingCount: 0,
    claimedCount: 0,
    expiredCount: 0,
    conversionRate: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const orders: Order[] = await getOrderHistory();
        
        // Calculate Today's Start Time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysOrders = orders.filter(o => new Date(o.createdAt) >= today);
        
        const revenue = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const ordersToday = todaysOrders.length;
        const avgOrderValue = ordersToday > 0 ? revenue / ordersToday : 0;

        // Calculate unique customers today
        const uniqueCustomers = new Set();
        todaysOrders.forEach(o => {
          if (o.customerPhone || o.customerName) {
            uniqueCustomers.add(o.customerPhone || o.customerName);
          }
        });

        setStats({
          revenue,
          ordersToday,
          activeCustomers: uniqueCustomers.size,
          avgOrderValue
        });

        const loyaltyData = await getLoyaltyAnalytics();
        if (loyaltyData) {
          setLoyaltyStats(loyaltyData);
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Using curated boba theme accent colors
  const statCards = [
    { 
      name: 'Total Revenue (Today)', 
      value: `₹${stats.revenue.toFixed(2)}`, 
      icon: IndianRupee, 
      color: 'text-[#2A1B16]', 
      bg: 'bg-[#FFD54F]/20 border border-[#FFD54F]/30' 
    },
    { 
      name: 'Orders Today', 
      value: stats.ordersToday.toString(), 
      icon: ShoppingBag, 
      color: 'text-[#5B6D49]', 
      bg: 'bg-[#A3B18A]/20 border border-[#A3B18A]/30' 
    },
    { 
      name: 'Active Customers', 
      value: stats.activeCustomers.toString(), 
      icon: Users, 
      color: 'text-[#B87A42]', 
      bg: 'bg-[#D4A373]/20 border border-[#D4A373]/30' 
    },
    { 
      name: 'Avg. Order Value', 
      value: `₹${stats.avgOrderValue.toFixed(2)}`, 
      icon: TrendingUp, 
      color: 'text-[#C26B5C]', 
      bg: 'bg-[#FFB5A7]/20 border border-[#FFB5A7]/30' 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div>
        <h1 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight">Dashboard</h1>
        <p className="text-[#8D6E63] font-medium mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="glass-panel p-6 rounded-2xl border border-[#FAEDCD] shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className={`p-3.5 rounded-xl ${stat.bg} shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {!loading && (
                <span className="bg-[#A3B18A]/15 text-[#5B6D49] border border-[#A3B18A]/30 font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                  Live
                </span>
              )}
            </div>
            <div className="mt-5">
              <h3 className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider">{stat.name}</h3>
              <p className="text-3xl font-heading font-black text-[#2A1B16] mt-1.5 tracking-tight">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-100 rounded-md animate-pulse"></span>
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-[#FAEDCD] shadow-xs flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#FFD54F]/20 text-[#2A1B16] rounded-full flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[#2A1B16] text-xl mb-0.5">Guest Loyalty Conversions</h3>
              <p className="text-sm text-[#8D6E63]">Track how many guest orders convert into registered accounts.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            <div className="bg-white/50 rounded-2xl p-4 border border-[#FAEDCD]">
              <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-1">Pending</p>
              <p className="text-2xl font-black text-[#B87A42]">{loyaltyStats.pendingCount}</p>
            </div>
            <div className="bg-white/50 rounded-2xl p-4 border border-[#FAEDCD]">
              <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-1">Claimed</p>
              <p className="text-2xl font-black text-[#5B6D49]">{loyaltyStats.claimedCount}</p>
            </div>
            <div className="bg-white/50 rounded-2xl p-4 border border-[#FAEDCD]">
              <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-1">Expired</p>
              <p className="text-2xl font-black text-[#C26B5C]">{loyaltyStats.expiredCount}</p>
            </div>
            <div className="bg-[#FFD54F]/10 rounded-2xl p-4 border border-[#FFD54F]/30">
              <p className="text-xs font-bold text-[#2A1B16] uppercase tracking-wider mb-1">Conversion Rate</p>
              <p className="text-2xl font-black text-[#2A1B16]">{loyaltyStats.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-[#FAEDCD] shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#A3B18A]/20 text-[#5B6D49] rounded-full flex items-center justify-center mb-4">
            <PieChart className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-[#2A1B16] text-lg mb-1">Popular Menu Items</h3>
          <p className="text-sm text-[#8D6E63] max-w-xs">
            Bestselling boba flavors and catering items charts are coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

