import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, CheckCircle, ShieldCheck, AlertCircle, FileText, User } from 'lucide-react';

export default function KYC() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
    selfie: null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    // @ts-ignore
    setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setStep(4);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Account Verification</h1>
        <p className="text-blue-200">Complete KYC to unlock full account features and higher limits.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10"></div>
        {[1, 2, 3].map((s) => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-nexus-gold text-nexus-dark' : 'bg-nexus-dark border border-white/20 text-slate-500'}`}>
            {step > s ? <CheckCircle className="w-6 h-6" /> : s}
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-8 rounded-xl"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Full Legal Name</label>
                <input type="text" className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-nexus-gold outline-none transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Date of Birth</label>
                <input type="date" className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-nexus-gold outline-none transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Residential Address</label>
                <input type="text" className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-nexus-gold outline-none transition-colors" placeholder="123 Main St, City, Country" />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors mt-6">
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Document Upload</h3>
            <p className="text-sm text-blue-200 mb-6">Please upload a clear photo of your government-issued ID (Passport, Driver's License, or National ID).</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-nexus-gold/50 transition-colors cursor-pointer group relative">
                <input type="file" onChange={(e) => handleFileChange(e, 'idFront')} className="absolute inset-0 opacity-0 cursor-pointer" />
                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2 group-hover:text-nexus-gold transition-colors" />
                <p className="text-sm text-slate-400 group-hover:text-white transition-colors">Front of ID</p>
                {files.idFront && <p className="text-xs text-emerald-400 mt-2">File Selected</p>}
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-nexus-gold/50 transition-colors cursor-pointer group relative">
                <input type="file" onChange={(e) => handleFileChange(e, 'idBack')} className="absolute inset-0 opacity-0 cursor-pointer" />
                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2 group-hover:text-nexus-gold transition-colors" />
                <p className="text-sm text-slate-400 group-hover:text-white transition-colors">Back of ID</p>
                {files.idBack && <p className="text-xs text-emerald-400 mt-2">File Selected</p>}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors">
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Liveness Check</h3>
            <p className="text-sm text-blue-200 mb-6">Please upload a selfie holding your ID and a piece of paper with today's date written on it.</p>
            
            <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-nexus-gold/50 transition-colors cursor-pointer group relative max-w-md mx-auto">
              <input type="file" onChange={(e) => handleFileChange(e, 'selfie')} className="absolute inset-0 opacity-0 cursor-pointer" />
              <User className="w-12 h-12 text-slate-500 mx-auto mb-4 group-hover:text-nexus-gold transition-colors" />
              <p className="text-sm text-slate-400 group-hover:text-white transition-colors">Upload Selfie</p>
              {files.selfie && <p className="text-xs text-emerald-400 mt-2">File Selected</p>}
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} className="flex-1 py-4 bg-white/5 text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                Back
              </button>
              <button onClick={handleSubmit} className="flex-1 py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors">
                Submit Verification
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Verification Submitted</h3>
            <p className="text-blue-200 max-w-md mx-auto mb-8">
              Your documents have been securely received and are under review. This process typically takes 24-48 hours. You will be notified via email once approved.
            </p>
            <button onClick={() => setStep(1)} className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">
              Return to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
