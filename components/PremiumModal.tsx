import React from 'react';
import { X, Crown, Check, Sparkles, Zap, Shield } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-zinc-900 rounded-2xl border border-gold-500 overflow-hidden shadow-2xl shadow-gold-500/20 animate-in zoom-in-95 duration-300">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white z-10 p-1 hover:bg-zinc-800 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2">
            {/* Left Side: Pitch */}
            <div className="p-8 flex flex-col justify-center relative bg-gradient-to-br from-zinc-900 to-black">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-300 to-gold-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gold-500/30">
                    <Crown className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    FX Gold <span className="text-gold-400">Premium</span>
                </h2>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                    Unlock the full potential of your trading portfolio with exclusive tools, lower fees, and priority services designed for serious investors.
                </p>
                <div className="mt-auto">
                    <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold mb-1">Membership Price</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">$499</span>
                        <span className="text-zinc-500">/ year</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Features */}
            <div className="p-8 bg-zinc-800/30 border-l border-zinc-800 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    Elite Benefits
                </h3>
                
                <ul className="space-y-4 mb-8">
                    {[
                        { icon: Zap, text: "0% Transaction Fees on Gold", sub: "Save significantly on every trade" },
                        { icon: Shield, text: "Priority Physical Delivery", sub: "Insured, expedited shipping worldwide" },
                        { icon: Crown, text: "Dedicated Account Manager", sub: "24/7 personal trading concierge" },
                        { icon: Sparkles, text: "Advanced AI Signals", sub: "Get predicted trends 15m early" }
                    ].map((feature, i) => (
                        <li key={i} className="flex gap-4 items-start group">
                            <div className="mt-1 min-w-[24px] h-6 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                                <feature.icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <p className="text-zinc-200 font-medium text-sm">{feature.text}</p>
                                <p className="text-zinc-500 text-xs">{feature.sub}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <button 
                    onClick={onUpgrade}
                    className="w-full bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold py-4 rounded-xl transition-all shadow-xl shadow-gold-900/20 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                    <Crown className="w-5 h-5" />
                    Join Premium Now
                </button>
                <p className="text-center text-[10px] text-zinc-600 mt-4">
                    Auto-renews annually. Cancel anytime.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;