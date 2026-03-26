import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  PieChart, 
  Activity,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const barData = [
  { name: 'BTC', value: 4000 },
  { name: 'ETH', value: 3000 },
  { name: 'USDT', value: 2000 },
  { name: 'SOL', value: 2780 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Widget = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-nexus-gold/20 transition-all"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
      <Icon className="w-16 h-16" />
    </div>
    <div className="relative z-10">
      <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <div className="flex items-center gap-2 text-sm">
        <span className={`flex items-center ${change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
          {change.startsWith('+') ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownLeft className="w-4 h-4 mr-1" />}
          {change}
        </span>
        <span className="text-slate-500">vs last month</span>
      </div>
    </div>
  </motion.div>
);

export default function Overview() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-blue-200">Welcome back, here's what's happening with your portfolio.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-nexus-blue text-white rounded-lg hover:bg-nexus-blue/80 transition-colors flex items-center gap-2">
            <ArrowDownLeft className="w-4 h-4" /> Deposit
          </button>
          <button className="px-4 py-2 bg-nexus-navy border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Widget 
          title="Total Balance" 
          value="$124,592.00" 
          change="+12.5%" 
          icon={Wallet} 
          color="text-nexus-gold" 
        />
        <Widget 
          title="Total Profit" 
          value="$34,200.50" 
          change="+8.2%" 
          icon={TrendingUp} 
          color="text-emerald-400" 
        />
        <Widget 
          title="Active Investments" 
          value="12" 
          change="+2" 
          icon={Activity} 
          color="text-nexus-blue" 
        />
        <Widget 
          title="Total Deposits" 
          value="$85,000.00" 
          change="+5.0%" 
          icon={DollarSign} 
          color="text-purple-400" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Portfolio Performance</h3>
            <select className="bg-nexus-dark border border-white/10 rounded-lg px-3 py-1 text-sm text-slate-300 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0052FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A1124', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0052FF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Allocation Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6">Asset Allocation</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{fill: '#94a3b8'}} width={40} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#0A1124', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {barData.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-white font-bold">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <button className="text-nexus-gold text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 font-medium">Transaction ID</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { id: 'TRX-98234', type: 'Deposit', date: 'Oct 24, 2025', amount: '+$5,000.00', status: 'Completed' },
                { id: 'TRX-98233', type: 'Investment', date: 'Oct 22, 2025', amount: '-$2,500.00', status: 'Active' },
                { id: 'TRX-98232', type: 'Profit', date: 'Oct 20, 2025', amount: '+$124.50', status: 'Completed' },
                { id: 'TRX-98231', type: 'Withdrawal', date: 'Oct 18, 2025', amount: '-$1,000.00', status: 'Pending' },
              ].map((tx, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 text-slate-300 font-mono">{tx.id}</td>
                  <td className="py-4 text-white">{tx.type}</td>
                  <td className="py-4 text-slate-400">{tx.date}</td>
                  <td className={`py-4 font-bold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>{tx.amount}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                      tx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
