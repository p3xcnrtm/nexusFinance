import React, { useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';

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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    pendingWithdrawals: 0,
    pendingDeposits: 0,
    pendingKyc: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, txRes, kycRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/transactions'),
          fetch('/api/admin/kyc')
        ]);

        if (usersRes.ok && txRes.ok && kycRes.ok) {
          const users = await usersRes.json();
          const transactions = await txRes.json();
          const kycDocs = await kycRes.json();

          const totalDeposits = transactions
            .filter((t: any) => t.type === 'deposit' && t.status === 'Completed')
            .reduce((sum: number, t: any) => sum + t.amount, 0);

          const pendingWithdrawals = transactions.filter((t: any) => t.type === 'withdrawal' && t.status === 'Pending').length;
          const pendingDeposits = transactions.filter((t: any) => t.type === 'deposit' && t.status === 'Pending').length;
          const pendingKyc = kycDocs.filter((k: any) => k.status === 'Pending').length;

          setStats({
            totalUsers: users.length,
            totalDeposits,
            pendingWithdrawals,
            pendingDeposits,
            pendingKyc
          });

          // Format recent activity
          const activity = transactions.slice(0, 5).map((t: any) => ({
            action: t.type === 'deposit' ? 'Deposit Request' : 'Withdrawal Request',
            detail: `$${t.amount.toLocaleString()} ${t.asset} - Status: ${t.status}`,
            time: new Date(t.createdAt).toLocaleString(),
            type: t.status === 'Completed' ? 'success' : t.status === 'Pending' ? 'warning' : 'error'
          }));
          setRecentActivity(activity);
        }
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

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
          value={stats.totalUsers.toString()} 
          subtext="Registered accounts" 
          icon={Users} 
          color="text-blue-400" 
        />
        <StatCard 
          title="Total Deposits" 
          value={`$${stats.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          subtext="Approved volume" 
          icon={DollarSign} 
          color="text-emerald-400" 
        />
        <StatCard 
          title="Pending Withdrawals" 
          value={stats.pendingWithdrawals.toString()} 
          subtext="Requires approval" 
          icon={ArrowUpRight} 
          color="text-yellow-400" 
        />
        <StatCard 
          title="Pending KYC" 
          value={stats.pendingKyc.toString()} 
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
            {recentActivity.length > 0 ? recentActivity.map((item, i) => (
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
            )) : (
              <p className="text-slate-400 text-sm">No recent activity.</p>
            )}
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
                  <p className="text-white font-bold">Withdrawals</p>
                  <p className="text-xs text-slate-400">{stats.pendingWithdrawals} pending requests</p>
                </div>
              </div>
              <Link to="/admin/withdrawals" className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded hover:bg-blue-500/30">Review</Link>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold">Deposits</p>
                  <p className="text-xs text-slate-400">{stats.pendingDeposits} pending requests</p>
                </div>
              </div>
              <Link to="/admin/deposits" className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded hover:bg-blue-500/30">Review</Link>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold">KYC Verification</p>
                  <p className="text-xs text-slate-400">{stats.pendingKyc} pending requests</p>
                </div>
              </div>
              <Link to="/admin/kyc" className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded hover:bg-blue-500/30">Review</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
