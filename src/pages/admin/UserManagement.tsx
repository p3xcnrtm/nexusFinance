import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MoreVertical, Ban, Edit, DollarSign, CheckCircle } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', balance: '$12,450.00', status: 'Active', kyc: 'Verified' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', balance: '$5,200.50', status: 'Active', kyc: 'Pending' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', balance: '$0.00', status: 'Suspended', kyc: 'Unverified' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', balance: '$25,000.00', status: 'Active', kyc: 'Verified' },
    { id: 5, name: 'David Wilson', email: 'david@example.com', balance: '$1,500.00', status: 'Active', kyc: 'Verified' },
  ]);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBalance, setEditBalance] = useState('');

  const handleEditBalance = (user: any) => {
    setSelectedUser(user);
    setEditBalance(user.balance.replace('$', '').replace(',', ''));
    setIsModalOpen(true);
  };

  const saveBalance = () => {
    // Simulate API call
    const updatedUsers = users.map(u => 
      u.id === selectedUser.id ? { ...u, balance: `$${parseFloat(editBalance).toFixed(2)}` } : u
    );
    setUsers(updatedUsers);
    setIsModalOpen(false);
  };

  const toggleStatus = (id: number) => {
    const updatedUsers = users.map(u => 
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
    );
    setUsers(updatedUsers);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="bg-nexus-navy border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-red-500 outline-none w-64"
            />
          </div>
          <button className="p-2 bg-nexus-navy border border-white/10 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white">
            <Filter className="w-5 h-5" />
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
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Balance</th>
              <th className="px-6 py-4 font-medium">KYC Status</th>
              <th className="px-6 py-4 font-medium">Account Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                <td className="px-6 py-4 text-slate-400">{user.email}</td>
                <td className="px-6 py-4 font-mono text-emerald-400 font-bold">{user.balance}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user.kyc === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 
                    user.kyc === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                    'bg-slate-500/10 text-slate-400'
                  }`}>
                    {user.kyc}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditBalance(user)}
                      className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors" 
                      title="Edit Balance"
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      className={`p-1.5 rounded transition-colors ${
                        user.status === 'Active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`} 
                      title={user.status === 'Active' ? 'Suspend' : 'Activate'}
                    >
                      {user.status === 'Active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button className="p-1.5 bg-slate-500/10 text-slate-400 rounded hover:bg-slate-500/20 transition-colors" title="More">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Edit Balance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-nexus-navy border border-white/10 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Adjust User Balance</h3>
            <p className="text-sm text-slate-400 mb-6">Modifying balance for <span className="text-white font-bold">{selectedUser?.name}</span></p>
            
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">New Balance (USD)</label>
              <input 
                type="number" 
                value={editBalance}
                onChange={(e) => setEditBalance(e.target.value)}
                className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveBalance}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
