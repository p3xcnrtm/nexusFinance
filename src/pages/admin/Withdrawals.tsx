import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([
    { id: 'WDR-98234', user: 'John Doe', amount: '$2,500.00', asset: 'BTC', date: 'Oct 24, 2025', status: 'Pending' },
    { id: 'WDR-98233', user: 'Sarah Smith', amount: '$500.00', asset: 'USDT', date: 'Oct 22, 2025', status: 'Approved' },
    { id: 'WDR-98232', user: 'Mike Johnson', amount: '$1,000.00', asset: 'ETH', date: 'Oct 20, 2025', status: 'Rejected' },
    { id: 'WDR-98231', user: 'Emily Davis', amount: '$3,000.00', asset: 'SOL', date: 'Oct 18, 2025', status: 'Pending' },
  ]);

  const handleApprove = (id: string) => {
    const updatedWithdrawals = withdrawals.map(w => 
      w.id === id ? { ...w, status: 'Approved' } : w
    );
    setWithdrawals(updatedWithdrawals);
  };

  const handleReject = (id: string) => {
    const updatedWithdrawals = withdrawals.map(w => 
      w.id === id ? { ...w, status: 'Rejected' } : w
    );
    setWithdrawals(updatedWithdrawals);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Withdrawal Requests</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-nexus-navy border border-white/10 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-nexus-dark/50 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <th className="px-6 py-4 font-medium">Transaction ID</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Asset</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-mono text-slate-300">{withdrawal.id}</td>
                <td className="px-6 py-4 font-medium text-white">{withdrawal.user}</td>
                <td className="px-6 py-4 font-bold text-red-400">{withdrawal.amount}</td>
                <td className="px-6 py-4 text-slate-400">{withdrawal.asset}</td>
                <td className="px-6 py-4 text-slate-400">{withdrawal.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    withdrawal.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 
                    withdrawal.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {withdrawal.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {withdrawal.status === 'Pending' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleApprove(withdrawal.id)}
                        className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors" 
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleReject(withdrawal.id)}
                        className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors" 
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {withdrawal.status !== 'Pending' && (
                    <div className="flex justify-end">
                      <button className="p-1.5 text-slate-500 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
