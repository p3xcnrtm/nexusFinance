import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-nexus-dark text-blue-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-nexus-gold hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="space-y-6 text-blue-200 leading-relaxed">
          <p>Last updated: March 2026</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. What are Cookies?</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Cookies</h2>
          <p>We use cookies to enhance your browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. They help us understand how you interact with our website and improve our services.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly and cannot be switched off in our systems.</li>
            <li><strong>Performance Cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
            <li><strong>Functional Cookies:</strong> These enable the website to provide enhanced functionality and personalization.</li>
            <li><strong>Targeting Cookies:</strong> These may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts on other sites.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Managing Cookies</h2>
          <p>You can control and manage cookies in your browser settings. Please note that removing or blocking cookies can impact your user experience and parts of this website may no longer be fully accessible.</p>
        </div>
      </div>
    </div>
  );
}
