import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const data = [
  { name: 'Bitcoin', value: 45000 },
  { name: 'Ethereum', value: 30000 },
  { name: 'USDT', value: 15000 },
  { name: 'Solana', value: 10000 },
];

const COLORS = ['#F7931A', '#627EEA', '#26A17B', '#00FFA3'];

export default function Portfolio() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Investments</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Portfolio Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6">Asset Allocation</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A1124', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Investment Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Total Value</h3>
            <p className="text-4xl font-bold text-white mb-2">$100,000.00</p>
            <p className="text-emerald-400 flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4" /> +15.4% this month
            </p>
          </div>

          <div className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Active Plans</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <p className="text-white font-bold">Crypto Growth Fund</p>
                  <p className="text-xs text-slate-400">Ends in 14 days</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">+12.5%</p>
                  <p className="text-xs text-slate-400">$5,620 Profit</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <p className="text-white font-bold">Stablecoin Yield</p>
                  <p className="text-xs text-slate-400">Ends in 30 days</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">+4.2%</p>
                  <p className="text-xs text-slate-400">$840 Profit</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Asset List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl"
      >
        <h3 className="text-xl font-bold text-white mb-6">Your Assets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Balance</th>
                <th className="pb-3 font-medium">Value (USD)</th>
                <th className="pb-3 font-medium">24h Change</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'Bitcoin', symbol: 'BTC', balance: '0.4521', value: '$44,500.20', change: '+2.4%' },
                { name: 'Ethereum', symbol: 'ETH', balance: '8.2400', value: '$29,800.50', change: '+1.8%' },
                { name: 'Tether', symbol: 'USDT', balance: '15,000.00', value: '$15,000.00', change: '0.0%' },
                { name: 'Solana', symbol: 'SOL', balance: '68.5000', value: '$9,946.20', change: '+4.2%' },
              ].map((asset, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <p className="text-white font-bold">{asset.name}</p>
                      <p className="text-xs text-slate-400">{asset.symbol}</p>
                    </div>
                  </td>
                  <td className="py-4 text-slate-300 font-mono">{asset.balance}</td>
                  <td className="py-4 text-white font-bold">{asset.value}</td>
                  <td className={`py-4 font-bold ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>{asset.change}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 bg-nexus-blue/20 text-nexus-blue rounded-lg hover:bg-nexus-blue/30 transition-colors" title="Deposit">
                        <ArrowDownLeft className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors" title="Withdraw">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
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
