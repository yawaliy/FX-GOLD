import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onRemove, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + (item.priceUSD * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-zinc-900 h-full border-l border-gold-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
          <h2 className="text-xl font-serif text-gold-400 font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Your luxury cart is empty.</p>
              <button onClick={onClose} className="text-gold-500 text-sm hover:underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-zinc-800/50 p-3 rounded-xl border border-zinc-800">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-900 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-medium text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-zinc-500 text-xs mt-1">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-gold-400 font-mono">${item.priceUSD.toLocaleString()}</span>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-900 space-y-4">
            <div className="flex justify-between items-center text-zinc-400 text-sm">
              <span>Subtotal</span>
              <span className="text-white font-mono">${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400 text-sm">
              <span>Shipping (Insured)</span>
              <span className="text-gold-500">Free</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t border-zinc-800 pt-4">
              <span className="text-white">Total</span>
              <span className="text-gold-400 font-mono">${total.toLocaleString()}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-gold-900/20 flex items-center justify-center gap-2"
            >
              Checkout Securely <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;