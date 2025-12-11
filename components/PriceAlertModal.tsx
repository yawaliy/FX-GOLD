import React, { useState, useEffect } from 'react';
import { X, Bell, Trash2, TrendingUp, TrendingDown, Plus, AlertCircle } from 'lucide-react';
import { PriceAlert } from '../types';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrice: number;
  alerts: PriceAlert[];
  onAddAlert: (price: number, condition: 'ABOVE' | 'BELOW') => void;
  onRemoveAlert: (id: string) => void;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ 
    isOpen, onClose, currentPrice, alerts, onAddAlert, onRemoveAlert 
}) => {
    const [priceInput, setPriceInput] = useState<string>('');
    const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

    // Reset input when opening, set default based on current price
    useEffect(() => {
        if (isOpen) {
            setPriceInput(currentPrice.toFixed(2));
        }
    }, [isOpen, currentPrice]);

    // Auto-switch condition based on input value vs current price
    useEffect(() => {
        const val = parseFloat(priceInput);
        if (!isNaN(val)) {
            if (val > currentPrice) setCondition('ABOVE');
            else if (val < currentPrice) setCondition('BELOW');
        }
    }, [priceInput, currentPrice]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(priceInput);
        if (isNaN(price)) return;
        onAddAlert(price, condition);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 border-b border-zinc-800 bg-zinc-950">
                    <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-gold-500" />
                        Price Alerts
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1">Get notified when Gold hits your target.</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Add New Alert Form */}
                    <form onSubmit={handleSubmit} className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-800 space-y-4">
                        <div className="flex justify-between items-center text-xs text-zinc-500 font-bold uppercase tracking-wider">
                            <span>Set New Alert</span>
                            <span className="text-gold-500">Current: ${currentPrice.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                                <input 
                                    type="number" 
                                    value={priceInput}
                                    onChange={(e) => setPriceInput(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-3 pl-7 pr-3 text-white font-mono focus:border-gold-500 outline-none transition-colors"
                                    placeholder="2000.00"
                                    step="0.01"
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-zinc-900 px-3 rounded-lg border border-zinc-700 text-sm font-bold text-zinc-300 min-w-[100px] justify-center">
                                {condition === 'ABOVE' ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                                {condition === 'ABOVE' ? 'Above' : 'Below'}
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={!priceInput}
                            className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" /> Create Alert
                        </button>
                    </form>

                    {/* Active Alerts List */}
                    <div>
                        <h3 className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">Active Alerts</h3>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                            {alerts.length === 0 ? (
                                <div className="text-center py-6 text-zinc-600 text-sm border border-dashed border-zinc-800 rounded-lg">
                                    No active alerts
                                </div>
                            ) : (
                                alerts.map(alert => (
                                    <div key={alert.id} className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-800 group hover:border-zinc-700 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${alert.condition === 'ABOVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {alert.condition === 'ABOVE' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <div className="text-white font-mono font-bold">${alert.targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                <div className="text-[10px] text-zinc-500">
                                                    Target: {alert.condition.toLowerCase()}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onRemoveAlert(alert.id)}
                                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceAlertModal;