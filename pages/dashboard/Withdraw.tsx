import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch('/api/user/dashboard');
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };
    fetchBalance();
  }, []);

  const handleWithdraw = async () => {
    setError('');
    setSuccess('');

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (!address) {
      setError('Please enter a valid wallet address.');
      return;
    }

    if (Number(amount) > balance) {
      setError('Insufficient balance.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), asset: selectedAsset, address })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Withdrawal request failed');
      }

      setSuccess(`Withdrawal request submitted successfully! Transaction ID: ${data.txId}`);
      setAmount('');
      setAddress('');
      setBalance(prev => prev - Number(amount));
      setTimeout(() => {
        navigate('/dashboard/transactions');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
        <p className="text-blue-200">Request a withdrawal to your external wallet.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 text-emerald-400">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-8 rounded-xl space-y-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Withdrawal Details</h3>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Available Balance</p>
            <p className="text-nexus-gold font-bold text-lg">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

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
          <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Withdrawal Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-nexus-dark border border-white/10 rounded-lg pl-8 p-3 text-white focus:border-nexus-gold outline-none transition-colors"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">Wallet Address</label>
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-nexus-dark border border-white/10 rounded-lg p-3 text-white focus:border-nexus-gold outline-none transition-colors font-mono text-sm"
            placeholder={`Enter your ${selectedAsset} address`}
          />
        </div>

        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-200">
            Withdrawals are processed manually for security. Please allow up to 24 hours for approval. Ensure the wallet address is correct; transactions cannot be reversed.
          </p>
        </div>

        <button 
          onClick={handleWithdraw}
          disabled={isLoading}
          className="w-full py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Request Withdrawal'} <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
