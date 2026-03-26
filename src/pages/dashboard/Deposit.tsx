import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, CheckCircle, Upload, AlertCircle } from 'lucide-react';

export default function Deposit() {
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const walletAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
        <p className="text-blue-200">Securely add funds to your investment account.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Deposit Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-8 rounded-xl space-y-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Select Payment Method</h3>
          
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setSelectedMethod('crypto')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedMethod === 'crypto' 
                  ? 'bg-nexus-blue text-white shadow-lg shadow-nexus-blue/20' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Cryptocurrency
            </button>
            <button 
              onClick={() => setSelectedMethod('bank')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedMethod === 'bank' 
                  ? 'bg-nexus-blue text-white shadow-lg shadow-nexus-blue/20' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Bank Transfer
            </button>
          </div>

          {selectedMethod === 'crypto' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Select Asset</label>
                <select 
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-nexus-gold outline-none transition-colors"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT - TRC20)</option>
                  <option value="SOL">Solana (SOL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Amount (USD)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-nexus-gold outline-none transition-colors"
                  placeholder="Enter amount"
                />
              </div>

              <div className="p-4 bg-nexus-blue/10 border border-nexus-blue/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-nexus-blue shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200">
                  Please ensure you are sending the correct asset to the correct network. Deposits are credited after 3 network confirmations.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Payment Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-8 rounded-xl flex flex-col justify-between"
        >
          {selectedMethod === 'crypto' ? (
            <>
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Wallet Address</h3>
                <div className="flex justify-center mb-8">
                  <div className="bg-white p-4 rounded-xl">
                    {/* Placeholder QR Code */}
                    <div className="w-48 h-48 bg-slate-900 flex items-center justify-center text-white text-xs">
                      QR Code for {selectedAsset}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Copy Address</label>
                  <div className="flex items-center bg-nexus-dark border border-white/10 rounded-lg p-3 pr-12 text-slate-300 font-mono text-sm break-all">
                    {walletAddress}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="absolute right-2 top-8 p-2 text-nexus-gold hover:text-white transition-colors"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-white font-bold mb-4">Upload Proof of Payment</h4>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-nexus-gold/50 transition-colors cursor-pointer group">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2 group-hover:text-nexus-gold transition-colors" />
                  <p className="text-sm text-slate-400 group-hover:text-white transition-colors">Click to upload screenshot</p>
                </div>
                <button className="w-full mt-6 py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors">
                  Confirm Deposit
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">Bank transfer details will be displayed here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
