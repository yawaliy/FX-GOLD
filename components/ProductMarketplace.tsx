import React, { useState } from 'react';
import { ShoppingBag, Star, ZoomIn, X, Plus } from 'lucide-react';
import { Product, UserBalance, ExchangeRate } from '../types';

interface ProductMarketplaceProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  balance: UserBalance;
  rates: ExchangeRate[];
}

const ProductMarketplace: React.FC<ProductMarketplaceProps> = ({ products, onAddToCart, balance }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-20">
        <div className="bg-gradient-to-r from-gold-900 to-black p-8 rounded-2xl border border-gold-800/30 relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-serif text-white font-bold mb-2">The Luxury Collection</h2>
                <p className="text-gold-200/80 max-w-xl">
                    Exchange your digital gold holdings for physical assets. 
                    From Swiss timepieces to handcrafted 24K jewelry, FX Gold & Jewelry offers only the finest.
                </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gold-500/10 blur-3xl transform skew-x-12"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
                <div key={product.id} className="bg-luxury-card border border-zinc-800 rounded-xl overflow-hidden group hover:border-gold-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-900/10 flex flex-col h-full">
                    <div 
                        className="h-64 overflow-hidden relative cursor-zoom-in"
                        onClick={() => setSelectedImage(product.image)}
                    >
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 will-change-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full border border-white/20">
                                <ZoomIn className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        
                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur text-gold-400 text-xs px-2 py-1 rounded border border-gold-500/30 pointer-events-none">
                            {product.category}
                        </div>
                        {product.stock < 3 && (
                            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse pointer-events-none">
                                Only {product.stock} left
                            </div>
                        )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-serif font-bold text-lg text-white leading-tight">{product.name}</h3>
                            <div className="flex items-center text-gold-500 text-xs">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="ml-1">4.9</span>
                            </div>
                        </div>
                        
                        <p className="text-zinc-400 text-sm mb-4 line-clamp-2 min-h-[40px]">{product.description}</p>
                        
                        <div className="flex items-end justify-between border-t border-zinc-800 pt-4 mt-auto">
                            <div>
                                <span className="text-xs text-zinc-500 uppercase">Price</span>
                                <div className="text-xl font-bold text-white">${product.priceUSD.toLocaleString()}</div>
                            </div>
                            <button 
                                onClick={() => onAddToCart(product)}
                                className="bg-zinc-100 hover:bg-white text-black transition-colors px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transform active:scale-95 duration-100"
                            >
                                <Plus className="w-4 h-4" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Full Screen Image Modal */}
        {selectedImage && (
            <div 
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                onClick={() => setSelectedImage(null)}
            >
                <button 
                    className="absolute top-4 right-4 md:top-8 md:right-8 text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 p-2 rounded-full transition-colors"
                    onClick={() => setSelectedImage(null)}
                >
                    <X className="w-8 h-8" />
                </button>
                <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center">
                    <img 
                        src={selectedImage} 
                        alt="Product Full View" 
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
        )}
    </div>
  );
};

export default ProductMarketplace;