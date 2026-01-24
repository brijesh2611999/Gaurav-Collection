'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isPhotographerModalOpen, setIsPhotographerModalOpen] = useState(false);
    const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);

    const contactDetails = {
        email: 'Gauravkaranwal788@gmail.com',
        instagram: 'https://www.instagram.com/adventurewithlife?igsh=azl0ZnhyZmJ4OG52',
        youtube: 'http://www.youtube.com/@Adventurewithlife',
        phone: '+91 98765 43210'
    };

    const infoModals: Record<string, { title: string; content: string; icon?: React.ReactNode }> = {
        about: {
            title: "About Us",
            content: "Gaurav Collection is built on the vision of celebrating Indian heritage through authentic imagery. We provide high-quality visuals that tell the story of India's diverse culture, emotions, and landscapes to global storytellers."
        },
        howToSearch: {
            title: "How to search",
            content: "Use our powerful search bar with keywords like 'nature', 'indian culture', or 'devotion'. You can also browse through our curated categories and use the filters on the browse page to narrow down your results."
        },
        downloads: {
            title: "Downloads & Access",
            content: "All images in our collection are now free to download for registered users. Simply sign in, find your masterpiece, and hit the download button to get the high-resolution files instantly."
        },
        careers: {
            title: "Careers",
            content: "Join our creative team! We're always looking for passionate designers, developers, and photographers. Send your portfolio and resume to careers@gauravcollection.com."
        },
        privacy: {
            title: "Privacy Policy",
            content: "Your data is safe with us. We use industry-standard encryption and follow strict data protection protocols to ensure your personal information remains confidential and secure."
        },
        terms: {
            title: "Terms of Use",
            content: "All images on this platform are provided for personal and commercial usage according to our free-access policy. Redistribution as standalone files is prohibited."
        },
        sitemap: {
            title: "Sitemap",
            content: "Our site is simple to navigate: Home, Browse Library, Categories (Devotion, Nature, Others), and Photographer Artist Profiles."
        }
    };

    const dummyPhotographer = {
        name: 'Gaurav Karanwal',
        role: 'Founder & Head Photographer',
        email: 'Gauravkaranwal788@gmail.com',
        phone: '+91 98765 43210',
        location: 'Delhi, India',
        district: 'Delhi',
        state: 'Delhi',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
    };

    return (
        <footer className="bg-gray-100 border-t border-gray-200 mt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-sm bg-[var(--primary)] flex items-center justify-center">
                                <span className="text-white text-xl font-black">GC</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tighter text-gray-900">
                                Gaurav<span className="text-[var(--primary)]"> Collection</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Gaurav Collection is a premium repository of Indian imagery. We provide high-quality, creative visuals for storytellers across the globe.
                        </p>
                        <div className="flex space-x-4">
                            {['instagram', 'youtube'].map((social) => (
                                <a
                                    key={social}
                                    href={social === 'instagram' ? contactDetails.instagram : contactDetails.youtube}
                                    target="_blank"
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg shadow-lg active:scale-90 transition-all duration-300 text-white`}
                                    style={{
                                        background: social === 'instagram'
                                            ? 'radial-gradient(circle at 33% 100%, #fed373 4%, #f15245 30%, #d92e7f 62%, #9b36b7 85%, #515ecf)'
                                            : '#FF0000'
                                    }}
                                >
                                    <span className="sr-only">{social}</span>
                                    {social === 'instagram' ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2c2.717 0 3.056.01 4.122.058 1.066.048 1.79.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.637.417 1.361.465 2.427.048 1.066.058 1.405.058 4.122s-.01 3.056-.058 4.122c-.048 1.066-.218 1.79-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.637.247-1.361.417-2.427.465-1.066.048-1.405.058-4.122.058s-3.056-.01-4.122-.058c-1.066-.048-1.79-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.637-.417-1.361-.465-2.427C2.01 15.056 2 14.717 2 12s.01-3.056.058-4.122c.048-1.066.218-1.79.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.523c.637-.247 1.361-.417 2.427-.465C8.944 2.01 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Support</h3>
                        <ul className="space-y-4 text-sm font-medium text-gray-600">
                            <li>
                                <button
                                    onClick={() => setActiveInfoModal('howToSearch')}
                                    className="hover:text-[var(--primary)] transition-colors text-left"
                                >
                                    How to search
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveInfoModal('downloads')}
                                    className="hover:text-[var(--primary)] transition-colors text-left"
                                >
                                    Downloads & Access
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveInfoModal('terms')}
                                    className="hover:text-[var(--primary)] transition-colors text-left"
                                >
                                    Usage Terms
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Company</h3>
                        <ul className="space-y-4 text-sm font-medium text-gray-600">
                            <li>
                                <button
                                    onClick={() => setActiveInfoModal('about')}
                                    className="hover:text-[var(--primary)] transition-colors text-left"
                                >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsPhotographerModalOpen(true)}
                                    className="hover:text-[var(--primary)] transition-colors text-left"
                                >
                                    Our Artists
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="hover:text-[var(--primary)] transition-colors text-left"
                                >
                                    Contact Us
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter / Notice */}
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center">
                        <p className="text-xs font-black uppercase tracking-widest text-[var(--primary)] mb-2">Notice</p>
                        <p className="text-xs text-gray-500 leading-relaxed italic">
                            All images are now free to download for a limited time. Join our community of creators today.
                        </p>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        © {currentYear} Gaurav Collection. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <button onClick={() => setActiveInfoModal('privacy')} className="hover:text-[var(--primary)] transition-colors">Privacy</button>
                        <button onClick={() => setActiveInfoModal('terms')} className="hover:text-[var(--primary)] transition-colors">Terms</button>
                        <button onClick={() => setActiveInfoModal('sitemap')} className="hover:text-[var(--primary)] transition-colors">Sitemap</button>
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="ib-button-red py-6 px-8 flex justify-between items-center text-white">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Get in Touch</h2>
                            <button
                                onClick={() => setIsContactModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <a
                                    href={`mailto:${contactDetails.email}`}
                                    className="flex items-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[var(--primary)] hover:bg-red-50 group transition-all"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                                        <p className="text-gray-900 font-bold">{contactDetails.email}</p>
                                    </div>
                                </a>

                                <div className="grid grid-cols-2 gap-4">
                                    <a href={contactDetails.instagram} target="_blank" className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[var(--primary)] hover:bg-red-50 group transition-all">
                                        <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Instagram</p>
                                    </a>
                                    <a href={contactDetails.youtube} target="_blank" className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[var(--primary)] hover:bg-red-50 group transition-all">
                                        <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">YouTube</p>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 text-center">
                            <button onClick={() => setIsContactModalOpen(false)} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[var(--primary)]">Close Window</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Photographer Modal */}
            {isPhotographerModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gray-900 py-6 px-8 flex justify-between items-center text-white">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Featured Artist</h2>
                            <button
                                onClick={() => setIsPhotographerModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-8 text-center">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--primary)] mx-auto mb-6">
                                <img src={dummyPhotographer.image} alt={dummyPhotographer.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">{dummyPhotographer.name}</h3>
                            <p className="text-[var(--primary)] font-bold uppercase tracking-widest text-xs mb-6">{dummyPhotographer.role}</p>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Portfolio</p>
                                    <p className="text-sm font-bold text-gray-900">{dummyPhotographer.email}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                                    <p className="text-sm font-bold text-gray-900">{dummyPhotographer.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 text-center">
                            <button onClick={() => setIsPhotographerModalOpen(false)} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[var(--primary)]">Close Profile</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Informational Modal */}
            {activeInfoModal && infoModals[activeInfoModal] && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="ib-button-red py-4 px-6 flex justify-between items-center text-white">
                            <h2 className="text-xl font-black uppercase tracking-tighter">{infoModals[activeInfoModal].title}</h2>
                            <button onClick={() => setActiveInfoModal(null)} className="p-1 hover:bg-white/10 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-8">
                            <p className="text-gray-600 leading-relaxed font-medium">{infoModals[activeInfoModal].content}</p>
                        </div>
                        <div className="bg-gray-50 p-4 text-center">
                            <button onClick={() => setActiveInfoModal(null)} className="px-8 py-2 border-2 border-[var(--primary)] text-[var(--primary)] text-xs font-bold uppercase tracking-widest rounded hover:bg-[var(--primary)] hover:text-white transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
