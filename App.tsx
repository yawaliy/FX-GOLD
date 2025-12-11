
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProChart from './components/ProChart';
import TradeInterface from './components/TradeInterface';
import AIAssistant from './components/AIAssistant';
import MarketStrategy from './components/MarketStrategy';
import TransactionHistory from './components/TransactionHistory';
import OrderBook from './components/OrderBook';
import ProductMarketplace from './components/ProductMarketplace';
import CartDrawer from './components/CartDrawer';
import PaymentModal from './components/PaymentModal';
import PremiumModal from './components/PremiumModal';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import PriceAlertModal from './components/PriceAlertModal';
import { INITIAL_RATES, INITIAL_BALANCE, INITIAL_GOLD_PRICE_USD_PER_OZ, PRODUCTS } from './constants';
import { UserBalance, MarketDataPoint, CurrencyCode, Transaction, Product, CartItem, UserProfile, Notification, TransactionType, PriceAlert } from './types';
import { LayoutDashboard, ShoppingBag, History, Bell } from 'lucide-react';

// Utility to generate fake chart data
const generateChartData = (basePrice: number): MarketDataPoint[] => {
  const data: MarketDataPoint[] = [];
  const now = new Date();
  for (let i = 50; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15 * 60 * 1000); // 15 min candles
    const fluctuation = basePrice * (0.02 * Math.random() - 0.01);
    const price = basePrice + fluctuation;
    const open = price - (Math.random() * 2);
    const close = price;
    const high = Math.max(open, close) + Math.random();
    const low = Math.min(open, close) - Math.random();
    const volume = Math.floor(Math.random() * 1000);

    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price,
      open,
      high,
      low,
      close,
      volume
    });
  }
  return data;
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'EXCHANGE' | 'STORE'>('EXCHANGE');
  const [balance, setBalance] = useState<UserBalance>(INITIAL_BALANCE);
  const [rates, setRates] = useState(INITIAL_RATES);
  const [goldPrice, setGoldPrice] = useState(INITIAL_GOLD_PRICE_USD_PER_OZ);
  const [chartData, setChartData] = useState<MarketDataPoint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Auth & User State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Price Alerts State
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // E-Commerce & Payment States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean, type: 'CHECKOUT' | 'DEPOSIT' | 'PREMIUM' | 'BANKING', amount: number }>({
    isOpen: false,
    type: 'CHECKOUT',
    amount: 0
  });

  const addNotification = (title: string, message: string, type: 'ALERT' | 'INFO' | 'SUCCESS' | 'AI' = 'INFO') => {
    const newNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        message,
        type,
        read: false,
        timestamp: new Date()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Simulate Live Market Updates & Alerts
  useEffect(() => {
    setChartData(generateChartData(INITIAL_GOLD_PRICE_USD_PER_OZ));
    
    // Initial welcome notif
    addNotification("Welcome to FX Gold", "Start trading by depositing funds.", "INFO");

    const interval = setInterval(() => {
      setGoldPrice(prev => {
        const changePercent = (0.003 * Math.random() - 0.0015); // +/- 0.15%
        const change = prev * changePercent;
        const newPrice = prev + change;

        // Market Alerts logic
        if (Math.abs(changePercent) > 0.001) { // If move is > 0.1% in 3s (high volatility)
            const direction = change > 0 ? "UP" : "DOWN";
            if (Math.random() > 0.7) { // Don't spam
                addNotification(
                    `Market Alert: Gold ${direction}`, 
                    `Gold is moving ${direction} sharply! Current: $${newPrice.toFixed(2)}`,
                    "ALERT"
                );
            }
        }
        
        setChartData(prevData => {
            const lastPoint = prevData[prevData.length - 1];
            const newData = [...prevData.slice(1)];
            newData.push({
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                price: newPrice,
                open: lastPoint.close,
                high: Math.max(lastPoint.close, newPrice) + 0.5,
                low: Math.min(lastPoint.close, newPrice) - 0.5,
                close: newPrice,
                volume: Math.floor(Math.random() * 500 + 100)
            });
            return newData;
        });

        return newPrice;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Check Price Alerts
  useEffect(() => {
    setAlerts(prevAlerts => {
      let hasChanges = false;
      const nextAlerts = prevAlerts.map(alert => {
        if (!alert.active) return alert;

        const isTriggered = 
          (alert.condition === 'ABOVE' && goldPrice >= alert.targetPrice) ||
          (alert.condition === 'BELOW' && goldPrice <= alert.targetPrice);

        if (isTriggered) {
          hasChanges = true;
          addNotification(
            "Price Alert Triggered", 
            `Gold has reached your target of $${alert.targetPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 
            "ALERT"
          );
          return { ...alert, active: false };
        }
        return alert;
      });
      
      return hasChanges ? nextAlerts : prevAlerts;
    });
  }, [goldPrice]);

  const handleLogin = (userProfile: UserProfile) => {
    setUser(userProfile);
    setIsAuthModalOpen(false);
    addNotification("Signed In", `Welcome back, ${userProfile.name}!`, "SUCCESS");
  };

  const handleAddAlert = (price: number, condition: 'ABOVE' | 'BELOW') => {
    const newAlert: PriceAlert = {
        id: Math.random().toString(36).substr(2, 9),
        targetPrice: price,
        condition,
        active: true,
        createdAt: new Date()
    };
    setAlerts(prev => [...prev, newAlert]);
    addNotification("Alert Set", `We'll notify you when Gold hits $${price.toFixed(2)}`, "SUCCESS");
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleTrade = (type: 'BUY' | 'SELL' | 'SWAP', amount: number, from: string, to: string) => {
    if (!user) {
        setIsAuthModalOpen(true);
        return;
    }
    setBalance(prev => {
        const newBalance = { ...prev };

        if (type === 'BUY') {
            const currencyAmount = amount;
            const rate = rates[from].rateToUSD;
            const usdValue = currencyAmount * rate;
            const goldOunces = usdValue / goldPrice;

            newBalance[from as CurrencyCode] -= currencyAmount;
            newBalance.GOLD_OZ += goldOunces;
            
            addTransaction(TransactionType.BUY_GOLD, currencyAmount, from as CurrencyCode, usdValue, goldOunces, 'GOLD');
        } 
        else if (type === 'SELL') {
            const goldOunces = amount;
            const usdValue = goldOunces * goldPrice;
            const currencyAmount = usdValue / rates[to].rateToUSD;

            newBalance.GOLD_OZ -= goldOunces;
            newBalance[to as CurrencyCode] += currencyAmount;

            addTransaction(TransactionType.SELL_GOLD, goldOunces, 'GOLD', usdValue, currencyAmount, to as CurrencyCode);
        }
        else if (type === 'SWAP') {
            const fromRateUSD = rates[from].rateToUSD;
            const toRateUSD = rates[to].rateToUSD;
            const usdValue = amount * fromRateUSD;
            const toAmount = usdValue / toRateUSD;

            newBalance[from as CurrencyCode] -= amount;
            newBalance[to as CurrencyCode] += toAmount;

            addTransaction(TransactionType.SWAP_CURRENCY, amount, from as CurrencyCode, usdValue, toAmount, to as CurrencyCode);
        }

        return newBalance;
    });
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const startCheckout = () => {
    if (!user) {
        setIsAuthModalOpen(true);
        return;
    }
    const total = cart.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);
    setIsCartOpen(false);
    setPaymentModal({ isOpen: true, type: 'CHECKOUT', amount: total });
  };

  const startBanking = () => {
     if (!user) {
        setIsAuthModalOpen(true);
        return;
     }
    setPaymentModal({ isOpen: true, type: 'BANKING', amount: 0 });
  };

  const startPremiumUpgrade = () => {
    if (!user) {
        setIsAuthModalOpen(true);
        return;
    }
    setIsPremiumModalOpen(false);
    setPaymentModal({ isOpen: true, type: 'PREMIUM', amount: 499 });
  };

  const handlePaymentProcessing = (method: string, data?: any) => {
    const { type, amount } = paymentModal;

    if (type === 'CHECKOUT') {
      if (method === 'WALLET') {
        setBalance(prev => ({ ...prev, USD: prev.USD - amount }));
      }
      cart.forEach(item => {
        addTransaction(TransactionType.BUY_ITEM, item.priceUSD * item.quantity, 'USD', item.priceUSD * item.quantity, 0, undefined, item.name);
      });
      setCart([]);
      setPaymentModal({ ...paymentModal, isOpen: false });
      addNotification("Order Placed", "Your luxury items are being prepared for shipping.", "SUCCESS");
    } 
    else if (type === 'BANKING' || type === 'DEPOSIT') {
        // Handle Deposit
        if (!data || data.operation === 'DEPOSIT') {
             const depAmount = data?.amount || amount;
             setBalance(prev => ({ ...prev, USD: prev.USD + depAmount }));
             addTransaction(TransactionType.DEPOSIT, depAmount, 'USD', depAmount);
             addNotification("Deposit Successful", `$${depAmount} added to your wallet.`, "SUCCESS");
        } 
        // Handle Withdraw
        else if (data.operation === 'WITHDRAW') {
             const withAmount = data.amount;
             setBalance(prev => ({ ...prev, USD: prev.USD - withAmount }));
             addTransaction(TransactionType.WITHDRAW, withAmount, 'USD', withAmount);
             addNotification("Withdrawal Processed", `$${withAmount} sent to your ${method}.`, "SUCCESS");
        }
        // Handle Transfer
        else if (data.operation === 'TRANSFER') {
            const transAmount = data.amount;
            setBalance(prev => ({ ...prev, USD: prev.USD - transAmount }));
            addTransaction(TransactionType.TRANSFER, transAmount, 'USD', transAmount, 0, undefined, `Transfer to ${data.recipient}`);
            addNotification("Transfer Sent", `$${transAmount} sent abroad successfully.`, "SUCCESS");
        }
        setPaymentModal({ ...paymentModal, isOpen: false });
    }
    else if (type === 'PREMIUM') {
      if (method === 'WALLET') {
        setBalance(prev => ({ ...prev, USD: prev.USD - amount }));
      }
      setIsPremium(true);
      addTransaction(TransactionType.BUY_ITEM, amount, 'USD', amount, 0, undefined, 'Premium Membership (1 Year)');
      setPaymentModal({ ...paymentModal, isOpen: false });
      addNotification("Welcome to VIP", "You are now a Premium member.", "SUCCESS");
    }
  };

  const addTransaction = (
      type: TransactionType, 
      amount: number, 
      currency: string, 
      usdValue: number,
      toAmount?: number,
      toCurrency?: string,
      itemName?: string
    ) => {
    setTransactions(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        type,
        date: new Date(),
        amount,
        currency: currency as any,
        toAmount,
        toCurrency: toCurrency as any,
        itemName,
        totalValueUSD: usdValue,
        status: 'completed'
    }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-500 selection:text-black flex flex-col">
      <Header 
        balance={balance} 
        rates={rates} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        isPremium={isPremium}
        user={user}
        notifications={notifications}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenDeposit={startBanking}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={() => { setUser(null); addNotification("Signed Out", "See you soon.", "INFO"); }}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Navigation Tabs */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <div className="container mx-auto px-4 flex gap-6">
              <button 
                onClick={() => setActiveView('EXCHANGE')}
                className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeView === 'EXCHANGE' ? 'border-gold-500 text-gold-500' : 'border-transparent text-zinc-400 hover:text-white'}`}
              >
                  <LayoutDashboard className="w-4 h-4" />
                  Exchange & Trade
              </button>
              <button 
                onClick={() => setActiveView('STORE')}
                className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeView === 'STORE' ? 'border-gold-500 text-gold-500' : 'border-transparent text-zinc-400 hover:text-white'}`}
              >
                  <ShoppingBag className="w-4 h-4" />
                  Luxury Store
              </button>

              <div className="ml-auto flex items-center">
                   <button 
                      onClick={() => setIsAlertModalOpen(true)}
                      className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-gold-400 transition-colors py-4"
                   >
                       <Bell className="w-4 h-4" />
                       <span className="hidden sm:inline">Price Alerts</span>
                   </button>
              </div>
          </div>
      </div>

      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        
        {activeView === 'EXCHANGE' && (
            <div className="grid grid-cols-12 gap-4 h-full max-w-[1920px] mx-auto">
                {/* Left: Chart & Strategy */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                    <ProChart data={chartData} />
                    <MarketStrategy data={chartData} />
                </div>

                {/* Right: OrderBook & Trade */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                        <OrderBook currentPrice={goldPrice} />
                        <TradeInterface 
                            rates={rates} 
                            goldPriceUSD={goldPrice} 
                            balance={balance} 
                            onTrade={handleTrade}
                            transactions={transactions}
                            onOpenDeposit={startBanking}
                        />
                     </div>
                </div>

                {/* Bottom: Activity (Full width) */}
                <div className="col-span-12 bg-luxury-card rounded-xl border border-zinc-800 p-4">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-zinc-400 text-sm font-bold uppercase">Recent Activity</h3>
                        <button 
                            onClick={() => setIsHistoryOpen(true)}
                            className="text-xs text-gold-500 hover:text-gold-300 transition-colors flex items-center gap-1 hover:underline"
                        >
                            <History className="w-3 h-3" />
                            Full History
                        </button>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="text-zinc-500 uppercase border-b border-zinc-800">
                                <tr>
                                    <th className="pb-2">Time</th>
                                    <th className="pb-2">Type</th>
                                    <th className="pb-2">Details</th>
                                    <th className="pb-2">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {transactions.slice(0, 3).map(tx => (
                                    <tr key={tx.id} className="text-zinc-300">
                                        <td className="py-2">{tx.date.toLocaleTimeString()}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                                                (tx.type as string).includes('BUY') ? 'bg-green-500/10 text-green-500' : 
                                                (tx.type as string).includes('SELL') ? 'bg-red-500/10 text-red-500' : 
                                                (tx.type as string) === 'DEPOSIT' ? 'bg-gold-500/10 text-gold-500' :
                                                'bg-blue-500/10 text-blue-500'
                                            }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="py-2">
                                            {tx.itemName ? tx.itemName : `${tx.amount.toFixed(4)} ${tx.currency}`}
                                        </td>
                                        <td className="py-2 text-zinc-500">${tx.totalValueUSD.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            </div>
        )}

        {activeView === 'STORE' && (
            <div className="max-w-7xl mx-auto">
                <ProductMarketplace 
                    products={PRODUCTS} 
                    onAddToCart={handleAddToCart}
                    balance={balance}
                    rates={Object.values(rates)}
                />
            </div>
        )}

      </main>

      <AIAssistant balance={balance} goldPrice={goldPrice} rates={rates} />
      
      <TransactionHistory 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        transactions={transactions} 
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={handleRemoveFromCart}
        onCheckout={startCheckout}
      />

      <PaymentModal 
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        type={paymentModal.type}
        totalAmount={paymentModal.amount}
        balance={balance}
        onProcessPayment={handlePaymentProcessing}
      />

      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        onUpgrade={startPremiumUpgrade}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {user && (
          <SettingsModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            user={user}
            onUpdateUser={setUser}
          />
      )}

      <PriceAlertModal 
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        currentPrice={goldPrice}
        alerts={alerts}
        onAddAlert={handleAddAlert}
        onRemoveAlert={handleRemoveAlert}
      />

    </div>
  );
};

export default App;
