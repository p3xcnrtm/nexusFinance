import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, CheckCircle, Users, Gift, TrendingUp } from 'lucide-react';

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'NEXUS-8293-XJ2';
  const referralLink = `https://nexusedge.finance/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">Referral Program</h1>
        <p className="text-blue-200">
          Invite friends and earn a <span className="text-nexus-gold font-bold">5% commission</span> on their deposits. Build your network and grow your wealth together.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl text-center"
        >
          <div className="w-12 h-12 bg-nexus-blue/20 rounded-full flex items-center justify-center text-nexus-blue mx-auto mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">12</h3>
          <p className="text-sm text-slate-400">Total Referrals</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl text-center"
        >
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">$1,250.00</h3>
          <p className="text-sm text-slate-400">Total Earnings</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl text-center"
        >
          <div className="w-12 h-12 bg-nexus-gold/20 rounded-full flex items-center justify-center text-nexus-gold mx-auto mb-4">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">Level 1</h3>
          <p className="text-sm text-slate-400">Current Tier</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-nexus-navy to-nexus-blue/20 border border-white/10 p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-gold/5 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Your Unique Referral Link</h3>
            <p className="text-sm text-blue-200">Share this link with your network to start earning.</p>
          </div>
          
          <div className="flex w-full md:w-auto bg-nexus-dark border border-white/10 rounded-lg p-2 items-center">
            <input 
              type="text" 
              readOnly 
              value={referralLink} 
              className="bg-transparent text-slate-300 text-sm px-3 w-full md:w-80 outline-none"
            />
            <button 
              onClick={handleCopy}
              className="bg-nexus-gold text-nexus-dark px-4 py-2 rounded-md font-bold text-sm hover:bg-white transition-colors flex items-center gap-2"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-white mb-6">Referral History</h3>
        <div className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-nexus-dark/50 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Date Joined</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Commission Earned</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {[
                { user: 'Sarah J.', date: 'Oct 24, 2025', status: 'Active', earned: '$125.00' },
                { user: 'Mike T.', date: 'Oct 20, 2025', status: 'Active', earned: '$50.00' },
                { user: 'David L.', date: 'Oct 15, 2025', status: 'Pending Deposit', earned: '$0.00' },
              ].map((ref, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{ref.user}</td>
                  <td className="px-6 py-4 text-slate-400">{ref.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ref.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-nexus-gold font-bold">{ref.earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
