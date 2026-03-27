import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-nexus-dark text-blue-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-nexus-gold hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-6 text-blue-200 leading-relaxed">
          <p>Last updated: March 2026</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using the services provided by NexusEdge Finance, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access or use our services.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Eligibility</h2>
          <p>You must be at least 18 years old and capable of forming a binding contract to use our services. By using our services, you represent and warrant that you meet these requirements.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Investment Risks</h2>
          <p>Investing in cryptocurrencies and traditional financial markets involves substantial risk of loss. You acknowledge that you are fully aware of these risks and that NexusEdge Finance is not liable for any financial losses incurred.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Account Security</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
        </div>
      </div>
    </div>
  );
}
