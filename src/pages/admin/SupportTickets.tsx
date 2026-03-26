import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, User, CheckCircle, Clock } from 'lucide-react';

export default function SupportTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;

    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply })
      });

      if (res.ok) {
        setReply('');
        fetchMessages(selectedTicket.id);
        fetchTickets();
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to send reply');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResolve = async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/resolve`, {
        method: 'POST'
      });

      if (res.ok) {
        fetchTickets();
        setSelectedTicket({ ...selectedTicket, status: 'Resolved' });
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to resolve ticket');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const pendingCount = tickets.filter(t => t.status === 'Pending').length;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Ticket List */}
      <div className="w-1/3 bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 bg-nexus-dark/50">
          <h2 className="text-lg font-bold text-white">Active Tickets</h2>
          <div className="flex gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full font-bold">{openCount} Open</span>
            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full font-bold">{pendingCount} Pending</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">No tickets found.</div>
          ) : tickets.map((ticket) => (
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
              <p className="text-xs text-slate-400 mb-2">User: {ticket.userName}</p>
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>{ticket.id}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Detail / Chat */}
      <div className="flex-1 bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden flex flex-col">
        {error && (
          <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        {selectedTicket ? (
          <>
            <div className="p-6 border-b border-white/10 bg-nexus-dark/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{selectedTicket.subject}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-white">{selectedTicket.id}</span>
                  <span>•</span>
                  <span>Reported by <span className="text-white font-bold">{selectedTicket.userName}</span></span>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedTicket.status !== 'Resolved' && (
                  <button 
                    onClick={handleResolve}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Mark Resolved
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((msg: any) => (
                <div key={msg.id} className={`flex gap-4 ${msg.senderRole === 'admin' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.senderRole === 'admin' ? 'bg-red-600' : 'bg-slate-700'}`}>
                    {msg.senderRole === 'admin' ? <span className="text-white font-bold text-xs">A</span> : <User className="w-4 h-4 text-slate-300" />}
                  </div>
                  <div className={`border p-4 rounded-lg max-w-lg ${
                    msg.senderRole === 'admin' 
                      ? 'bg-red-500/10 border-red-500/20 rounded-tr-none' 
                      : 'bg-nexus-dark border-white/10 rounded-tl-none'
                  }`}>
                    <p className={`text-sm leading-relaxed ${msg.senderRole === 'admin' ? 'text-white' : 'text-slate-300'}`}>
                      {msg.message}
                    </p>
                    <p className={`text-[10px] mt-2 ${msg.senderRole === 'admin' ? 'text-red-300/50 text-right' : 'text-slate-500 text-right'}`}>
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedTicket.status !== 'Resolved' && (
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
            )}
            {selectedTicket.status === 'Resolved' && (
              <div className="p-4 bg-emerald-500/10 border-t border-emerald-500/20 text-center text-emerald-400 text-sm">
                This ticket has been resolved and closed.
              </div>
            )}
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
