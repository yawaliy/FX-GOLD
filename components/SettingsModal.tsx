
import React, { useState } from 'react';
import { X, User, Shield, Smartphone, Mail, Key, Check, Loader, Copy } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY'>('PROFILE');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email);
  const [showQR, setShowQR] = useState(false);
  const [show2FASuccess, setShow2FASuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    setLoading(true);
    setTimeout(() => {
        onUpdateUser({ ...user, email, phone });
        setLoading(false);
    }, 1000);
  };

  const handleToggle2FA = () => {
    if (user.is2FAEnabled) {
        if (window.confirm("Are you sure you want to disable 2FA?")) {
            onUpdateUser({ ...user, is2FAEnabled: false });
            setVerificationCode('');
            setShow2FASuccess(false);
        }
    } else {
        // Generate a random Base32-like secret for demo purposes
        const mockSecret = 'JBSWY3DPEHPK3PXP'; 
        setSecret(mockSecret);
        setShowQR(true);
        setShow2FASuccess(false);
    }
  };

  const verifyAndEnable2FA = () => {
    if (verificationCode.length < 6) return;
    setLoading(true);
    // Simulate verification delay
    setTimeout(() => {
        onUpdateUser({ ...user, is2FAEnabled: true });
        setShowQR(false);
        setLoading(false);
        setVerificationCode('');
        setShow2FASuccess(true);
    }, 1000);
  };

  const handlePasskeySetup = () => {
    setLoading(true);
    setTimeout(() => {
        onUpdateUser({ ...user, hasPasskey: true });
        setLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Generate OTP Auth URL for the QR code
  const otpAuthUrl = `otpauth://totp/FX%20Gold:${encodeURIComponent(user.email)}?secret=${secret}&issuer=FX%20Gold`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUrl)}`;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-2xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row overflow-hidden h-[600px] md:h-[550px]">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-zinc-950 p-4 border-r border-zinc-800 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0">
            <button 
                onClick={() => setActiveTab('PROFILE')}
                className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'PROFILE' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
                <User className="w-4 h-4" /> Profile Details
            </button>
            <button 
                onClick={() => setActiveTab('SECURITY')}
                className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'SECURITY' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
                <Shield className="w-4 h-4" /> Security & 2FA
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white z-10">
                <X className="w-5 h-5" />
            </button>
            
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'PROFILE' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
                        
                        <div className="space-y-4">
                             <div>
                                <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Email Address</label>
                                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                                    <Mail className="w-4 h-4 text-zinc-500" />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent w-full text-white outline-none"
                                    />
                                </div>
                             </div>

                             <div>
                                <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Phone Number</label>
                                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                                    <Smartphone className="w-4 h-4 text-zinc-500" />
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="bg-transparent w-full text-white outline-none"
                                    />
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">Used for security alerts and verification.</p>
                             </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="bg-gold-600 hover:bg-gold-500 text-black px-6 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                            >
                                {loading && <Loader className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'SECURITY' && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Two-Factor Authentication</h2>
                            <p className="text-sm text-zinc-400">Secure your account with Google Authenticator.</p>
                        </div>

                        {show2FASuccess ? (
                            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 text-center animate-in fade-in zoom-in-95">
                                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">2FA Activated</h3>
                                <p className="text-zinc-400 text-sm mb-6">
                                    Your account is now protected with Google Authenticator. You will need to enter a verification code every time you sign in.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => setShow2FASuccess(false)}
                                        className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-3 rounded-lg transition-colors"
                                    >
                                        Done
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to disable 2FA immediately?")) {
                                                onUpdateUser({ ...user, is2FAEnabled: false });
                                                setShow2FASuccess(false);
                                            }
                                        }} 
                                        className="text-sm text-red-400 hover:text-red-300 hover:underline"
                                    >
                                        Disable 2FA
                                    </button>
                                </div>
                            </div>
                        ) : !showQR ? (
                            <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${user.is2FAEnabled ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">Authenticator App</h3>
                                        <p className="text-xs text-zinc-500">{user.is2FAEnabled ? 'Enabled' : 'Not configured'}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleToggle2FA}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${user.is2FAEnabled ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-gold-600 text-black hover:bg-gold-500'}`}
                                >
                                    {user.is2FAEnabled ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-6 animate-in fade-in zoom-in-95">
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="bg-white p-2 rounded-xl shadow-lg">
                                        <img src={qrCodeUrl} alt="2FA QR Code" className="w-32 h-32" />
                                    </div>
                                    
                                    <div className="w-full">
                                        <p className="text-sm text-zinc-300 mb-2">Scan QR code or enter setup key:</p>
                                        <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-700">
                                            <code className="flex-1 font-mono text-gold-500 text-sm tracking-widest">{secret}</code>
                                            <button 
                                                onClick={() => copyToClipboard(secret)}
                                                className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-3 border-t border-zinc-700 pt-4">
                                        <p className="text-xs text-zinc-500">Enter the 6-digit code from your app</p>
                                        <div className="flex gap-2 justify-center">
                                            <input 
                                                type="text" 
                                                placeholder="000 000"
                                                maxLength={6}
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                                                className="bg-zinc-900 border border-zinc-700 text-white text-center text-xl tracking-[0.5em] p-3 rounded-lg w-full outline-none focus:border-gold-500 placeholder-zinc-700"
                                            />
                                        </div>
                                        
                                        <div className="flex gap-3 pt-2">
                                            <button 
                                                onClick={() => { setShowQR(false); setSecret(''); }}
                                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-lg text-sm font-bold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={verifyAndEnable2FA}
                                                disabled={loading || verificationCode.length < 6}
                                                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Verify & Activate'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-zinc-800 pt-6">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Key className="w-5 h-5 text-gold-500" />
                                Passkeys
                            </h3>
                            <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-zinc-300">Sign in with your face, fingerprint, or device PIN.</p>
                                    {user.hasPasskey && <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Active on this device</p>}
                                </div>
                                <button 
                                    onClick={handlePasskeySetup}
                                    disabled={user.hasPasskey}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${user.hasPasskey ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-zinc-100 text-black hover:bg-white'}`}
                                >
                                    {user.hasPasskey ? 'Registered' : 'Add Passkey'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
