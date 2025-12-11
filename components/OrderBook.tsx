
import React, { useMemo } from 'react';

interface OrderBookProps {
  currentPrice: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ currentPrice }) => {
  // Generate mock order book data centered around current price
  const { asks, bids } = useMemo(() => {
    const asks = [];
    const bids = [];
    
    for (let i = 0; i < 8; i++) {
        const askPrice = currentPrice + (Math.random() * 2) + (i * 0.5);
        const askSize = Math.random() * 5;
        asks.push({ price: askPrice, size: askSize, total: askPrice * askSize }); // Ascending price

        const bidPrice = currentPrice - (Math.random() * 2) - (i * 0.5);
        const bidSize = Math.random() * 5;
        bids.push({ price: bidPrice, size: bidSize, total: bidPrice * bidSize }); // Descending price
    }
    return { asks: asks.reverse(), bids }; // Asks need to be sorted high to low visually for the stack
  }, [currentPrice]); // Updates when price changes roughly

  return (
    <div className="bg-luxury-card rounded-xl border border-zinc-800 flex flex-col h-[500px] overflow-hidden">
        <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Order Book</h3>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-3 px-3 py-2 text-[10px] text-zinc-500 uppercase">
            <span>Price (USD)</span>
            <span className="text-right">Size (OZ)</span>
            <span className="text-right">Sum (USD)</span>
        </div>

        {/* Asks (Sell Orders) - Red */}
        <div className="flex-1 overflow-hidden flex flex-col justify-end pb-1">
             {asks.map((ask, i) => (
                 <div key={i} className="grid grid-cols-3 px-3 py-0.5 text-xs hover:bg-zinc-800/50 cursor-pointer relative group">
                    <span className="text-red-500 font-mono z-10 relative">{ask.price.toFixed(2)}</span>
                    <span className="text-right text-zinc-300 font-mono z-10 relative">{ask.size.toFixed(3)}</span>
                    <span className="text-right text-zinc-500 font-mono z-10 relative">{(ask.price * ask.size).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                    <div className="absolute top-0 right-0 bottom-0 bg-red-500/10 transition-all duration-300" style={{ width: `${Math.random() * 100}%` }}></div>
                 </div>
             ))}
        </div>

        {/* Current Price Indicator */}
        <div className="py-2 px-3 border-y border-zinc-800 bg-zinc-900 flex items-center justify-between">
            <span className={`text-lg font-bold ${currentPrice % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
                {currentPrice.toFixed(2)} <span className="text-xs text-zinc-500">USD</span>
            </span>
            <span className="text-xs text-zinc-500">Index Price</span>
        </div>

        {/* Bids (Buy Orders) - Green */}
        <div className="flex-1 overflow-hidden pt-1">
            {bids.map((bid, i) => (
                 <div key={i} className="grid grid-cols-3 px-3 py-0.5 text-xs hover:bg-zinc-800/50 cursor-pointer relative">
                    <span className="text-green-500 font-mono z-10 relative">{bid.price.toFixed(2)}</span>
                    <span className="text-right text-zinc-300 font-mono z-10 relative">{bid.size.toFixed(3)}</span>
                    <span className="text-right text-zinc-500 font-mono z-10 relative">{(bid.price * bid.size).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                    <div className="absolute top-0 right-0 bottom-0 bg-green-500/10 transition-all duration-300" style={{ width: `${Math.random() * 100}%` }}></div>
                 </div>
             ))}
        </div>
    </div>
  );
};

export default OrderBook;
