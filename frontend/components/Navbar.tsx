'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BotAssistant, { BotMood } from './BotAssistant';
import { GoogleLogin } from '@react-oauth/google';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [botMood, setBotMood] = useState<BotMood>('normal');
    const [botMessage, setBotMessage] = useState<string>('');
    const pathname = usePathname();

    const isHomePage = pathname === '/';
    const isNavbarSolid = isScrolled || !isHomePage || isMobileMenuOpen;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>{/* Notification bar or similar can go here if needed */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavbarSolid
                    ? 'bg-white shadow-md py-3'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Left Group: Logo + Navigation */}
                        <div className="flex items-center gap-12">
                            <Link href="/" className="flex items-center space-x-2 group shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-[var(--primary)] flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                    <span className="text-white text-lg sm:text-xl font-black">GC</span>
                                </div>
                                <span className={`text-xl sm:text-2xl font-bold tracking-tighter ${isNavbarSolid ? 'text-gray-900' : 'text-white'}`}>
                                    Gaurav<span className="text-[var(--primary)] text-nowrap"> Collection</span>
                                </span>
                            </Link>

                            {/* Navigation Links - Desktop Only */}
                            <div className="hidden md:flex items-center gap-8 pt-1">
                                <Link
                                    href="/browse"
                                    className={`text-sm font-bold uppercase tracking-wider hover:text-[var(--primary)] transition-colors ${isNavbarSolid ? 'text-gray-700' : 'text-white'}`}
                                >
                                    Browse
                                </Link>
                                <Link
                                    href="/browse"
                                    className={`text-sm font-bold uppercase tracking-wider hover:text-[var(--primary)] transition-colors ${isNavbarSolid ? 'text-gray-700' : 'text-white'}`}
                                >
                                    Categories
                                </Link>

                            </div>
                        </div>

                        {/* Search Bar - Desktop Scrolling */}
                        <div className={`flex-1 flex justify-center max-w-xl mx-auto px-8 transition-all duration-300 hidden lg:flex ${isNavbarSolid ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const query = (e.currentTarget.elements.namedItem('navSearch') as HTMLInputElement).value;
                                    window.location.href = `/browse?q=${encodeURIComponent(query)}`;
                                }}
                                className="relative w-full group"
                            >
                                <div className="relative bg-gray-100 rounded-md shadow-inner border border-gray-200 flex items-center">
                                    <div className="absolute left-3 flex items-center justify-center text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        name="navSearch"
                                        type="text"
                                        placeholder="Search Images..."
                                        className="w-full px-4 py-2 pl-10 rounded-md bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
                                    />
                                    <button type="submit" className="bg-[var(--primary)] text-white px-4 py-2 text-xs font-bold uppercase rounded-r-md">Go</button>
                                </div>
                            </form>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="hidden sm:flex items-center gap-4">
                                {user ? (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={logout}
                                            className={`p-2 rounded-full transition-all hover:bg-white/10 ${isNavbarSolid ? 'text-gray-500 hover:text-[var(--primary)]' : 'text-white/80 hover:text-[var(--primary)]'}`}
                                            title="Logout"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                        </button>
                                        <span className={`text-sm font-bold ${isNavbarSolid ? 'text-gray-700' : 'text-white'}`}>
                                            {user.name}
                                        </span>
                                        {isAdmin ? (
                                            <Link
                                                href="/admin"
                                                className="p-0.5 rounded-full border-2 border-[var(--primary)] text-white hover:scale-105 transition-transform"
                                                title="Admin Dashboard"
                                            >
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-xs font-bold text-gray-600">
                                                            {user.name?.charAt(0) || 'U'}
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/profile"
                                                className="p-0.5 rounded-full border-2 border-gray-100 text-white hover:scale-105 transition-transform"
                                                title="My Profile"
                                            >
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-8 h-8 rounded-full shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-xs font-bold text-gray-600">
                                                            {user.name?.charAt(0) || 'U'}
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowAuthModal(true)}
                                        className={`px-6 py-2 rounded-sm font-bold text-sm tracking-widest uppercase transition-all shadow-md active:scale-95 ${isNavbarSolid ? 'ib-button-red' : 'bg-white text-gray-900 border-2 border-white hover:bg-transparent hover:text-white'}`}
                                    >
                                        Login
                                    </button>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`md:hidden p-2 rounded transition-colors ${isNavbarSolid ? 'text-gray-700' : 'text-white'}`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Content */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden pt-4 pb-6 space-y-4 animate-fade-in border-t border-gray-100 mt-4">
                            {/* Mobile Search */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const query = (e.currentTarget.elements.namedItem('mobileSearch') as HTMLInputElement).value;
                                    setIsMobileMenuOpen(false);
                                    window.location.href = `/browse?q=${encodeURIComponent(query)}`;
                                }}
                                className="px-4 mb-4"
                            >
                                <div className="relative">
                                    <input
                                        name="mobileSearch"
                                        type="text"
                                        placeholder="Search Images..."
                                        className="w-full px-4 py-3 rounded-md bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-[var(--primary)] focus:outline-none"
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--primary)] text-white px-3 py-1.5 text-xs font-bold uppercase rounded-sm">
                                        Go
                                    </button>
                                </div>
                            </form>

                            <Link
                                href="/browse"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-[var(--primary)]"
                            >
                                Browse Registry
                            </Link>
                            <Link
                                href="/browse"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-[var(--primary)]"
                            >
                                Popular Categories
                            </Link>

                            <div className="pt-4 px-4 border-t border-gray-50 flex items-center justify-between">
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-[var(--primary)] text-white" />
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            <button onClick={logout} className="text-xs text-[var(--primary)] font-bold uppercase">Logout</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setShowAuthModal(true); setIsMobileMenuOpen(false); }}
                                        className="w-full py-3 ib-button-red rounded font-bold uppercase tracking-widest text-sm"
                                    >
                                        Login to Gaurav Collection
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Sivaji Style Bot Assistant */}
            <BotAssistant isVisible={showAuthModal} mood={botMood} message={botMessage} />

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} setBotMood={setBotMood} setBotMessage={setBotMessage} />
            )}
        </>
    );
}

// Auth Modal Component
function AuthModal({ onClose, setBotMood, setBotMessage }: { onClose: () => void, setBotMood: (mood: BotMood) => void, setBotMessage: (msg: string) => void }) {
    const { googleLogin } = useAuth();
    const [errorMsg, setErrorMsg] = useState('');

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setBotMood('thinking');
        setBotMessage('Checking your credentials boss...');
        const result = await googleLogin(credentialResponse.credential);

        if (result.success) {
            setBotMood('happy');
            setBotMessage('Google se login kiya boss! Welcome!');
            setTimeout(() => {
                onClose();
                setBotMood('normal');
                if (window.location.pathname === '/') window.location.reload();
            }, 1000);
        } else {
            setBotMood('angry');
            setBotMessage('Google login fail marela hai!');
            setErrorMsg(result.message || 'Google Login Failed');
        }
    };

    const handleGoogleError = () => {
        setBotMood('angry');
        setBotMessage('Google login error!');
        setErrorMsg('Google Login Failed. Please try again.');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg p-10 max-w-sm w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-900 transition-colors"
                >
                    ×
                </button>

                <div className="text-center mb-10 pt-4">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                        Welcome Boss!
                    </h2>
                    <div className="w-16 h-1 bg-[var(--primary)] mx-auto mt-4 rounded-full" />
                    <p className="text-gray-500 mt-6 text-sm font-medium">Use your Google account to access the collection instantly.</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-500 text-xs font-bold p-3 mb-6 rounded text-center uppercase tracking-wide">
                        {errorMsg}
                    </div>
                )}

                <div className="flex justify-center flex-col items-center gap-6">
                    <div className="transform scale-125">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_black"
                            shape="circle"
                            text="continue_with"
                        />
                    </div>

                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-4">Secure Authentication</p>
                </div>

                <div className="mt-12 text-center border-t border-gray-50 pt-8">
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                        By continuing, you agree to our <br />
                        <span className="text-gray-600 font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-gray-600 font-bold underline cursor-pointer">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
