import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, IndianRupee } from 'lucide-react';
import { getOrderHistory } from '../../api';

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

      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { name: 'Total Revenue (Today)', value: `₹${stats.revenue.toFixed(2)}`, icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Orders Today', value: stats.ordersToday.toString(), icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Active Customers (Today)', value: stats.activeCustomers.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Avg. Order Value', value: `₹${stats.avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {!loading && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Live
                </span>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for more complex analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96 flex flex-col items-center justify-center">
          <p className="text-gray-400 font-medium">Revenue Chart Coming Soon...</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96 flex flex-col items-center justify-center">
          <p className="text-gray-400 font-medium">Popular Items Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}
