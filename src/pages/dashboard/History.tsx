import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

export default function History() {
  const transactions = [
    { id: 'TRX-98234', type: 'Deposit', date: 'Oct 24, 2025', amount: '+$5,000.00', status: 'Completed', method: 'Bitcoin' },
    { id: 'TRX-98233', type: 'Investment', date: 'Oct 22, 2025', amount: '-$2,500.00', status: 'Active', method: 'Crypto Growth Fund' },
    { id: 'TRX-98232', type: 'Profit', date: 'Oct 20, 2025', amount: '+$124.50', status: 'Completed', method: 'Daily Yield' },
    { id: 'TRX-98231', type: 'Withdrawal', date: 'Oct 18, 2025', amount: '-$1,000.00', status: 'Pending', method: 'USDT (TRC20)' },
    { id: 'TRX-98230', type: 'Deposit', date: 'Oct 15, 2025', amount: '+$10,000.00', status: 'Completed', method: 'Bank Transfer' },
    { id: 'TRX-98229', type: 'Investment', date: 'Oct 12, 2025', amount: '-$5,000.00', status: 'Active', method: 'Stablecoin Yield' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Transaction History</h1>
        <div className="flex gap-2">
          <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <Filter className="w-5 h-5" />
          </button>
          <select className="bg-nexus-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none">
            <option>All Transactions</option>
            <option>Deposits</option>
            <option>Withdrawals</option>
            <option>Investments</option>
            <option>Profits</option>
          </select>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-nexus-dark/50 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Method/Plan</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {transactions.map((tx, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-slate-300 font-mono group-hover:text-nexus-gold transition-colors">{tx.id}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-2 ${
                      tx.type === 'Deposit' || tx.type === 'Profit' ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {tx.type === 'Deposit' || tx.type === 'Profit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{tx.date}</td>
                  <td className="px-6 py-4 text-slate-300">{tx.method}</td>
                  <td className={`px-6 py-4 font-bold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>{tx.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing 1 to 6 of 24 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-white/10 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-white/10 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
