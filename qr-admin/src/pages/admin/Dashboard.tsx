import { TrendingUp, Users, ShoppingBag, IndianRupee } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Total Revenue', value: '₹12,426', change: '+14%', icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Orders Today', value: '142', change: '+5%', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Active Customers', value: '89', change: '+12%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Avg. Order Value', value: '₹345', change: '+2%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for more complex analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96 flex flex-col items-center justify-center">
          <p className="text-gray-400 font-medium">Revenue Chart Placeholder</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96 flex flex-col items-center justify-center">
          <p className="text-gray-400 font-medium">Popular Items List Placeholder</p>
        </div>
      </div>
    </div>
  );
}
