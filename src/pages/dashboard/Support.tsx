import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, HelpCircle, FileText, ChevronDown, ChevronUp, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors px-4 rounded-lg"
      >
        <span className="font-medium text-white">{question}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="p-4 text-sm text-blue-200 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

export default function Support() {
  const [activeTab, setActiveTab] = useState('faq');
  const [tickets, setTickets] = useState([
    { id: 'TKT-9921', subject: 'Deposit Issue', status: 'Open', lastUpdate: '2 mins ago', priority: 'High' },
    { id: 'TKT-9844', subject: 'KYC Verification', status: 'Resolved', lastUpdate: '2 days ago', priority: 'Medium' },
  ]);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = {
      id: `TKT-${Math.floor(Math.random() * 10000)}`,
      subject: newTicketSubject,
      status: 'Open',
      lastUpdate: 'Just now',
      priority: 'Medium'
    };
    setTickets([newTicket, ...tickets]);
    setIsNewTicketOpen(false);
    setNewTicketSubject('');
    setNewTicketMessage('');
  };

  return (
    <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
          <p className="text-blue-200">Find answers or contact our dedicated support team.</p>
        </div>
        <div className="flex bg-nexus-navy border border-white/10 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'faq' ? 'bg-nexus-gold text-nexus-dark shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            FAQ & Docs
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tickets' ? 'bg-nexus-gold text-nexus-dark shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            My Tickets
          </button>
        </div>
      </div>

      {activeTab === 'faq' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-8 flex-1 overflow-hidden"
        >
          <div className="lg:col-span-2 space-y-8 overflow-y-auto pr-4">
            <div className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-nexus-gold" /> Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                <FAQItem 
                  question="How long do deposits take to process?" 
                  answer="Crypto deposits are credited automatically after 3 network confirmations. This typically takes 10-30 minutes depending on network congestion. Bank transfers may take 1-3 business days." 
                />
                <FAQItem 
                  question="What is the minimum withdrawal amount?" 
                  answer="The minimum withdrawal amount is $50 equivalent in any supported cryptocurrency. There are no maximum limits for verified accounts." 
                />
                <FAQItem 
                  question="Are my funds secure?" 
                  answer="Yes, NexusEdge uses institutional-grade custody solutions with multi-signature wallets and cold storage. We also maintain an insurance fund to protect client assets." 
                />
                <FAQItem 
                  question="How does the referral program work?" 
                  answer="You earn a 5% commission on all deposits made by users who register using your unique referral link. Commissions are credited instantly to your account balance." 
                />
                <FAQItem 
                  question="Can I cancel an active investment plan?" 
                  answer="Investment plans are locked for the duration of the term to ensure strategy execution. However, in emergency situations, early withdrawal may be possible with a penalty fee. Contact support for assistance." 
                />
              </div>
            </div>

            <div className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-nexus-gold" /> Documentation
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="#" className="p-4 bg-nexus-dark border border-white/10 rounded-lg hover:border-nexus-gold/50 transition-colors group">
                  <h4 className="font-bold text-white mb-1 group-hover:text-nexus-gold transition-colors">User Guide</h4>
                  <p className="text-xs text-slate-400">Comprehensive guide to platform features.</p>
                </a>
                <a href="#" className="p-4 bg-nexus-dark border border-white/10 rounded-lg hover:border-nexus-gold/50 transition-colors group">
                  <h4 className="font-bold text-white mb-1 group-hover:text-nexus-gold transition-colors">API Documentation</h4>
                  <p className="text-xs text-slate-400">For developers and institutional partners.</p>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-4">Need more help?</h3>
            <p className="text-sm text-blue-200 mb-6">Our support team is available 24/7 to assist you with any issues.</p>
            <button 
              onClick={() => setActiveTab('tickets')}
              className="w-full py-3 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Open Support Ticket
            </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'tickets' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex gap-6 overflow-hidden"
        >
          {/* Ticket List */}
          <div className="w-1/3 bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-nexus-dark/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">My Tickets</h2>
              <button 
                onClick={() => setIsNewTicketOpen(true)}
                className="p-2 bg-nexus-gold/10 text-nexus-gold rounded-lg hover:bg-nexus-gold/20 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-white text-sm truncate group-hover:text-nexus-gold transition-colors">{ticket.subject}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      ticket.status === 'Open' ? 'bg-red-500/20 text-red-400' :
                      ticket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>{ticket.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                    <span>{ticket.id}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ticket.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Content / New Ticket Form */}
          <div className="flex-1 bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden flex flex-col">
            {isNewTicketOpen ? (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Open New Ticket</h2>
                <form onSubmit={handleCreateTicket} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Subject</label>
                    <input 
                      type="text" 
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-nexus-gold outline-none transition-colors"
                      placeholder="Briefly describe your issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Message</label>
                    <textarea 
                      value={newTicketMessage}
                      onChange={(e) => setNewTicketMessage(e.target.value)}
                      rows={6}
                      className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-nexus-gold outline-none transition-colors"
                      placeholder="Provide detailed information about your request..."
                      required
                    ></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsNewTicketOpen(false)}
                      className="px-6 py-3 bg-white/5 text-slate-300 font-bold rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-white mb-2">Select a ticket to view</h3>
                <p className="max-w-md">Choose a ticket from the list on the left to view conversation history or reply. Click the + button to create a new support request.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
