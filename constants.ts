
import { ExchangeRate, UserBalance, Product } from './types';

export const INITIAL_RATES: Record<string, ExchangeRate> = {
  USD: { code: 'USD', rateToUSD: 1, symbol: '$', name: 'US Dollar' },
  NGN: { code: 'NGN', rateToUSD: 0.00064, symbol: '₦', name: 'Nigerian Naira' }, // Approx 1560 NGN = 1 USD
  EUR: { code: 'EUR', rateToUSD: 1.08, symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', rateToUSD: 1.26, symbol: '£', name: 'British Pound' },
};

export const INITIAL_GOLD_PRICE_USD_PER_OZ = 2340.50;

export const INITIAL_BALANCE: UserBalance = {
  USD: 15000,
  NGN: 25000000,
  EUR: 5000,
  GBP: 2000,
  GOLD_OZ: 12.5,
};

export const APP_NAME = "FX Gold & Jewelry";

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Rolex Submariner Date',
    category: 'WATCH',
    priceUSD: 14500,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600',
    description: 'Oystersteel, yellow gold, and ceramic bezel. The archetypal diver’s watch.',
    stock: 3
  },
  {
    id: 'p2',
    name: '18K Cuban Link Chain (500g)',
    category: 'JEWELRY',
    priceUSD: 32000,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600',
    description: 'Solid 18k Gold Miami Cuban Link Chain. Hand-crafted perfection.',
    stock: 5
  },
  {
    id: 'p3',
    name: 'Diamond Encrusted G-Shock',
    category: 'WATCH',
    priceUSD: 1200,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600',
    description: 'Custom G-Shock with VS1 diamonds set in a stainless steel bezel.',
    stock: 10
  },
  {
    id: 'p4',
    name: 'Gold Bangle Set (24K)',
    category: 'JEWELRY',
    priceUSD: 4500,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
    description: 'Traditional 24K pure gold wedding bangles with intricate engraving.',
    stock: 8
  },
  {
    id: 'p5',
    name: 'Cartier Love Bracelet',
    category: 'JEWELRY',
    priceUSD: 6800,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=600',
    description: '18K Yellow Gold. A universal symbol of love and commitment.',
    stock: 4
  },
  {
    id: 'p6',
    name: 'Patek Philippe Nautilus',
    category: 'WATCH',
    priceUSD: 125000,
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=600',
    description: 'Rose Gold 5711/1R. The ultimate status symbol.',
    stock: 1
  },
  {
    id: 'p7',
    name: 'Audemars Piguet Royal Oak',
    category: 'WATCH',
    priceUSD: 85000,
    image: 'https://images.unsplash.com/photo-1618403019638-46631f9d7a6e?auto=format&fit=crop&q=80&w=600',
    description: 'Selfwinding Flying Tourbillon. 18-carat pink gold case, glareproofed sapphire crystal.',
    stock: 2
  },
  {
    id: 'p8',
    name: '1kg Gold Bullion Bar',
    category: 'ACCESSORY',
    priceUSD: 76000,
    image: 'https://images.unsplash.com/photo-1610375461490-fb4133a2f00b?auto=format&fit=crop&q=80&w=600',
    description: '99.99% Pure Gold. LBMA certified cast bar with unique serial number.',
    stock: 10
  },
  {
    id: 'p9',
    name: 'Diamond Tennis Necklace',
    category: 'JEWELRY',
    priceUSD: 18500,
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=600',
    description: '15 carats of round brilliant cut diamonds set in 18k white gold.',
    stock: 4
  },
  {
    id: 'p10',
    name: 'Omega Speedmaster Moonwatch',
    category: 'WATCH',
    priceUSD: 7200,
    image: 'https://images.unsplash.com/photo-1623998021446-45cd9b269056?auto=format&fit=crop&q=80&w=600',
    description: 'Co-Axial Master Chronometer. The watch that went to the moon.',
    stock: 6
  },
  {
    id: 'p11',
    name: 'Gold Krugerrand Coin (1oz)',
    category: 'ACCESSORY',
    priceUSD: 2450,
    image: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=600',
    description: 'South African Krugerrand. The world\'s most widely traded gold bullion coin.',
    stock: 50
  },
  {
    id: 'p12',
    name: 'Richard Mille RM 11-03',
    category: 'WATCH',
    priceUSD: 320000,
    image: 'https://images.unsplash.com/photo-1620625515032-608130563bee?auto=format&fit=crop&q=80&w=600',
    description: 'Automatic Flyback Chronograph. Rose Gold and Titanium construction.',
    stock: 1
  }
];
