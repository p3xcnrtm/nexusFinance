import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, CheckCircle, Upload, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Deposit() {
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const walletAddresses: Record<string, string> = {
    BTC: 'bc1qc6h9x6cy7l6kar34cxwlpkwd3gjlukjzeqkh5g',
    ETH: '0x3Ee713960D7821a33D089B24311Cb0b198FFA64b',
    SOL: '7Ks9DWEYpq7oc8DdF2eVCsEQmRAsnCwJ2CqK92QZs81n',
    USDT: '0x3Ee713960D7821a33D089B24311Cb0b198FFA64b' // Using ETH address for USDT (ERC20)
  };

  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const getCryptoPrice = async (asset: string) => {
    if (asset === 'USDT') return 1;
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${asset}USDT`);
      const data = await res.json();
      return parseFloat(data.price);
    } catch (error) {
      console.error('Failed to fetch price', error);
      // Fallback prices if API fails
      const fallbacks: Record<string, number> = { BTC: 65000, ETH: 3500, SOL: 150 };
      return fallbacks[asset] || 1;
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = async () => {
    setError('');
    setSuccess('');

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setIsLoading(true);
    try {
      const price = await getCryptoPrice(selectedAsset);
      const cryptoAmount = (Number(amount) / price).toFixed(8);

      const res = await fetch('/api/user/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: Number(amount), asset: selectedAsset })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Deposit request failed');
      }

      setSuccess(`Deposit request submitted successfully! Transaction ID: ${data.txId}`);
      
      setPaymentDetails({
        address: walletAddresses[selectedAsset] || walletAddresses['BTC'],
        amount: cryptoAmount,
        currency: selectedAsset
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
        <p className="text-blue-200">Securely add funds to your investment account.</p>
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
            paymentDetails ? (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Complete Your Payment</h3>
                
                <div className="p-4 bg-nexus-blue/10 border border-nexus-blue/20 rounded-lg">
                  <p className="text-sm text-blue-200 mb-1">Send exactly:</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-white">{paymentDetails.amount} {paymentDetails.currency.toUpperCase()}</p>
                    <button onClick={() => handleCopy(paymentDetails.amount.toString())} className="text-nexus-gold hover:text-white">
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-blue-300 mb-2">To Address</label>
                  <div className="flex items-center bg-nexus-dark border border-white/10 rounded-lg p-3 pr-12 text-slate-300 font-mono text-sm break-all relative">
                    {paymentDetails.address}
                    <button 
                      onClick={() => handleCopy(paymentDetails.address)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-nexus-gold hover:text-white transition-colors"
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-center py-4">
                  <div className="bg-white p-4 rounded-xl">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${paymentDetails.currency}:${paymentDetails.address}?amount=${paymentDetails.amount}`} 
                      alt="QR Code" 
                      className="w-32 h-32"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/dashboard/history')}
                  className="w-full py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors flex justify-center items-center gap-2"
                >
                  Transaction Complete <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-nexus-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-8 h-8 text-nexus-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Deposit</h3>
                  <p className="text-slate-400">Enter the amount and select your preferred cryptocurrency to generate a payment address.</p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <button 
                    onClick={handleDeposit}
                    disabled={isLoading || !amount}
                    className="w-full py-4 bg-nexus-gold text-nexus-dark font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isLoading ? 'Processing...' : 'Generate Payment Address'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">Bank transfer is currently disabled. Please use Cryptocurrency.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
