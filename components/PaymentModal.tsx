
import React, { useState } from 'react';
import { CreditCard, Bitcoin, Wallet, X, Check, Loader, ShieldCheck, Crown, ExternalLink, ArrowRight, Banknote, Globe } from 'lucide-react';
import { UserBalance } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'CHECKOUT' | 'DEPOSIT' | 'PREMIUM' | 'BANKING'; // Expanded type
  totalAmount: number;
  balance?: UserBalance;
  onProcessPayment: (method: string, data?: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  totalAmount, 
  balance, 
  onProcessPayment 
}) => {
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'TRANSFER'>('DEPOSIT');
  const [method, setMethod] = useState<'CARD' | 'PAYPAL' | 'CRYPTO' | 'WALLET' | 'BANK'>('CARD');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Banking Inputs
  const [amount, setAmount] = useState<string>(totalAmount > 0 ? totalAmount.toString() : '');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferType, setTransferType] = useState<'CRYPTO_ADDRESS' | 'EMAIL' | 'WIRE'>('CRYPTO_ADDRESS');
  const [cryptoAddress, setCryptoAddress] = useState('');

  // Card Inputs (Visual only)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  if (!isOpen) return null;

  // Set default tab if opened in generic banking mode
  React.useEffect(() => {
    if (type === 'BANKING') setActiveTab('DEPOSIT');
  }, [type]);

  const handleProcess = () => {
    setProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        // Construct data payload based on operation
        const payload = {
            amount: parseFloat(amount),
            recipient: transferRecipient,
            address: cryptoAddress,
            operation: type === 'BANKING' ? activeTab : type
        };
        onProcessPayment(method, payload);
        
        // Reset and close
        setSuccess(false); 
        setAmount('');
        setTransferRecipient('');
      }, 1500);
    }, 2000);
  };

  const getTitle = () => {
    if (type === 'CHECKOUT') return 'Secure Checkout';
    if (type === 'PREMIUM') return 'Upgrade to Premium';
    if (type === 'DEPOSIT') return 'Deposit Funds';
    return 'Banking Hub';
  };

  const handleBuyCryptoRedirect = () => {
    window.open('https://example.com/buy-crypto', '_blank');
  };

  const renderDepositOptions = () => (
    <>
        <div className="w-full md:w-1/3 bg-zinc-950 p-2 md:border-r border-zinc-800 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            <button onClick={() => setMethod('CARD')} className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all whitespace-nowrap ${method === 'CARD' ? 'bg-gold-600 text-black' : 'text-zinc-400 hover:bg-zinc-900'}`}>
                <CreditCard className="w-4 h-4" /> Credit Card
            </button>
            <button onClick={() => setMethod('PAYPAL')} className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all whitespace-nowrap ${method === 'PAYPAL' ? 'bg-gold-600 text-black' : 'text-zinc-400 hover:bg-zinc-900'}`}>
                <span className="font-bold italic">P</span> PayPal
            </button>
            <button onClick={() => setMethod('CRYPTO')} className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all whitespace-nowrap ${method === 'CRYPTO' ? 'bg-gold-600 text-black' : 'text-zinc-400 hover:bg-zinc-900'}`}>
                <Bitcoin className="w-4 h-4" /> Deposit Crypto
            </button>
        </div>
        
        <div className="flex-1 p-6 flex flex-col">
            {type === 'BANKING' && (
                <div className="mb-4">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Deposit Amount (USD)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-xl font-mono outline-none focus:border-gold-500" />
                </div>
            )}
            
            {/* Payment Forms Reuse from previous version... simplified for brevity */}
            {method === 'CARD' && (
                <div className="space-y-4 animate-in fade-in">
                    <input type="text" placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-gold-500 font-mono text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-gold-500 font-mono text-sm" />
                        <input type="text" placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-gold-500 font-mono text-sm" />
                    </div>
                </div>
            )}
            
            {method === 'CRYPTO' && (
                <div className="space-y-4 animate-in fade-in">
                    <p className="text-sm text-zinc-400">Send crypto to this address to fund your wallet:</p>
                     <div className="bg-zinc-800/50 p-3 rounded border border-zinc-700">
                        <p className="text-xs text-zinc-500 mb-1">USDT (ERC-20) Address:</p>
                        <p className="font-mono text-xs text-gold-500 break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                     </div>
                     <button onClick={handleBuyCryptoRedirect} className="w-full bg-zinc-900 hover:bg-zinc-800 text-gold-400 border border-gold-500/30 p-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors mt-2">
                         <ExternalLink className="w-4 h-4" /> Buy Crypto on Exchange
                     </button>
                </div>
            )}

            <button onClick={handleProcess} disabled={processing || !amount} className="mt-auto w-full bg-white text-black hover:bg-gold-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                {processing ? <Loader className="w-5 h-5 animate-spin" /> : 'Confirm Deposit'}
            </button>
        </div>
    </>
  );

  const renderWithdrawOptions = () => (
    <>
        <div className="w-full md:w-1/3 bg-zinc-950 p-2 md:border-r border-zinc-800 flex md:flex-col gap-2">
            <button onClick={() => setMethod('BANK')} className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all ${method === 'BANK' ? 'bg-gold-600 text-black' : 'text-zinc-400 hover:bg-zinc-900'}`}>
                <Banknote className="w-4 h-4" /> Bank Wire
            </button>
            <button onClick={() => setMethod('CRYPTO')} className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all ${method === 'CRYPTO' ? 'bg-gold-600 text-black' : 'text-zinc-400 hover:bg-zinc-900'}`}>
                <Bitcoin className="w-4 h-4" /> Crypto Wallet
            </button>
        </div>
        <div className="flex-1 p-6 flex flex-col space-y-4">
             <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Withdraw Amount (USD)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-xl font-mono outline-none focus:border-gold-500" />
                <p className="text-xs text-zinc-500 mt-1">Available: ${balance?.USD.toLocaleString()}</p>
            </div>

            {method === 'BANK' && (
                 <div className="space-y-2 animate-in fade-in">
                    <input type="text" placeholder="Account Holder Name" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm outline-none" />
                    <input type="text" placeholder="IBAN / Account Number" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm outline-none font-mono" />
                    <input type="text" placeholder="SWIFT / BIC Code" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm outline-none font-mono" />
                 </div>
            )}

            {method === 'CRYPTO' && (
                <div className="space-y-2 animate-in fade-in">
                    <input type="text" value={cryptoAddress} onChange={e => setCryptoAddress(e.target.value)} placeholder="Enter Wallet Address" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm outline-none font-mono" />
                    <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm outline-none">
                        <option>Bitcoin (BTC)</option>
                        <option>Ethereum (ETH)</option>
                        <option>USDT (TRC-20)</option>
                    </select>
                </div>
            )}

            <button onClick={handleProcess} disabled={processing || !amount || parseFloat(amount) > (balance?.USD || 0)} className="mt-auto w-full bg-zinc-100 hover:bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                 {processing ? <Loader className="w-5 h-5 animate-spin" /> : 'Request Withdrawal'}
            </button>
        </div>
    </>
  );

  const renderTransferOptions = () => (
    <div className="flex-1 p-6 flex flex-col h-full space-y-4">
        <div className="bg-gradient-to-r from-gold-900/50 to-zinc-900 p-4 rounded-xl border border-gold-900/50 flex items-center gap-4">
            <Globe className="w-8 h-8 text-gold-500" />
            <div>
                <h3 className="text-white font-bold text-sm">Global Transfer</h3>
                <p className="text-zinc-400 text-xs">Send crypto or fiat instantly to anyone, anywhere.</p>
            </div>
        </div>

        <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Recipient</label>
            <div className="flex gap-2 mb-2">
                 <button onClick={() => setTransferType('CRYPTO_ADDRESS')} className={`flex-1 py-2 text-xs font-bold rounded border ${transferType === 'CRYPTO_ADDRESS' ? 'bg-zinc-800 border-gold-500 text-white' : 'border-zinc-800 text-zinc-500'}`}>Crypto Address</button>
                 <button onClick={() => setTransferType('EMAIL')} className={`flex-1 py-2 text-xs font-bold rounded border ${transferType === 'EMAIL' ? 'bg-zinc-800 border-gold-500 text-white' : 'border-zinc-800 text-zinc-500'}`}>Email / User ID</button>
            </div>
            
            {transferType === 'CRYPTO_ADDRESS' ? (
                 <input type="text" value={transferRecipient} onChange={e => setTransferRecipient(e.target.value)} placeholder="Paste Wallet Address" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm font-mono outline-none" />
            ) : (
                 <input type="text" value={transferRecipient} onChange={e => setTransferRecipient(e.target.value)} placeholder="Enter user email or ID" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm outline-none" />
            )}
        </div>

        <div>
             <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Amount to Send</label>
             <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-xl font-mono outline-none focus:border-gold-500" />
        </div>

        <button onClick={handleProcess} disabled={processing || !amount || !transferRecipient} className="mt-auto w-full bg-gold-600 hover:bg-gold-500 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {processing ? <Loader className="w-5 h-5 animate-spin" /> : 'Send Funds'}
        </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-zinc-800 bg-zinc-900 shrink-0">
          <h2 className="text-xl font-serif text-white font-bold flex items-center gap-2">
            {type === 'PREMIUM' && <Crown className="w-5 h-5 text-gold-500" />}
            {getTitle()}
          </h2>
        </div>
        
        {/* Navigation Tabs for Banking Mode */}
        {(type === 'BANKING' || type === 'TRANSFER') && !success && (
            <div className="flex border-b border-zinc-800 bg-zinc-950/50">
                <button onClick={() => setActiveTab('DEPOSIT')} className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'DEPOSIT' ? 'text-green-500 border-b-2 border-green-500' : 'text-zinc-500'}`}>Deposit</button>
                <button onClick={() => setActiveTab('WITHDRAW')} className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'WITHDRAW' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-500'}`}>Withdraw</button>
                <button onClick={() => setActiveTab('TRANSFER')} className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'TRANSFER' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-zinc-500'}`}>Transfer</button>
            </div>
        )}

        {success ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300 h-96">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Success!</h3>
            <p className="text-zinc-400">
               Your transaction has been processed securely.
            </p>
            <button onClick={onClose} className="mt-4 text-sm text-gold-500 font-bold hover:underline">Close</button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
             {type === 'CHECKOUT' || type === 'PREMIUM' ? renderDepositOptions() : 
              activeTab === 'DEPOSIT' ? renderDepositOptions() :
              activeTab === 'WITHDRAW' ? renderWithdrawOptions() :
              renderTransferOptions()
             }
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
