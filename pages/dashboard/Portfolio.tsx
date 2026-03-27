import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#F7931A', '#627EEA', '#26A17B', '#00FFA3'];

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [liveAssets, setLiveAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/user/portfolio');
      if (res.ok) {
        const data = await res.json();
        setPortfolioData(data);
        await fetchLivePrices(data.assetAllocation);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLivePrices = async (allocation: any[]) => {
    try {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`);
      const data = await res.json();
      
      const priceMap: Record<string, { price: number, change: number }> = {
        USDT: { price: 1, change: 0 }
      };

      data.forEach((ticker: any) => {
        const symbol = ticker.symbol.replace('USDT', '');
        priceMap[symbol] = {
          price: parseFloat(ticker.lastPrice),
          change: parseFloat(ticker.priceChangePercent)
        };
      });

      const updatedAssets = [
        { name: 'Bitcoin', symbol: 'BTC' },
        { name: 'Ethereum', symbol: 'ETH' },
        { name: 'Tether', symbol: 'USDT' },
        { name: 'Solana', symbol: 'SOL' }
      ].map(asset => {
        const alloc = allocation.find((a: any) => a.name === asset.name)?.value || 0;
        const liveData = priceMap[asset.symbol] || { price: 1, change: 0 };
        const balance = alloc / liveData.price;
        
        return {
          ...asset,
          balance: balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
          value: `$${alloc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: `${liveData.change > 0 ? '+' : ''}${liveData.change.toFixed(2)}%`
        };
      });

      setLiveAssets(updatedAssets);
    } catch (error) {
      console.error('Failed to fetch live prices', error);
      // Fallback
      setLiveAssets([
        { name: 'Bitcoin', symbol: 'BTC', balance: '0.0000', value: '$0.00', change: '0.00%' },
        { name: 'Ethereum', symbol: 'ETH', balance: '0.0000', value: '$0.00', change: '0.00%' },
        { name: 'Tether', symbol: 'USDT', balance: '0.0000', value: '$0.00', change: '0.00%' },
        { name: 'Solana', symbol: 'SOL', balance: '0.0000', value: '$0.00', change: '0.00%' },
      ]);
    }
  };

  if (isLoading) {
    return <div className="text-white text-center py-12">Loading portfolio...</div>;
  }

  const { totalValue = 0, activePlans = [], assetAllocation = [] } = portfolioData || {};

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Investments</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Portfolio Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6">Asset Allocation</h3>
          <div className="h-80 w-full">
            {assetAllocation.length > 0 && totalValue > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetAllocation.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A1124', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No active investments to display allocation.
              </div>
            )}
          </div>
        </motion.div>

        {/* Investment Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Total Value</h3>
            <p className="text-4xl font-bold text-white mb-2">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            {totalValue > 0 && (
              <p className="text-emerald-400 flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4" /> Active Growth
              </p>
            )}
          </div>

          <div className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Active Plans</h3>
              <Link to="/dashboard/plans" className="text-sm text-nexus-gold hover:underline">View All Plans</Link>
            </div>
            <div className="space-y-4">
              {activePlans.length > 0 ? (
                activePlans.map((plan: any) => {
                  const daysLeft = Math.ceil((new Date(plan.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  const estimatedProfit = plan.amount * (plan.roi / 100);
                  return (
                    <div key={plan.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                      <div>
                        <p className="text-white font-bold">{plan.planName}</p>
                        <p className="text-xs text-slate-400">Ends in {daysLeft > 0 ? daysLeft : 0} days</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">+{plan.roi}%</p>
                        <p className="text-xs text-slate-400">${estimatedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Est. Profit</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-slate-400">
                  You have no active investment plans.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Asset List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 p-6 rounded-xl"
      >
        <h3 className="text-xl font-bold text-white mb-6">Your Assets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Balance</th>
                <th className="pb-3 font-medium">Value (USD)</th>
                <th className="pb-3 font-medium">24h Change</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {liveAssets.map((asset, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <p className="text-white font-bold">{asset.name}</p>
                      <p className="text-xs text-slate-400">{asset.symbol}</p>
                    </div>
                  </td>
                  <td className="py-4 text-slate-300 font-mono">{asset.balance}</td>
                  <td className="py-4 text-white font-bold">{asset.value}</td>
                  <td className={`py-4 font-bold ${asset.change.startsWith('+') ? 'text-emerald-400' : asset.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>{asset.change}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to="/dashboard/deposit" className="p-2 bg-nexus-blue/20 text-nexus-blue rounded-lg hover:bg-nexus-blue/30 transition-colors" title="Deposit">
                        <ArrowDownLeft className="w-4 h-4" />
                      </Link>
                      <Link to="/dashboard/withdraw" className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors" title="Withdraw">
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
