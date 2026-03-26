import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  PieChart, 
  Users, 
  ShieldCheck, 
  LifeBuoy, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Investor';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Investments', icon: PieChart, path: '/dashboard/portfolio' },
    { name: 'Deposit Funds', icon: ArrowDownLeft, path: '/dashboard/deposit' },
    { name: 'Withdraw Funds', icon: ArrowUpRight, path: '/dashboard/withdraw' },
    { name: 'Transaction History', icon: History, path: '/dashboard/history' },
    { name: 'Investment Plans', icon: Wallet, path: '/dashboard/plans' },
    { name: 'Referral Program', icon: Users, path: '/dashboard/referral' },
    { name: 'Account Verification', icon: ShieldCheck, path: '/dashboard/kyc' },
    { name: 'Support Center', icon: LifeBuoy, path: '/dashboard/support' },
  ];

  return (
    <div className="min-h-screen bg-nexus-dark flex text-blue-50 font-sans selection:bg-nexus-gold selection:text-nexus-dark">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-nexus-navy border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-nexus-gold rounded-md flex items-center justify-center text-nexus-dark font-bold">N</div>
            <span className="text-xl font-display font-bold text-white group-hover:text-nexus-gold transition-colors">Nexus<span className="text-nexus-gold">Edge</span></span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-nexus-blue text-white font-medium shadow-lg shadow-nexus-blue/20' 
                    : 'text-blue-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-nexus-gold'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-nexus-navy/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center bg-nexus-dark/50 border border-white/10 rounded-full px-4 py-2 w-96">
            <Search className="w-4 h-4 text-slate-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search investments, transactions..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-nexus-navy"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{userName}</p>
                <p className="text-xs text-nexus-gold">Verified Investor</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-nexus-blue to-nexus-navy rounded-full border border-white/10 flex items-center justify-center text-white font-bold shadow-lg">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {/* Background decoration for dashboard pages */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-nexus-blue/5 to-transparent pointer-events-none"></div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
