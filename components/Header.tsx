
import React, { useState } from 'react';
import { Menu, Diamond, Wallet, ShoppingBag, Plus, Crown, Bell, User, LogOut, Settings, LogIn, ChevronDown } from 'lucide-react';
import { UserBalance, ExchangeRate, UserProfile, Notification } from '../types';

interface HeaderProps {
  balance: UserBalance;
  rates: Record<string, ExchangeRate>;
  cartCount: number;
  isPremium: boolean;
  user: UserProfile | null;
  notifications: Notification[];
  onOpenCart: () => void;
  onOpenDeposit: () => void;
  onOpenPremium: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    balance, 
    rates,
    cartCount, 
    isPremium, 
    user, 
    notifications,
    onOpenCart, 
    onOpenDeposit, 
    onOpenPremium,
    onLoginClick,
    onLogoutClick,
    onSettingsClick
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showBalanceDetails, setShowBalanceDetails] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-luxury-black/90 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gold-600 rounded-lg flex items-center justify-center text-black shadow-lg shadow-gold-600/20">
                <Diamond className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold text-gold-400 leading-none tracking-widest">FX</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] leading-tight">Gold & Jewelry</span>
            </div>
        </div>

        {/* Desktop Balance Ticker (Compact View) */}
        {user && (
            <div className="hidden lg:flex items-center gap-3 relative">
                <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-sm transition-colors hover:bg-zinc-900">
                    <div className="flex items-center gap-2 text-gold-500 border-r border-zinc-700 pr-3">
                        <Wallet className="w-4 h-4" />
                    </div>
                    
                    <div className="flex gap-5 text-sm font-medium items-center">
                        <div className="flex flex-col leading-none">
                             <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Gold</span>
                             <span className="text-gold-300 font-mono text-xs">{balance.GOLD_OZ.toFixed(2)}oz</span>
                        </div>
                        <div className="flex flex-col leading-none">
                             <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">USD</span>
                             <span className="text-zinc-200 font-mono text-xs">${balance.USD.toLocaleString(undefined, { notation: "compact", maximumFractionDigits: 1 })}</span>
                        </div>
                         <div className="flex flex-col leading-none">
                             <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">NGN</span>
                             <span className="text-zinc-200 font-mono text-xs">₦{balance.NGN.toLocaleString(undefined, { notation: "compact", maximumFractionDigits: 1 })}</span>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-zinc-800 mx-1"></div>

                    <button 
                        onClick={() => setShowBalanceDetails(!showBalanceDetails)}
                        className="p-1 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors"
                        title="Show all balances"
                    >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showBalanceDetails ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <button 
                        onClick={onOpenDeposit}
                        className="bg-green-600/10 hover:bg-green-600/20 text-green-500 p-1.5 rounded-full transition-colors border border-green-600/20"
                        title="Quick Deposit"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Dropdown for Full Details */}
                {showBalanceDetails && (
                    <div className="absolute top-full right-0 mt-3 w-72 bg-luxury-card border border-zinc-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-3 border-b border-zinc-800 pb-2">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Portfolio</span>
                            <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">Live Rates</span>
                        </div>
                        
                        <div className="space-y-1">
                             {/* Gold */}
                             <div className="flex justify-between items-center p-2 rounded hover:bg-zinc-800/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 shadow-sm shadow-gold-500/20">
                                        <Diamond className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Gold Assets</span>
                                </div>
                                <span className="text-gold-400 font-mono font-bold text-sm">{balance.GOLD_OZ.toFixed(4)} <span className="text-[10px] text-zinc-600">OZ</span></span>
                             </div>

                             {/* Currencies */}
                             {Object.entries(balance).map(([key, value]) => {
                                 if (key === 'GOLD_OZ') return null;
                                 const rate = rates[key];
                                 
                                 let icon = null;
                                 switch(key) {
                                     case 'USD': icon = <span className="text-sm">🇺🇸</span>; break;
                                     case 'NGN': icon = <span className="text-sm">🇳🇬</span>; break;
                                     case 'EUR': icon = <span className="text-sm">🇪🇺</span>; break;
                                     case 'GBP': icon = <span className="text-sm">🇬🇧</span>; break;
                                     default: icon = <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>;
                                 }

                                 return (
                                     <div key={key} className="flex justify-between items-center p-2 rounded hover:bg-zinc-800/50 transition-colors group">
                                         <div className="flex items-center gap-3">
                                             <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700/50">
                                                 {icon}
                                             </div>
                                             <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{rate?.name || key}</span>
                                         </div>
                                         <span className="text-white font-mono text-sm">
                                             {rate?.symbol}{(value as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                         </span>
                                     </div>
                                 );
                             })}
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-800">
                             <button 
                                onClick={() => { setShowBalanceDetails(false); onOpenDeposit(); }}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors border border-zinc-700 hover:border-zinc-600"
                             >
                                <Wallet className="w-3 h-3" /> Go to Banking Hub
                             </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
             {user && (isPremium ? (
                 <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-gold-900/50 to-black px-3 py-1.5 rounded-full border border-gold-500/30">
                    <Crown className="w-4 h-4 text-gold-400 fill-gold-400" />
                    <span className="text-xs font-bold text-gold-100 uppercase tracking-widest">VIP Member</span>
                 </div>
             ) : (
                <button 
                    onClick={onOpenPremium}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-gold-600/10 hover:bg-gold-600/20 border border-gold-600/50 text-gold-400 hover:text-gold-300 rounded-full transition-all text-xs font-bold uppercase tracking-wider group"
                >
                    <Crown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Join Premium
                </button>
             ))}

             {/* Notifications */}
             <div className="relative">
                 <button 
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-2 text-zinc-300 hover:text-white relative"
                 >
                     <Bell className="w-6 h-6" />
                     {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-black"></span>
                     )}
                 </button>
                 
                 {showNotifs && (
                     <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in">
                         <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                             <span className="text-sm font-bold text-white">Notifications</span>
                             {unreadCount > 0 && <span className="text-[10px] bg-gold-600 text-black px-1.5 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                         </div>
                         <div className="max-h-64 overflow-y-auto">
                             {notifications.length === 0 ? (
                                 <div className="p-4 text-center text-zinc-500 text-sm">No new alerts.</div>
                             ) : (
                                 notifications.slice(0, 5).map(n => (
                                     <div key={n.id} className="p-3 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                         <div className="flex justify-between items-start mb-1">
                                             <span className={`text-xs font-bold ${n.type === 'ALERT' ? 'text-red-400' : n.type === 'SUCCESS' ? 'text-green-400' : 'text-gold-400'}`}>{n.title}</span>
                                             <span className="text-[10px] text-zinc-600">{n.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                         </div>
                                         <p className="text-xs text-zinc-300">{n.message}</p>
                                     </div>
                                 ))
                             )}
                         </div>
                     </div>
                 )}
             </div>

             {/* Cart Button */}
             <button 
                onClick={onOpenCart}
                className="relative p-2 text-zinc-300 hover:text-gold-400 transition-colors"
             >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
             </button>

             {/* User Profile */}
             {user ? (
                 <div className="relative">
                    <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
                    >
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300">
                                <User className="w-4 h-4" />
                            </div>
                        )}
                        <span className="text-sm font-medium text-white hidden md:block max-w-[100px] truncate">{user.name}</span>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                             <div className="p-3 border-b border-zinc-800">
                                 <p className="text-white font-bold text-sm truncate">{user.name}</p>
                                 <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                             </div>
                             <button onClick={() => {onSettingsClick(); setShowUserMenu(false);}} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2">
                                 <Settings className="w-4 h-4" /> Settings
                             </button>
                             <button onClick={onLogoutClick} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 flex items-center gap-2">
                                 <LogOut className="w-4 h-4" /> Sign Out
                             </button>
                        </div>
                    )}
                 </div>
             ) : (
                 <button 
                    onClick={onLoginClick}
                    className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-gold-500/20 transform hover:scale-105"
                 >
                     <LogIn className="w-4 h-4" /> <span className="hidden md:inline">Sign In</span>
                 </button>
             )}

            <button className="p-2 text-zinc-300 hover:text-white lg:hidden">
                <Menu className="w-6 h-6" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
