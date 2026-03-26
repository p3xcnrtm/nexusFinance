import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Bell, CheckCircle } from 'lucide-react';

export default function Announcements() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending announcement
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">System Announcements</h1>
        <p className="text-slate-400">Broadcast messages to all users or specific groups.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-8 rounded-xl relative overflow-hidden"
      >
        {isSent && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg"
          >
            <CheckCircle className="w-4 h-4" /> Announcement Sent Successfully!
          </motion.div>
        )}

        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Announcement Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
              placeholder="e.g., Scheduled Maintenance Update"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Target Audience</label>
            <select 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
            >
              <option value="all">All Users</option>
              <option value="active">Active Investors Only</option>
              <option value="vip">VIP Members</option>
              <option value="new">New Registrations (Last 7 Days)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Message Content</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
              placeholder="Type your announcement here..."
              required
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button 
              type="submit" 
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20"
            >
              <Send className="w-4 h-4" /> Broadcast Announcement
            </button>
          </div>
        </form>
      </motion.div>

      <div className="bg-nexus-navy/30 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-400" /> Recent History
        </h3>
        <div className="space-y-4">
          {[
            { title: 'Platform Maintenance', date: 'Oct 20, 2025', audience: 'All Users', status: 'Sent' },
            { title: 'New Investment Plan Launch', date: 'Oct 15, 2025', audience: 'VIP Members', status: 'Sent' },
            { title: 'Security Update', date: 'Oct 10, 2025', audience: 'All Users', status: 'Sent' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
              <div>
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-xs text-slate-400">Sent to: {item.audience} • {item.date}</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded uppercase tracking-wider">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
