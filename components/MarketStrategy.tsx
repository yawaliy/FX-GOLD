import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, BarChart2 } from 'lucide-react';
import { MarketDataPoint } from '../types';

interface MarketStrategyProps {
  data: MarketDataPoint[];
}

const MarketStrategy: React.FC<MarketStrategyProps> = ({ data }) => {
  const analysis = useMemo(() => {
    if (data.length < 20) return null;

    const prices = data.map(d => d.price);
    
    // SMA Calculations
    const sma5 = prices.slice(-5).reduce((a, b) => a + b, 0) / 5;
    const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
    
    // RSI Calculation (simplified 14 periods)
    let gains = 0;
    let losses = 0;
    for (let i = prices.length - 14; i < prices.length; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }
    const avgGain = gains / 14;
    const avgLoss = Math.abs(losses) / 14;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss; 
    const rsi = 100 - (100 / (1 + rs));

    // Signal Logic
    let signal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let strength = 'LOW';
    
    if (sma5 > sma20) {
        signal = 'BUY';
        strength = sma5 - sma20 > 5 ? 'STRONG' : 'MODERATE';
    } else if (sma5 < sma20) {
        signal = 'SELL';
        strength = sma20 - sma5 > 5 ? 'STRONG' : 'MODERATE';
    }

    // Support/Resistance (Min/Max of visible range)
    const resistance = Math.max(...prices);
    const support = Math.min(...prices);

    return {
        signal,
        strength,
        rsi,
        sma5,
        sma20,
        support,
        resistance
    };
  }, [data]);

  if (!analysis) return null;

  const getSignalColor = (s: string) => {
    if (s === 'BUY') return 'text-green-500';
    if (s === 'SELL') return 'text-red-500';
    return 'text-zinc-400';
  };

  const getSignalBg = (s: string) => {
    if (s === 'BUY') return 'bg-green-500/10 border-green-500/30';
    if (s === 'SELL') return 'bg-red-500/10 border-red-500/30';
    return 'bg-zinc-800 border-zinc-700';
  };

  return (
    <div className="bg-luxury-card rounded-xl border border-zinc-800 p-6 shadow-xl relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 rounded-full blur-3xl -mr-32 -mt-32 ${analysis.signal === 'BUY' ? 'bg-green-500' : analysis.signal === 'SELL' ? 'bg-red-500' : 'bg-zinc-500'}`}></div>

        <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-500/10 rounded-lg text-gold-500">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-gold-100 font-serif font-semibold text-lg">Technical Analysis</h3>
                    <p className="text-xs text-zinc-500">Real-time Strategy Signal</p>
                </div>
            </div>
            <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${getSignalBg(analysis.signal)}`}>
                {analysis.signal === 'BUY' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {analysis.signal === 'SELL' && <TrendingDown className="w-4 h-4 text-red-500" />}
                {analysis.signal === 'NEUTRAL' && <Minus className="w-4 h-4 text-zinc-400" />}
                <span className={`font-bold tracking-wider text-sm ${getSignalColor(analysis.signal)}`}>
                    {analysis.strength} {analysis.signal}
                </span>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">RSI (14)</span>
                <span className={`font-mono text-lg font-medium ${analysis.rsi > 70 ? 'text-red-400' : analysis.rsi < 30 ? 'text-green-400' : 'text-zinc-200'}`}>
                    {analysis.rsi.toFixed(1)}
                </span>
            </div>
             <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">SMA (5) Trend</span>
                <span className="font-mono text-lg font-medium text-gold-400">${analysis.sma5.toFixed(0)}</span>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Resistance</span>
                <span className="font-mono text-lg font-medium text-red-400">${analysis.resistance.toFixed(0)}</span>
            </div>
             <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Support</span>
                <span className="font-mono text-lg font-medium text-green-400">${analysis.support.toFixed(0)}</span>
            </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-500 bg-zinc-900/30 p-2 rounded relative z-10">
             <BarChart2 className="w-3 h-3 text-gold-600" />
             <span>Strategy based on SMA(5/20) Crossover & RSI Momentum indicators. Signals refresh every 3s.</span>
        </div>
    </div>
  );
};

export default MarketStrategy;