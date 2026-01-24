'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-40 text-center">
                <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Bhidu, Profile load kar raha hoon...</p>
            </div>
            <Footer />
        </div>
    );

    if (!user) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-40 text-center px-4">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Access Denied</h1>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">Oi Bhidu! Pehle login toh kar le re baba!</p>
                    <Link href="/" className="bg-[var(--primary)] text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:shadow-2xl transition-all">
                        Go to Home
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Profile Card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-800"></div>
                        <div className="px-8 pb-12">
                            <div className="relative -mt-16 mb-6">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-3xl bg-gray-200 border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-gray-400">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-24 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{user.name}</h1>
                                    <p className="text-gray-500 font-medium">{user.email}</p>
                                    <div className="mt-4 flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                            {user.role || 'Verified Bhidu'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest border border-gray-100">
                                            Level Up
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Link href="/browse" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-lg active:scale-95">
                                        Explore More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Member Since</p>
                            <h3 className="text-2xl font-black text-gray-900">
                                {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                            </h3>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Contributions</p>
                            <h3 className="text-2xl font-black text-gray-900">0 Masterpieces</h3>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
