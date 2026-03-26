import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Bell, CheckCircle } from 'lucide-react';

export default function Announcements() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [isSent, setIsSent] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, target })
      });

      if (res.ok) {
        setIsSent(true);
        setTimeout(() => setIsSent(false), 3000);
        setTitle('');
        setMessage('');
        setTarget('all');
        fetchAnnouncements();
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to send announcement');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">System Announcements</h1>
        <p className="text-slate-400">Broadcast messages to all users or specific groups.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

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
          {announcements.length === 0 ? (
            <p className="text-slate-400 text-sm">No announcements sent yet.</p>
          ) : announcements.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
              <div>
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-xs text-slate-400">Sent to: {item.target === 'all' ? 'All Users' : item.target} • {new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded uppercase tracking-wider">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
