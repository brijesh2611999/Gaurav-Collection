'use client';

import React, { useState } from 'react';

export default function ContributionBanner() {
    const [isVisible, setIsVisible] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [sparks, setSparks] = useState<{ id: number, tx: string, ty: string, rotation: string, delay: string, color: string, width: string, height: string, opacity: number }[]>([]);

    const handleContributed = () => {
        setShowModal(false);

        // Generate a massive amount of sparks for an incredible ultra-shine grand firework burst
        const newSparks = Array.from({ length: 300 }).map((_, i) => {
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const distance = 100 + Math.random() * 700;
            const tx = `${Math.cos(angle) * distance}px`;
            const ty = `${Math.sin(angle) * distance}px`;

            const colors = [
                '#FFFFFF', // Pure White
                '#FFD700', // Deep Gold
                '#FFF700', // Electric Yellow
                '#FFA200', // Bright Orange
                '#FF4D00', // Solar Flare
                '#FFFAF0'  // Floral White (Glow)
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];

            return {
                id: Date.now() + i,
                tx,
                ty,
                rotation: `${Math.random() * 360}deg`,
                delay: `${Math.random() * 0.6}s`,
                color,
                width: `${1 + Math.random() * 3}px`,
                height: `${40 + Math.random() * 120}px`,
                opacity: 0.9 + Math.random() * 0.1
            };
        });

        setSparks(newSparks);

        setTimeout(() => {
            setSparks([]);
        }, 6000);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Extreme-Shine Grand Firework Overlay */}
            {sparks.length > 0 && (
                <div className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center bg-black/50 backdrop-blur-[6px]">
                    <div className="absolute w-40 h-40 bg-white rounded-full blur-[40px] animate-firework-flash" />
                    <div className="absolute w-80 h-80 bg-yellow-300/40 rounded-full blur-[100px] animate-firework-flash delay-[100ms] scale-125" />
                    <div className="absolute w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[180px] animate-firework-flash delay-[300ms] scale-150" />

                    <div className="relative w-1 h-1">
                        {sparks.map((spark) => (
                            <div
                                key={spark.id}
                                className="absolute animate-firework-spark"
                                style={{
                                    '--tx': spark.tx,
                                    '--ty': spark.ty,
                                    '--rotation': spark.rotation,
                                    backgroundColor: spark.color,
                                    animationDelay: spark.delay,
                                    width: spark.width,
                                    height: spark.height,
                                    borderRadius: '999px',
                                    boxShadow: `0 0 25px ${spark.color}, 0 0 60px ${spark.color}88, 0 0 100px white 22`,
                                    opacity: spark.opacity,
                                    filter: 'contrast(1.5) saturate(2) brightness(1.8)'
                                } as any}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="fixed bottom-6 left-6 z-[9990] animate-bounce-subtle">
                <div
                    onClick={() => setShowModal(true)}
                    className="group relative flex items-center gap-3 bg-white border border-gray-100 p-2 pr-6 rounded-full shadow-2xl hover:shadow-[0_20px_50px_rgba(239,68,68,0.2)] transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)] leading-none mb-1">Support Us</p>
                        <p className="text-xs font-bold text-gray-900 leading-none">Contribute to the Collection</p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsVisible(false);
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        ×
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-center">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl relative overflow-y-auto flex flex-col md:flex-row animate-zoom-in text-left">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[var(--primary)] to-orange-500 z-40" />

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-40 p-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="md:w-5/12 p-6 md:p-8 bg-gray-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 mt-6 md:mt-0">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Support Our <span className="text-[var(--primary)]">Art</span></h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">Scan to Donate</p>
                            </div>

                            <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 w-full max-w-[180px] md:max-w-[220px]">
                                <img
                                    src="/images/qr-code.jpg?v=1"
                                    alt="Contribution QR Code"
                                    className="w-full h-auto object-contain rounded-lg"
                                />
                            </div>

                            <p className="mt-6 text-[9px] font-black uppercase tracking-widest text-center text-gray-400">
                                Trusted by Creators Worldwide
                            </p>
                        </div>

                        <div className="md:w-7/12 p-6 md:p-10 flex flex-col justify-center">
                            <div className="mb-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] mb-2">Community Contribution</p>
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">Help Us Grow the <span className="text-[var(--primary)]">Legacy</span></h3>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-8">
                                Every contribution helps us maintain the servers and support professional artists. Since we are a free-access repository, we rely on your love!
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center border border-gray-100">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Recipient</span>
                                    <span className="text-xs font-bold text-gray-900">Gaurav Karanwal</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center border border-gray-100">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">VPA</span>
                                    <span className="text-[10px] font-bold text-gray-600">gauravkaranwal788@okaxis</span>
                                </div>
                            </div>

                            <button
                                onClick={handleContributed}
                                className="w-full py-4 ib-button-red text-sm font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                I've Contributed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
