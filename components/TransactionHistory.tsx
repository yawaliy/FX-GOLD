import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRightLeft, RefreshCw, Calendar, DollarSign, Filter } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ isOpen, onClose, transactions }) => {
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'SWAP'>('ALL');
  const [sort, setSort] = useState<'DATE_DESC' | 'DATE_ASC' | 'VALUE_DESC'>('DATE_DESC');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Filter by Type
      if (filter !== 'ALL') {
        const typeStr = (t.type as string).toUpperCase();
        if (filter === 'BUY' && !typeStr.includes('BUY')) return false;
        if (filter === 'SELL' && !typeStr.includes('SELL')) return false;
        if (filter === 'SWAP' && !typeStr.includes('SWAP')) return false;
      }

      // Filter by Search (ID or Amount or Currency)
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(searchLower);
        const matchesCurrency = t.currency.toLowerCase().includes(searchLower) || (t.toCurrency?.toLowerCase().includes(searchLower));
        return matchesId || matchesCurrency;
      }
      
      return true;
    }).sort((a, b) => {
      if (sort === 'DATE_DESC') return b.date.getTime() - a.date.getTime();
      if (sort === 'DATE_ASC') return a.date.getTime() - b.date.getTime();
      if (sort === 'VALUE_DESC') return b.totalValueUSD - a.totalValueUSD;
      return 0;
    });
  }, [transactions, filter, sort, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-luxury-card w-full max-w-4xl max-h-[90vh] rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h2 className="text-2xl font-serif text-gold-400 font-bold">Transaction History</h2>
            <p className="text-zinc-500 text-sm">View and manage your trading activity</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 bg-zinc-900/30 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
             {(['ALL', 'BUY', 'SELL', 'SWAP'] as const).map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                   filter === f ? 'bg-gold-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                 }`}
               >
                 {f === 'ALL' ? 'All Transactions' : f === 'BUY' ? 'Buy Gold' : f === 'SELL' ? 'Sell Gold' : 'Swaps'}
               </button>
             ))}
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative flex-1 md:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search ID or Currency..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:border-gold-500 outline-none w-full md:w-48 placeholder-zinc-500"
              />
            </div>
            <div className="relative">
                <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value as any)}
                className="pl-3 pr-8 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:border-gold-500 outline-none appearance-none cursor-pointer"
                >
                <option value="DATE_DESC">Newest First</option>
                <option value="DATE_ASC">Oldest First</option>
                <option value="VALUE_DESC">Highest Value</option>
                </select>
                <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/90 text-zinc-500 font-medium border-b border-zinc-800 sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Value (USD)</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-600">
                            <Search className="w-6 h-6" />
                        </div>
                        <p>No transactions found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${
                           (tx.type as string).includes('BUY') ? 'bg-green-500/10 text-green-500' :
                           (tx.type as string).includes('SELL') ? 'bg-red-500/10 text-red-500' :
                           'bg-blue-500/10 text-blue-500'
                         }`}>
                           {(tx.type as string).includes('SWAP') ? <ArrowRightLeft className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                         </div>
                         <div>
                           <div className="font-medium text-white capitalize">{(tx.type as string).toLowerCase().replace('_', ' ')}</div>
                           <div className="text-xs text-zinc-500 font-mono">#{tx.id}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-zinc-600" />
                          <span>{tx.date.toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-zinc-500 pl-5">{tx.date.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {(tx.type as string).includes('SELL') ? '-' : '+'}{tx.amount.toLocaleString(undefined, {maximumFractionDigits: 4})} <span className="text-zinc-500 text-xs">{tx.currency}</span>
                      </div>
                      {tx.toAmount && (
                         <div className="text-xs text-gold-500 mt-1 flex items-center gap-1">
                           <ArrowRightLeft className="w-3 h-3" /> {tx.toAmount.toLocaleString(undefined, {maximumFractionDigits: 4})} {tx.toCurrency}
                         </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-zinc-600" />
                          {tx.totalValueUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;