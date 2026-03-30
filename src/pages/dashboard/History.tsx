import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

export default function History() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination and Filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('All Transactions');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/user/transactions');
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="text-white">Loading transactions...</div>;
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'All Transactions') return true;
    if (filterType === 'Deposits') return tx.type === 'deposit';
    if (filterType === 'Withdrawals') return tx.type === 'withdrawal';
    if (filterType === 'Investments') return tx.type === 'investment';
    if (filterType === 'Profits') return tx.type === 'profit';
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Transaction History</h1>
        <div className="flex gap-2">
          <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <Filter className="w-5 h-5" />
          </button>
          <select 
            value={filterType}
            onChange={handleFilterChange}
            className="bg-nexus-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none"
          >
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
                <th className="px-6 py-4 font-medium">Method/Asset</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((tx: any, i: number) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-slate-300 font-mono group-hover:text-nexus-gold transition-colors">{tx.id}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-2 capitalize ${
                        tx.type === 'deposit' || tx.type === 'profit' ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'profit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-300">{tx.asset || 'USD'}</td>
                    <td className={`px-6 py-4 font-bold ${tx.type === 'deposit' || tx.type === 'profit' ? 'text-emerald-400' : 'text-white'}`}>
                      {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                        tx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-white/10 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-white/10 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
