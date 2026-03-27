import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Settings,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Deposits', icon: ArrowDownLeft, path: '/admin/deposits' },
    { name: 'Withdrawals', icon: ArrowUpRight, path: '/admin/withdrawals' },
    { name: 'KYC Verification', icon: ShieldCheck, path: '/admin/kyc' },
    { name: 'Support Tickets', icon: MessageSquare, path: '/admin/support' },
    { name: 'Announcements', icon: Bell, path: '/admin/announcements' },
    { name: 'System Logs', icon: FileText, path: '/admin/logs' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-nexus-dark flex text-blue-50 font-sans selection:bg-red-500 selection:text-white">
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
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-nexus-navy border-r border-red-500/10 z-50 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-red-500/10">
          <Link to="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold shadow-lg shadow-red-900/20">A</div>
            <span className="text-xl font-display font-bold text-white group-hover:text-red-500 transition-colors">Nexus<span className="text-red-500">Admin</span></span>
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
                    ? 'bg-red-500/10 text-red-400 font-medium border border-red-500/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-red-400' : 'text-slate-500 group-hover:text-white'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-red-500/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-nexus-navy/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center bg-nexus-dark/50 border border-white/10 rounded-full px-4 py-2 w-96 focus-within:border-red-500/50 transition-colors">
            <Search className="w-4 h-4 text-slate-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search users, transactions, logs..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">Administrator</p>
                <p className="text-xs text-red-400">Super Admin Access</p>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full border border-red-400/20 flex items-center justify-center text-white font-bold shadow-lg shadow-red-900/20">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {/* Background decoration for admin pages */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-red-900/5 to-transparent pointer-events-none"></div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
