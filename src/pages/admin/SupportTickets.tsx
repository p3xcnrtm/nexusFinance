import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, User, CheckCircle, Clock } from 'lucide-react';

export default function SupportTickets() {
  const [tickets, setTickets] = useState([
    { id: 'TKT-9921', user: 'John Doe', subject: 'Deposit Issue', status: 'Open', lastUpdate: '2 mins ago', priority: 'High' },
    { id: 'TKT-9920', user: 'Sarah Smith', subject: 'KYC Verification', status: 'Resolved', lastUpdate: '1 hour ago', priority: 'Medium' },
    { id: 'TKT-9919', user: 'Mike Johnson', subject: 'Withdrawal Delay', status: 'Pending', lastUpdate: '3 hours ago', priority: 'High' },
    { id: 'TKT-9918', user: 'Emily Davis', subject: 'General Inquiry', status: 'Open', lastUpdate: '5 hours ago', priority: 'Low' },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reply, setReply] = useState('');

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate reply
    setReply('');
    // Update ticket status if needed
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Ticket List */}
      <div className="w-1/3 bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 bg-nexus-dark/50">
          <h2 className="text-lg font-bold text-white">Active Tickets</h2>
          <div className="flex gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full font-bold">2 Open</span>
            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full font-bold">1 Pending</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                selectedTicket?.id === ticket.id ? 'bg-white/10 border-l-4 border-l-red-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-white text-sm truncate">{ticket.subject}</h4>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  ticket.status === 'Open' ? 'bg-red-500/20 text-red-400' :
                  ticket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{ticket.status}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">User: {ticket.user}</p>
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>{ticket.id}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ticket.lastUpdate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Detail / Chat */}
      <div className="flex-1 bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden flex flex-col">
        {selectedTicket ? (
          <>
            <div className="p-6 border-b border-white/10 bg-nexus-dark/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{selectedTicket.subject}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-white">{selectedTicket.id}</span>
                  <span>•</span>
                  <span>Reported by <span className="text-white font-bold">{selectedTicket.user}</span></span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Mark Resolved
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Mock Conversation */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
                <div className="bg-nexus-dark border border-white/10 p-4 rounded-lg rounded-tl-none max-w-lg">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Hello, I made a deposit of $5,000 yesterday but it hasn't shown up in my account yet. Can you please check? Transaction ID is TX123456.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 text-right">Yesterday, 10:42 AM</p>
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg rounded-tr-none max-w-lg">
                  <p className="text-sm text-white leading-relaxed">
                    Hi John, thanks for reaching out. I'm looking into this for you right now. Could you please confirm which network you used for the transfer?
                  </p>
                  <p className="text-[10px] text-red-300/50 mt-2 text-right">Yesterday, 11:15 AM</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-nexus-dark/50 border-t border-white/10">
              <form onSubmit={handleReply} className="relative">
                <input 
                  type="text" 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..." 
                  className="w-full bg-nexus-navy border border-white/10 rounded-lg pl-4 pr-12 py-3 text-white focus:border-red-500 outline-none transition-colors"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a ticket to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
