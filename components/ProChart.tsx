
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MarketDataPoint } from '../types';

interface ProChartProps {
  data: MarketDataPoint[];
}

const ProChart: React.FC<ProChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      formattedPrice: d.price.toFixed(2)
    }));
  }, [data]);

  const totalVolume = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.volume, 0);
  }, [data]);

  const lastPrice = data[data.length - 1]?.price || 0;
  const prevPrice = data[data.length - 2]?.price || 0;
  const color = lastPrice >= prevPrice ? "#10B981" : "#EF4444"; // Green or Red

  return (
    <div className="flex flex-col h-[500px] w-full bg-luxury-card rounded-xl border border-zinc-800 overflow-hidden">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-6">
            <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    GOLD / USD 
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Perpetual</span>
                </h3>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className={`text-xl font-mono font-bold ${color === '#10B981' ? 'text-green-500' : 'text-red-500'}`}>
                        {lastPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-zinc-500">Mark Price</span>
                </div>

                <div className="flex flex-col border-l border-zinc-700 pl-6">
                     <span className="text-xl font-mono font-bold text-zinc-200">
                        {totalVolume.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-500">24H Volume</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            {['15m', '1H', '4H', '1D', '1W'].map(t => (
                <button key={t} className={`text-xs px-2 py-1 rounded hover:bg-zinc-700 ${t === '1H' ? 'text-gold-500 bg-zinc-800' : 'text-zinc-500'}`}>
                    {t}
                </button>
            ))}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis 
                dataKey="time" 
                stroke="#555" 
                tick={{fontSize: 10, fill: '#666'}} 
                axisLine={false}
                tickLine={false}
            />
            <YAxis 
                domain={['auto', 'auto']} 
                orientation="right"
                stroke="#555" 
                tick={{fontSize: 11, fill: '#888'}}
                tickFormatter={(value) => value.toFixed(1)}
                axisLine={false}
                tickLine={false}
                width={50}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff', fontSize: '12px' }}
              itemStyle={{ color: color }}
              formatter={(value: number) => [value.toFixed(2), 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart (Simulated at bottom) */}
      <div className="h-16 border-t border-zinc-800 bg-zinc-900/30">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <Bar dataKey="volume" fill={color} opacity={0.3} />
            </BarChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProChart;
