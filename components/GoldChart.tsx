import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { MarketDataPoint } from '../types';

interface GoldChartProps {
  data: MarketDataPoint[];
  color?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MarketDataPoint;
    return (
      <div className="bg-zinc-900 border border-gold-500 p-3 rounded-lg shadow-xl backdrop-blur-md bg-opacity-95">
        <p className="text-zinc-400 mb-2 text-xs font-bold border-b border-zinc-800 pb-1">{label}</p>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex justify-between items-center gap-8">
            <span className="text-gold-400 font-bold">Price</span>
            <span className="text-white font-bold">${data.price.toFixed(2)}</span>
          </div>
          <div className="w-full h-px bg-zinc-800 my-1"></div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-zinc-500">Open</span>
            <span className="text-zinc-300">${data.open.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-green-500">High</span>
            <span className="text-zinc-300">${data.high.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-red-500">Low</span>
            <span className="text-zinc-300">${data.low.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-zinc-500">Close</span>
            <span className="text-zinc-300">${data.close.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const GoldChart: React.FC<GoldChartProps> = ({ data, color = "#D4AF37" }) => {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      formattedPrice: d.price.toFixed(2)
    }));
  }, [data]);

  return (
    <div className="w-full h-64 md:h-80 bg-luxury-card rounded-xl p-4 border border-zinc-800 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gold-light font-serif text-lg">Gold Price (USD/oz) - 24H Trend</h3>
        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">Live Data</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#666" 
            tick={{fontSize: 12}} 
            tickMargin={10}
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            stroke="#666" 
            tick={{fontSize: 12}}
            tickFormatter={(value) => `$${value}`}
            width={60}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: '#666', strokeDasharray: '3 3' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GoldChart;