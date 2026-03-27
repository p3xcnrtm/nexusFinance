import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, ShieldCheck, TrendingUp, Wallet, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlanCard = ({ title, roi, duration, minInvest, features, recommended, onInvest }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`relative p-8 rounded-2xl border ${recommended ? 'bg-nexus-navy border-nexus-gold shadow-2xl shadow-nexus-gold/10' : 'bg-nexus-navy/50 border-white/5'} transition-all flex flex-col`}
  >
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-nexus-gold text-nexus-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-bold text-nexus-gold">{roi}%</span>
      <span className="text-slate-400 text-sm">ROI</span>
    </div>
    
    <div className="space-y-4 mb-8 flex-grow">
      <div className="flex justify-between text-sm border-b border-white/5 pb-2">
        <span className="text-slate-400">Duration</span>
        <span className="text-white font-medium">{duration} Days</span>
      </div>
      <div className="flex justify-between text-sm border-b border-white/5 pb-2">
        <span className="text-slate-400">Min Investment</span>
        <span className="text-white font-medium">${minInvest}</span>
      </div>
      <div className="flex justify-between text-sm border-b border-white/5 pb-2">
        <span className="text-slate-400">Risk Level</span>
        <span className="text-emerald-400 font-medium">Low - Medium</span>
      </div>
      <ul className="space-y-3 pt-4">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm text-blue-200">
            <CheckCircle className="w-4 h-4 text-nexus-gold shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>
    </div>

    <button 
      onClick={() => onInvest(title, roi, duration, minInvest)}
      className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors mt-auto ${recommended ? 'bg-nexus-gold text-nexus-dark hover:bg-white' : 'bg-white/10 text-white hover:bg-nexus-gold hover:text-nexus-dark'}`}
    >
      Invest Now <ArrowRight className="w-4 h-4" />
    </button>
  </motion.div>
);

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInvestClick = (title: string, roi: string, duration: string, minInvest: string) => {
    setSelectedPlan({ title, roi, duration, minInvest: parseInt(minInvest.replace(/,/g, '')) });
    setAmount(minInvest.replace(/,/g, ''));
    setError('');
    setSuccess('');
  };

  const handleConfirmInvestment = async () => {
    setError('');
    setSuccess('');

    if (!amount || isNaN(Number(amount)) || Number(amount) < selectedPlan.minInvest) {
      setError(`Minimum investment for this plan is $${selectedPlan.minInvest}`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/user/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planName: selectedPlan.title,
          amount: Number(amount),
          roi: Number(selectedPlan.roi),
          duration: Number(selectedPlan.duration)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Investment failed');
      }

      setSuccess('Investment successful! Your plan is now active.');
      setTimeout(() => {
        navigate('/dashboard/portfolio');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Investment Plans</h1>
        <p className="text-blue-200 text-lg">
          Choose a strategy that aligns with your financial goals. Our expert-managed portfolios offer diversified exposure to high-growth digital assets.
        </p>
      </div>

      {selectedPlan && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-nexus-navy/80 backdrop-blur-md border border-nexus-gold p-8 rounded-2xl max-w-2xl mx-auto"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Confirm Investment</h3>
              <p className="text-blue-200">You are investing in the <span className="text-nexus-gold font-bold">{selectedPlan.title}</span> plan.</p>
            </div>
            <button onClick={() => setSelectedPlan(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 text-emerald-400">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p>{success}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Investment Amount (USD)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={selectedPlan.minInvest}
                className="w-full bg-nexus-dark border border-white/10 rounded-lg p-4 text-white text-xl font-bold focus:border-nexus-gold outline-none transition-colors"
              />
              <p className="text-xs text-slate-400 mt-2">Minimum: ${selectedPlan.minInvest.toLocaleString()}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Expected ROI</span>
                <span className="text-emerald-400 font-bold">+{selectedPlan.roi}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Duration</span>
                <span className="text-white">{selectedPlan.duration} Days</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="text-slate-400">Estimated Return</span>
                <span className="text-nexus-gold font-bold">
                  ${(Number(amount) * (1 + Number(selectedPlan.roi) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button 
              onClick={handleConfirmInvestment}
              disabled={isLoading}
              className="w-full py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? 'Processing...' : 'Confirm & Invest'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <PlanCard 
          title="Starter Growth" 
          roi="12.5" 
          duration="30" 
          minInvest="500" 
          onInvest={handleInvestClick}
          features={[
            "Daily profit accrual",
            "Capital returned at end of term",
            "24/7 Support access",
            "Basic market insights"
          ]} 
        />
        <PlanCard 
          title="Wealth Builder" 
          roi="28.4" 
          duration="90" 
          minInvest="5,000" 
          recommended={true}
          onInvest={handleInvestClick}
          features={[
            "Compounded daily returns",
            "Priority withdrawal processing",
            "Dedicated account manager",
            "Advanced portfolio rebalancing",
            "Weekly strategy reports"
          ]} 
        />
        <PlanCard 
          title="Institutional Elite" 
          roi="45.0" 
          duration="180" 
          minInvest="25,000" 
          onInvest={handleInvestClick}
          features={[
            "Maximum yield strategy",
            "Private equity access",
            "Tax-efficient structuring",
            "Direct access to analysts",
            "Custom risk parameters",
            "VIP event invitations"
          ]} 
        />
      </div>

      {/* Why Choose Us Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-nexus-navy/30 p-6 rounded-xl border border-white/5">
          <div className="w-12 h-12 bg-nexus-gold/10 rounded-lg flex items-center justify-center text-nexus-gold mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Secure Custody</h3>
          <p className="text-sm text-slate-400">
            Assets are held in segregated, multi-signature cold wallets with institutional-grade security protocols.
          </p>
        </div>
        <div className="bg-nexus-navy/30 p-6 rounded-xl border border-white/5">
          <div className="w-12 h-12 bg-nexus-gold/10 rounded-lg flex items-center justify-center text-nexus-gold mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Proven Performance</h3>
          <p className="text-sm text-slate-400">
            Our strategies have consistently outperformed the market benchmark, delivering superior risk-adjusted returns.
          </p>
        </div>
        <div className="bg-nexus-navy/30 p-6 rounded-xl border border-white/5">
          <div className="w-12 h-12 bg-nexus-gold/10 rounded-lg flex items-center justify-center text-nexus-gold mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Flexible Liquidity</h3>
          <p className="text-sm text-slate-400">
            While plans have fixed terms, we offer emergency liquidity options for qualifying accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
