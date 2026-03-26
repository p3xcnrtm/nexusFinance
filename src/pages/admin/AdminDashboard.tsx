import React from 'react';
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Activity,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-red-500/20 transition-all"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
      <Icon className="w-16 h-16" />
    </div>
    <div className="relative z-10">
      <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
          <p className="text-slate-400">Real-time platform statistics and pending actions.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20">
            <AlertCircle className="w-4 h-4" /> System Alert
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value="1,248" 
          subtext="+12 new today" 
          icon={Users} 
          color="text-blue-400" 
        />
        <StatCard 
          title="Total Deposits" 
          value="$4.2M" 
          subtext="Lifetime volume" 
          icon={DollarSign} 
          color="text-emerald-400" 
        />
        <StatCard 
          title="Pending Withdrawals" 
          value="8" 
          subtext="Requires approval" 
          icon={ArrowUpRight} 
          color="text-yellow-400" 
        />
        <StatCard 
          title="Pending KYC" 
          value="15" 
          subtext="Requires verification" 
          icon={ShieldCheck} 
          color="text-purple-400" 
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" /> Recent System Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'User Registration', detail: 'New user "JohnDoe" registered', time: '2 mins ago', type: 'info' },
              { action: 'Deposit Confirmed', detail: '$5,000.00 BTC deposit for User #8291', time: '15 mins ago', type: 'success' },
              { action: 'Withdrawal Request', detail: '$1,200.00 USDT withdrawal pending approval', time: '45 mins ago', type: 'warning' },
              { action: 'KYC Submitted', detail: 'User #9921 submitted ID documents', time: '1 hour ago', type: 'info' },
              { action: 'System Alert', detail: 'High traffic detected on API endpoint', time: '3 hours ago', type: 'error' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0">
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                  item.type === 'success' ? 'bg-emerald-500' : 
                  item.type === 'warning' ? 'bg-yellow-500' : 
                  item.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-white font-medium text-sm">{item.action}</p>
                  <p className="text-slate-400 text-xs">{item.detail}</p>
                </div>
                <span className="ml-auto text-xs text-slate-500 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6">Pending Approvals</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold">Withdrawal #9921</p>
                  <p className="text-xs text-slate-400">$2,500.00 (BTC) • User: alex_crypto</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded hover:bg-emerald-500/30">Approve</button>
                <button className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded hover:bg-red-500/30">Reject</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold">KYC Verification</p>
                  <p className="text-xs text-slate-400">User: sarah_investor • ID & Selfie</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded hover:bg-blue-500/30">Review</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold">Large Deposit Alert</p>
                  <p className="text-xs text-slate-400">$50,000.00 (USDT) • User: whale_01</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-slate-500/20 text-slate-400 text-xs font-bold rounded hover:bg-slate-500/30">Details</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
