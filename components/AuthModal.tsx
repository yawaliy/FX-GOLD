
import React, { useState } from 'react';
import { X, Mail, Lock, Chrome, ArrowRight, Loader } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      const mockUser: UserProfile = {
        name: email.split('@')[0] || 'User',
        email: email,
        phone: '',
        is2FAEnabled: false,
        hasPasskey: false
      };
      onLogin(mockUser);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        name: 'Google User',
        email: 'user@gmail.com',
        phone: '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        is2FAEnabled: false,
        hasPasskey: false
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pb-0 text-center">
            <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-zinc-400 text-sm">
                {isLogin ? 'Sign in to access your portfolio' : 'Join the premier luxury trading platform'}
            </p>
        </div>

        <div className="p-8 space-y-6">
            <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-zinc-100 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-colors"
            >
                <Chrome className="w-5 h-5" />
                <span>Continue with Google</span>
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-zinc-900 text-zinc-500">Or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs text-zinc-500 font-bold uppercase ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-3 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder-zinc-600"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-zinc-500 font-bold uppercase ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-3 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder-zinc-600"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-gold-900/20 flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : (
                        <>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center text-sm text-zinc-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-gold-500 hover:text-gold-400 font-bold hover:underline"
                >
                    {isLogin ? 'Sign up' : 'Log in'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
