import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowDownLeft, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

export default function Deposits() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/transactions');
      if (res.ok) {
        const data = await res.json();
        setDeposits(data.filter((t: any) => t.type === 'deposit'));
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to fetch deposits');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/transactions/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        const updatedDeposits = deposits.map(d => 
          d.id === id ? { ...d, status: 'Completed' } : d
        );
        setDeposits(updatedDeposits);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to approve deposit');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/transactions/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        const updatedDeposits = deposits.map(d => 
          d.id === id ? { ...d, status: 'Rejected' } : d
        );
        setDeposits(updatedDeposits);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to reject deposit');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Deposit Requests</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-nexus-navy border border-white/10 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">Loading deposits...</td>
              </tr>
            ) : deposits.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">No deposit requests found.</td>
              </tr>
            ) : deposits.map((deposit) => (
              <tr key={deposit.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-mono text-slate-300">{deposit.id}</td>
                <td className="px-6 py-4 font-medium text-white">
                  <div>{deposit.userName}</div>
                  <div className="text-xs text-slate-500">{deposit.userEmail}</div>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-400">${deposit.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-slate-400">{deposit.asset}</td>
                <td className="px-6 py-4 text-slate-400">{new Date(deposit.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    deposit.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                    deposit.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {deposit.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {deposit.status === 'Pending' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleApprove(deposit.id)}
                        className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors" 
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleReject(deposit.id)}
                        className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors" 
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {deposit.status !== 'Pending' && (
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
