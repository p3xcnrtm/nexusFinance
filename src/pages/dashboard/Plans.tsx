import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';

const PlanCard = ({ title, roi, duration, minInvest, features, recommended }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`relative p-8 rounded-2xl border ${recommended ? 'bg-nexus-navy border-nexus-gold shadow-2xl shadow-nexus-gold/10' : 'bg-nexus-navy/50 border-white/5'} transition-all`}
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
    
    <div className="space-y-4 mb-8">
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
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-sm text-blue-200">
          <CheckCircle className="w-4 h-4 text-nexus-gold shrink-0 mt-0.5" />
          {feature}
        </li>
      ))}
    </ul>

    <button className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${recommended ? 'bg-nexus-gold text-nexus-dark hover:bg-white' : 'bg-white/10 text-white hover:bg-nexus-gold hover:text-nexus-dark'}`}>
      Invest Now <ArrowRight className="w-4 h-4" />
    </button>
  </motion.div>
);

export default function Plans() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Investment Plans</h1>
        <p className="text-blue-200 text-lg">
          Choose a strategy that aligns with your financial goals. Our expert-managed portfolios offer diversified exposure to high-growth digital assets.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <PlanCard 
          title="Starter Growth" 
          roi="12.5" 
          duration="30" 
          minInvest="500" 
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
