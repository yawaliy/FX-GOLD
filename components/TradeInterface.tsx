
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, AlertTriangle, X, Check, Wallet, Info, Star, Bot, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { CurrencyCode, ExchangeRate, UserBalance, Transaction } from '../types';
import { getMarketAdvice } from '../services/geminiService';

interface TradeInterfaceProps {
  rates: Record<string, ExchangeRate>;
  goldPriceUSD: number;
  balance: UserBalance;
  onTrade: (type: 'BUY' | 'SELL' | 'SWAP', amount: number, from: string, to: string) => void;
  transactions?: Transaction[];
  onOpenDeposit: () => void;
}

interface PendingTrade {
  type: 'BUY' | 'SELL' | 'SWAP';
  amount: number;
  from: string;
  to: string;
  rate: number;
  fee: number;
  estimatedReceive: number;
}

const TradeInterface: React.FC<TradeInterfaceProps> = ({ rates, goldPriceUSD, balance, onTrade, transactions = [], onOpenDeposit }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'swap'>('buy');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  
  // Swap State
  const [swapFrom, setSwapFrom] = useState<CurrencyCode>('USD');
  const [swapTo, setSwapTo] = useState<CurrencyCode>('NGN');
  const [swapAmount, setSwapAmount] = useState<string>('');
  
  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(['USD', 'NGN']);

  // Gold Trade State
  const [goldCurrency, setGoldCurrency] = useState<CurrencyCode>('USD');
  const [goldAmount, setGoldAmount] = useState<string>('');

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<PendingTrade | null>(null);

  // Insufficient Funds State
  const [insufficientFunds, setInsufficientFunds] = useState<{
    currency: string;
    amount: number;
    available: number;
  } | null>(null);

  // AI Insight State
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Helper to calculate exchange rates
  const getExchangeRate = (from: CurrencyCode, to: CurrencyCode) => {
    const fromRate = rates[from].rateToUSD;
    const toRate = rates[to].rateToUSD;
    return fromRate / toRate;
  };

  const getSymbol = (code: string) => {
    if (code === 'GOLD') return '';
    return rates[code]?.symbol || '';
  };

  const getName = (code: string) => {
    if (code === 'GOLD') return 'Gold Holdings';
    return rates[code]?.name || code;
  };

  const toggleFavorite = (currency: string) => {
    setFavorites(prev => 
      prev.includes(currency) 
        ? prev.filter(c => c !== currency)
        : [...prev, currency]
    );
  };

  const fetchInsight = async (trade: PendingTrade) => {
    setIsAiLoading(true);
    setAiInsight(null);

    const type = trade.type;
    let query = "";
    // Simplified context for the AI
    const context = `Current Gold Price: $${goldPriceUSD.toFixed(2)}. User Balance: ${balance.USD.toFixed(2)} USD.`;

    if (type === 'BUY' && trade.to === 'GOLD') {
        query = `User is buying ${trade.estimatedReceive.toFixed(4)} OZ of Gold for ${trade.amount} ${trade.from}. Provide a 1-sentence strategic insight or risk warning for this entry.`;
    } else if (type === 'SELL' && trade.from === 'GOLD') {
        query = `User is selling ${trade.amount.toFixed(4)} OZ of Gold. Provide a 1-sentence strategic insight on taking profits now.`;
    } else if (type === 'SWAP') {
        query = `User is swapping ${trade.amount} ${trade.from} to ${trade.to}. Provide a 1-sentence forex insight for this pair.`;
    }

    try {
        const advice = await getMarketAdvice(query, context);
        setAiInsight(advice);
    } catch (e) {
        setAiInsight("Market analysis temporarily unavailable.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const renderCurrencyOptions = (showName = false) => {
    const currencyCodes = Object.keys(rates);
    const favs = currencyCodes.filter(c => favorites.includes(c));
    const others = currencyCodes.filter(c => !favorites.includes(c));

    const renderOption = (c: string) => (
       <option key={c} value={c} className="bg-zinc-900 text-white">
          {c}{showName ? ` - ${rates[c].name}` : ''}
       </option>
    );

    return (
      <>
        {favs.length > 0 && (
          <optgroup label="Favorites" className="text-gold-500 font-bold bg-zinc-900">
            {favs.map(renderOption)}
          </optgroup>
        )}
        <optgroup label="All Currencies" className="text-zinc-500 font-bold bg-zinc-900">
            {others.map(renderOption)}
        </optgroup>
      </>
    );
  };

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(swapAmount);
    if (!amount || amount <= 0) return;
    if (balance[swapFrom] < amount) {
      setInsufficientFunds({
          currency: swapFrom,
          amount: amount,
          available: balance[swapFrom]
      });
      return;
    }

    const rate = getExchangeRate(swapFrom, swapTo);
    const estimatedReceive = amount * rate;
    const fee = amount * 0.001; // 0.1% Fee

    const trade: PendingTrade = {
        type: 'SWAP',
        amount,
        from: swapFrom,
        to: swapTo,
        rate,
        fee,
        estimatedReceive
    };

    setPendingTrade(trade);
    setShowConfirmModal(true);
    fetchInsight(trade);
  };

  const handleGoldTrade = (e: React.FormEvent, type: 'BUY' | 'SELL') => {
    e.preventDefault();
    const amount = parseFloat(goldAmount);
    if (!amount || amount <= 0) return;

    let trade: PendingTrade | null = null;

    if (type === 'BUY') {
        // Amount is in Currency
        if (balance[goldCurrency] < amount) {
            setInsufficientFunds({
                currency: goldCurrency,
                amount: amount,
                available: balance[goldCurrency]
            });
            return;
        }

        const goldRateInCurrency = goldPriceUSD / rates[goldCurrency].rateToUSD;
        const estQty = amount / goldRateInCurrency; 
        
        trade = {
            type: 'BUY',
            amount,
            from: goldCurrency,
            to: 'GOLD',
            rate: goldRateInCurrency,
            fee: amount * 0.001, // 0.1% fee
            estimatedReceive: estQty
        };

    } else {
        // Amount is in OZ
        if (balance.GOLD_OZ < amount) {
            alert("Insufficient Gold Holdings");
            return;
        }

        const goldRateInCurrency = goldPriceUSD / rates[goldCurrency].rateToUSD;
        const estValue = amount * goldRateInCurrency;
        const fee = estValue * 0.001; // 0.1% fee on value

        trade = {
            type: 'SELL',
            amount,
            from: 'GOLD',
            to: goldCurrency,
            rate: goldRateInCurrency,
            fee: fee,
            estimatedReceive: estValue
        };
    }

    if (trade) {
        setPendingTrade(trade);
        setShowConfirmModal(true);
        fetchInsight(trade);
    }
  };

  const confirmTrade = () => {
    if (!pendingTrade) return;
    
    onTrade(pendingTrade.type, pendingTrade.amount, pendingTrade.from, pendingTrade.to);
    
    // Clear inputs
    if (pendingTrade.type === 'SWAP') {
        setSwapAmount('');
    } else {
        setGoldAmount('');
    }

    setShowConfirmModal(false);
    setPendingTrade(null);
    setAiInsight(null);
  };

  // Preview Calculations
  const swapPreview = parseFloat(swapAmount || '0') * getExchangeRate(swapFrom, swapTo);
  const goldRateInCurrency = goldPriceUSD / rates[goldCurrency].rateToUSD;
  const buyGoldPreview = activeTab === 'buy' ? parseFloat(goldAmount || '0') / goldRateInCurrency : 0; 
  const sellGoldPreview = activeTab === 'sell' ? parseFloat(goldAmount || '0') * goldRateInCurrency : 0;

  return (
    <div className="bg-luxury-card rounded-xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col h-[500px] relative">
      
      {/* Mode Selection Buttons */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
        <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800 shadow-inner">
           <button
              onClick={() => setActiveTab('buy')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all relative overflow-hidden group ${
                activeTab === 'buy' 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/20 ring-1 ring-green-500/50' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
           >
              {activeTab === 'buy' && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>}
              <TrendingUp className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Buy</span>
           </button>
           <button
              onClick={() => setActiveTab('sell')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all relative overflow-hidden group ${
                activeTab === 'sell' 
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/20 ring-1 ring-red-500/50' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
           >
              {activeTab === 'sell' && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>}
              <TrendingDown className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Sell</span>
           </button>
           <button
              onClick={() => setActiveTab('swap')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all relative overflow-hidden group ${
                activeTab === 'swap' 
                ? 'bg-gold-600 text-black shadow-lg shadow-gold-900/20 ring-1 ring-gold-500/50' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
           >
              {activeTab === 'swap' && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>}
              <ArrowRightLeft className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Swap</span>
           </button>
        </div>
      </div>

      {/* Order Type Toggle (Only visible for Buy/Sell) */}
      {activeTab !== 'swap' && (
        <div className="flex justify-center py-2 border-b border-zinc-800/50">
            <div className="bg-zinc-900 p-1 rounded-lg inline-flex border border-zinc-800">
                <button 
                    onClick={() => setOrderType('LIMIT')}
                    className={`text-xs font-bold px-4 py-1.5 rounded-md transition-all ${orderType === 'LIMIT' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    Limit
                </button>
                <button 
                    onClick={() => setOrderType('MARKET')}
                    className={`text-xs font-bold px-4 py-1.5 rounded-md transition-all ${orderType === 'MARKET' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    Market
                </button>
            </div>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        
        {/* BUY GOLD FORM */}
        {activeTab === 'buy' && (
          <form onSubmit={(e) => handleGoldTrade(e, 'BUY')} className="space-y-4">
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
               <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Wallet Balance</label>
                  <button 
                    type="button" 
                    onClick={onOpenDeposit}
                    className="text-[10px] text-gold-500 font-bold hover:underline flex items-center gap-1"
                  >
                    <Wallet className="w-3 h-3" /> Deposit / Buy Coins
                  </button>
               </div>
               <p className="text-sm font-mono text-white">{rates[goldCurrency].symbol}{balance[goldCurrency].toLocaleString()}</p>
            </div>

            <div className="space-y-1">
               <label className="text-[10px] text-zinc-500 uppercase font-bold">Order Value</label>
               <div className="relative">
                 <input
                    type="number"
                    value={goldAmount}
                    onChange={(e) => setGoldAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:border-green-500 outline-none font-mono text-right pr-16"
                    min="0"
                    step="0.01"
                />
                <div className="absolute right-1 top-1 bottom-1">
                    <select 
                        value={goldCurrency} 
                        onChange={(e) => setGoldCurrency(e.target.value as CurrencyCode)}
                        className="h-full bg-transparent text-zinc-400 text-xs outline-none font-bold"
                    >
                        {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
               </div>
            </div>

            {orderType === 'LIMIT' && (
                 <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Limit Price</label>
                    <input
                        type="number"
                        placeholder={goldPriceUSD.toFixed(2)}
                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:border-green-500 outline-none font-mono text-right"
                        disabled
                    />
                 </div>
            )}

            <div className="py-2 border-t border-zinc-800 border-dashed">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">Est. Qty</span>
                    <span className="text-white font-mono">{buyGoldPreview.toFixed(4)} OZ</span>
                </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Fee (0.1%)</span>
                    <span className="text-white font-mono">${(parseFloat(goldAmount || '0') * 0.001).toFixed(2)}</span>
                </div>
            </div>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 text-sm">
                Buy GOLD
            </button>
          </form>
        )}

        {/* SELL GOLD FORM */}
        {activeTab === 'sell' && (
          <form onSubmit={(e) => handleGoldTrade(e, 'SELL')} className="space-y-4">
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
               <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 block">Gold Holdings</label>
               <p className="text-sm font-mono text-white">{balance.GOLD_OZ.toFixed(4)} OZ</p>
            </div>

            <div className="space-y-1">
               <label className="text-[10px] text-zinc-500 uppercase font-bold">Qty to Sell</label>
                <div className="relative">
                 <input
                    type="number"
                    value={goldAmount}
                    onChange={(e) => setGoldAmount(e.target.value)}
                    placeholder="0.0000"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:border-red-500 outline-none font-mono text-right pr-12"
                    min="0"
                    step="0.0001"
                />
                 <span className="absolute right-3 top-2 text-xs text-zinc-400 font-bold">OZ</span>
               </div>
            </div>

             <div className="space-y-1">
               <label className="text-[10px] text-zinc-500 uppercase font-bold">Receive In</label>
                <select 
                    value={goldCurrency} 
                    onChange={(e) => setGoldCurrency(e.target.value as CurrencyCode)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:border-red-500 outline-none"
                >
                    {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="py-2 border-t border-zinc-800 border-dashed">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">Est. Value</span>
                    <span className="text-white font-mono">{rates[goldCurrency].symbol}{sellGoldPreview.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                </div>
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 text-sm">
                Sell GOLD
            </button>
          </form>
        )}

        {/* SWAP CURRENCY FORM */}
        {activeTab === 'swap' && (
           <form onSubmit={handleSwap} className="space-y-4">
                 <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                     <label className="text-[10px] text-zinc-500 uppercase font-bold">From</label>
                     <button 
                        type="button"
                        onClick={() => toggleFavorite(swapFrom)}
                        className={`text-[10px] flex items-center gap-1 hover:text-white transition-colors ${favorites.includes(swapFrom) ? 'text-gold-500' : 'text-zinc-600'}`}
                        title={favorites.includes(swapFrom) ? "Remove from favorites" : "Add to favorites"}
                     >
                        <Star className={`w-3 h-3 ${favorites.includes(swapFrom) ? 'fill-current' : ''}`} />
                        {favorites.includes(swapFrom) ? 'Saved' : 'Save'}
                     </button>
                  </div>
                  <div className="flex gap-2">
                    <select 
                        value={swapFrom} 
                        onChange={(e) => setSwapFrom(e.target.value as CurrencyCode)}
                        className="bg-zinc-900 border border-zinc-700 text-white rounded px-2 py-2 focus:border-gold-500 outline-none text-xs w-1/3"
                    >
                        {renderCurrencyOptions(false)}
                    </select>
                    <input
                        type="number"
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                        placeholder="0.00"
                        className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:border-gold-500 outline-none font-mono text-right"
                        min="0"
                        step="0.01"
                    />
                  </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-zinc-800 border border-zinc-600 p-1.5 rounded-full">
                        <ArrowRightLeft className="w-3 h-3 text-gold-500" />
                    </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                     <label className="text-[10px] text-zinc-500 uppercase font-bold">To</label>
                     <button 
                        type="button"
                        onClick={() => toggleFavorite(swapTo)}
                        className={`text-[10px] flex items-center gap-1 hover:text-white transition-colors ${favorites.includes(swapTo) ? 'text-gold-500' : 'text-zinc-600'}`}
                        title={favorites.includes(swapTo) ? "Remove from favorites" : "Add to favorites"}
                     >
                        <Star className={`w-3 h-3 ${favorites.includes(swapTo) ? 'fill-current' : ''}`} />
                        {favorites.includes(swapTo) ? 'Saved' : 'Save'}
                     </button>
                  </div>
                   <select 
                        value={swapTo} 
                        onChange={(e) => setSwapTo(e.target.value as CurrencyCode)}
                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:border-gold-500 outline-none"
                    >
                        {renderCurrencyOptions(true)}
                    </select>
                </div>

                <div className="bg-zinc-900/50 rounded p-2 border border-zinc-800/50 flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Receive</span>
                    <span className="font-mono text-white">{rates[swapTo].symbol}{swapPreview.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                </div>
                
                <button type="submit" className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-3 rounded transition-all flex items-center justify-center gap-2 text-sm">
                    Swap
                </button>
            </form>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingTrade && (
          <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-gold-500/30 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden relative">
               {/* Decorative Gradient Line */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent absolute top-0"></div>
              
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                 <h3 className="text-gold-400 font-bold flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Confirm Transaction
                 </h3>
                 <button onClick={() => setShowConfirmModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>
              
              <div className="p-5 space-y-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                     <span className="text-zinc-500 text-[10px] uppercase mb-1 tracking-wider font-bold">{pendingTrade.type} Order</span>
                     <span className="text-2xl font-bold text-white font-mono">
                        {pendingTrade.type === 'SELL' 
                            ? `${pendingTrade.amount.toFixed(4)} OZ` 
                            : `${getSymbol(pendingTrade.from)}${pendingTrade.amount.toLocaleString()}`
                        }
                     </span>
                     <span className="text-zinc-500 text-[10px] mt-1 flex items-center gap-1">
                        From {getName(pendingTrade.from)}
                     </span>
                  </div>

                  <div className="space-y-3 text-sm bg-zinc-800/20 p-3 rounded-lg border border-zinc-800/50">
                     <div className="flex justify-between text-zinc-400 text-xs">
                        <span>Exchange Rate</span>
                        <span className="text-white font-mono">1 {pendingTrade.type === 'BUY' || pendingTrade.type === 'SELL' ? 'OZ' : pendingTrade.from} ≈ {pendingTrade.rate.toLocaleString(undefined, {maximumFractionDigits: 4})}</span>
                     </div>
                     
                     <div className="flex justify-between text-zinc-400 text-xs">
                        <span className="flex items-center gap-1">Platform Fee <Info className="w-3 h-3 text-zinc-600" /></span>
                        <span className="text-red-400 font-mono">
                           {pendingTrade.fee > 0 ? `-${pendingTrade.fee.toFixed(2)}` : '0.00'}
                        </span>
                     </div>
                     
                     <div className="flex justify-between text-zinc-400 border-t border-zinc-700/50 pt-3 mt-2">
                        <span>Estimated Receive</span>
                        <span className="text-green-400 font-bold font-mono text-base">
                            {pendingTrade.type === 'BUY' ? '' : getSymbol(pendingTrade.to)}
                            {pendingTrade.estimatedReceive.toLocaleString(undefined, {maximumFractionDigits: 4})}
                            {pendingTrade.type === 'BUY' ? ' OZ' : ''}
                        </span>
                     </div>
                  </div>

                  {/* AI Insight Section */}
                  <div className="bg-zinc-950/50 border border-gold-900/30 rounded-lg p-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gold-500"></div>
                        <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-gold-500/10 rounded-full mt-0.5">
                                <Bot className="w-4 h-4 text-gold-500" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[10px] font-bold text-gold-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                                    AI Market Insight
                                    {isAiLoading && <Sparkles className="w-3 h-3 animate-pulse" />}
                                </h4>
                                {isAiLoading ? (
                                    <div className="space-y-1">
                                        <div className="h-2 bg-zinc-800 rounded animate-pulse w-full"></div>
                                        <div className="h-2 bg-zinc-800 rounded animate-pulse w-3/4"></div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-300 italic leading-relaxed">
                                        "{aiInsight || 'Analyzing market conditions...'}"
                                    </p>
                                )}
                            </div>
                        </div>
                   </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => setShowConfirmModal(false)}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-lg transition-all text-xs border border-zinc-700"
                      >
                         Cancel
                      </button>
                      <button 
                        onClick={confirmTrade}
                        className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-gold-900/20"
                      >
                         <Check className="w-3 h-3" /> Confirm Trade
                      </button>
                  </div>
              </div>
            </div>
          </div>
      )}

      {/* Insufficient Funds Modal */}
      {insufficientFunds && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-red-500/30 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden relative">
               <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0"></div>
               
               <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                 <h3 className="text-red-400 font-bold flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Insufficient Funds
                 </h3>
                 <button onClick={() => setInsufficientFunds(null)} className="text-zinc-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                 </button>
               </div>
               
               <div className="p-5 space-y-4">
                  <div className="text-center">
                      <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Wallet className="w-6 h-6" />
                      </div>
                      <p className="text-zinc-300 text-sm">
                        You need more <span className="font-bold text-white">{insufficientFunds.currency}</span> to complete this trade.
                      </p>
                  </div>
                  
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-2">
                     <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Required Amount</span>
                        <span className="text-white font-mono">{getSymbol(insufficientFunds.currency)}{insufficientFunds.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Your Balance</span>
                        <span className="text-red-400 font-mono">{getSymbol(insufficientFunds.currency)}{insufficientFunds.available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => setInsufficientFunds(null)}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-lg transition-all text-xs border border-zinc-700"
                      >
                         Cancel
                      </button>
                      <button 
                        onClick={() => {
                            setInsufficientFunds(null);
                            onOpenDeposit();
                        }}
                        className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-gold-900/20"
                      >
                         <Wallet className="w-3 h-3" /> Deposit Funds
                      </button>
                  </div>
              </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default TradeInterface;
