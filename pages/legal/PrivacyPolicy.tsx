import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-nexus-dark text-blue-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-nexus-gold hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-blue-200 leading-relaxed">
          <p>Last updated: March 2026</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, submit an inquiry, or communicate with us. This may include your name, email address, phone number, and financial information required for KYC/AML compliance.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, offers, and events.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Security</h2>
          <p>We implement institutional-grade security measures designed to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at NexusEdgeFinance@gmail.com.</p>
        </div>
      </div>
    </div>
  );
}
