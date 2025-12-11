
export type CurrencyCode = 'NGN' | 'USD' | 'EUR' | 'GBP';

export interface ExchangeRate {
  code: CurrencyCode;
  rateToUSD: number; // 1 Unit = X USD
  symbol: string;
  name: string;
}

export interface UserBalance {
  USD: number;
  NGN: number;
  EUR: number;
  GBP: number;
  GOLD_OZ: number;
}

export interface MarketDataPoint {
  time: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export enum TransactionType {
  BUY_GOLD = 'BUY_GOLD',
  SELL_GOLD = 'SELL_GOLD',
  SWAP_CURRENCY = 'SWAP_CURRENCY',
  BUY_ITEM = 'BUY_ITEM',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  date: Date;
  amount: number;
  currency: CurrencyCode | 'GOLD';
  toAmount?: number;
  toCurrency?: CurrencyCode | 'GOLD';
  itemName?: string;
  totalValueUSD: number;
  status: 'completed' | 'pending';
}

export interface Product {
  id: string;
  name: string;
  category: 'WATCH' | 'JEWELRY' | 'ACCESSORY';
  priceUSD: number;
  image: string;
  description: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  is2FAEnabled: boolean;
  hasPasskey: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS' | 'AI';
  read: boolean;
  timestamp: Date;
}

export interface PriceAlert {
  id: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  active: boolean;
  createdAt: Date;
}
