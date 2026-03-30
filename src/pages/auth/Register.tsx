import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Phone, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms and Investment Policy.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.requireOtp) {
        setShowOtp(true);
      } else {
        login(data.user);
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
        body: JSON.stringify({ email: formData.email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      login(data.user);
      navigate('/dashboard');
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
        className="w-full max-w-2xl bg-nexus-navy/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 bg-nexus-gold rounded-md flex items-center justify-center text-nexus-dark font-bold">N</div>
            <span className="text-xl font-display font-bold text-white group-hover:text-nexus-gold transition-colors">Nexus<span className="text-nexus-gold">Edge</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">{showOtp ? 'Verify Your Account' : 'Create Investor Account'}</h2>
          <p className="text-blue-200 text-sm">{showOtp ? 'Enter the OTP sent to your email.' : 'Join our network of institutional and private investors.'}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 text-red-400" />
            {error}
          </div>
        )}

        {showOtp ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md mx-auto">
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
          <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-nexus-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-nexus-gold outline-none transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-nexus-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-nexus-gold outline-none transition-colors"
                    placeholder="investor@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-nexus-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-nexus-gold outline-none transition-colors"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-nexus-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-nexus-gold outline-none transition-colors appearance-none"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="SG">Singapore</option>
                    <option value="AE">UAE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-nexus-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-nexus-gold outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-nexus-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-nexus-gold outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/10 bg-nexus-dark/50 text-nexus-gold focus:ring-nexus-gold/50"
                />
                <span className="text-sm text-blue-200 group-hover:text-white transition-colors">
                  I agree to the <a href="#" className="text-nexus-gold hover:underline">Terms of Service</a> and <a href="#" className="text-nexus-gold hover:underline">Investment Policy</a>.
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Investor Account'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-blue-200">
          Already have an account? <Link to="/login" className="text-nexus-gold font-bold hover:underline">Login Here</Link>
        </div>
      </motion.div>
    </div>
  );
}
