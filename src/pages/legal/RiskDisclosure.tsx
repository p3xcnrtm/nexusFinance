import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function RiskDisclosure() {
  return (
    <div className="min-h-screen bg-nexus-dark text-blue-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-nexus-gold hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Risk Disclosure</h1>
        <div className="space-y-6 text-blue-200 leading-relaxed">
          <p>Last updated: March 2026</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. General Risk Warning</h2>
          <p>Trading and investing in cryptocurrencies, digital assets, and traditional financial instruments involves a high degree of risk. Prices can be extremely volatile, and you may lose some or all of your initial investment.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Cryptocurrency Risks</h2>
          <p>Cryptocurrencies are not backed by any government or central bank. Their value is determined by market supply and demand, which can fluctuate wildly. Regulatory changes, technological vulnerabilities, and market sentiment can significantly impact prices.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. No Guarantees</h2>
          <p>Past performance is not indicative of future results. NexusEdge Finance does not guarantee any specific returns or outcomes from using our services. Any historical data or projections provided are for informational purposes only.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Independent Advice</h2>
          <p>You should carefully consider your financial situation, investment objectives, and risk tolerance before investing. We strongly recommend consulting with an independent financial advisor before making any investment decisions.</p>
        </div>
      </div>
    </div>
  );
}
