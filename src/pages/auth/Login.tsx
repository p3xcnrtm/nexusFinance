import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requireOtp) {
          setShowOtp(true);
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      login(data.user);
      
      if (data.user.role === 'admin') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      login(data.user);
      
      if (data.user.role === 'admin') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-nexus-blue/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-nexus-gold/5 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-nexus-navy/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 bg-nexus-gold rounded-md flex items-center justify-center text-nexus-dark font-bold">N</div>
            <span className="text-xl font-display font-bold text-white group-hover:text-nexus-gold transition-colors">Nexus<span className="text-nexus-gold">Edge</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">{showOtp ? 'Verify Your Account' : 'Welcome Back'}</h2>
          <p className="text-blue-200 text-sm">{showOtp ? 'Enter the OTP sent to your email.' : 'Access your institutional-grade portfolio.'}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {showOtp ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">One-Time Password (OTP)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-nexus-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-nexus-gold outline-none transition-colors"
                  placeholder="123456"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-nexus-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-nexus-gold outline-none transition-colors"
                  placeholder="investor@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs uppercase tracking-wider text-blue-300">Password</label>
                <a href="#" className="text-xs text-nexus-gold hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-nexus-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-nexus-gold outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login to Dashboard'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-blue-200">
          Don't have an account? <Link to="/register" className="text-nexus-gold font-bold hover:underline">Create Investor Account</Link>
        </div>
      </motion.div>
    </div>
  );
}
