'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageCard from '@/components/ImageCard';
import NextImage from 'next/image';
import { ImageData } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';

export default function ImageDetailPage() {
    const params = useParams();
    const { user } = useAuth();
    const imageId = params.id as string;

    const [image, setImage] = useState<ImageData | null>(null);
    const [relatedImages, setRelatedImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchImageDetail = async () => {
            try {
                // Fetch specific image
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/images/${imageId}`);
                const data = await response.json();

                if (response.ok && data) {
                    setImage(data);

                    // Fetch all images for related
                    const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/images`);
                    const allData = await allRes.json();
                    if (Array.isArray(allData)) {
                        setRelatedImages(
                            allData
                                .filter((img: ImageData) => img.category === data.category && img.id !== imageId)
                                .slice(0, 4)
                        );
                    }
                }
            } catch (error) {
                console.error('Failed to fetch image details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImageDetail();
    }, [imageId]);

    // Handle ESC key to close zoom
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsZoomed(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-40 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest">Loading Masterpiece...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!image || imgError) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-40 text-center px-4">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Image Unavailable</h1>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">This asset has been removed from our secure registry or is currently undergoing maintenance.</p>
                    <Link href="/browse" className="bg-[var(--primary)] text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:shadow-2xl transition-all">
                        Return to Registry
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const triggerDownload = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent closing overlay
        if (!user) {
            alert('Please login to download images');
            return;
        }

        try {
            const response = await fetch(image!.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const filename = `${image!.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(image!.url, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 mb-20">
                        {/* Image Preview - Spans 3 columns */}
                        <div className="lg:col-span-3">
                            <div
                                className="relative w-full rounded-sm overflow-hidden bg-gray-50 shadow-xl group border border-gray-100 flex items-center justify-center cursor-zoom-in"
                                onClick={() => setIsZoomed(true)}
                            >
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="max-w-full h-auto max-h-[70vh] object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                                    onError={() => setImgError(true)}
                                />
                                {/* Click Indicator */}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-900">View Full Size</span>
                                    </div>
                                </div>
                                {/* Image ID Overlay */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/70 text-white px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-sm">
                                        ID: {image.id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details - Spans 2 columns */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-black uppercase tracking-widest rounded border border-gray-200">
                                        {image.category}
                                    </span>
                                    <span className="bg-green-50 text-green-700 px-3 py-1 text-xs font-black uppercase tracking-widest rounded border border-green-100">
                                        Free Access
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                                    {image.title}
                                </h1>
                                <p className="text-gray-600 leading-relaxed italic">
                                    "{image.description}"
                                </p>
                            </div>

                            <div className="p-6 bg-gray-50 border border-gray-200 rounded space-y-6">
                                {/* Actions */}
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={(e) => triggerDownload(e as any)}
                                        className="w-full py-5 ib-button-red text-lg font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Free Download
                                    </button>
                                </div>
                            </div>

                            {/* Metadata Table */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Technical Specifications</h3>
                                <div className="divide-y divide-gray-100 text-sm">
                                    {[
                                        { label: 'Photographer', value: image.author },
                                        { label: 'License', value: 'Free for usage' },
                                        { label: 'Resolution', value: image.resolution },
                                        { label: 'Size', value: image.fileSize },
                                        { label: 'Format', value: 'High-Res JPEG' },
                                    ].map((spec) => (
                                        <div key={spec.label} className="py-3 flex justify-between">
                                            <span className="text-gray-500 font-medium">{spec.label}</span>
                                            <span className="text-gray-900 font-bold">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="pt-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Related Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {image.tags?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-4 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold border border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all cursor-pointer uppercase"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Section */}
                    {relatedImages.length > 0 && (
                        <div className="border-t-2 border-gray-100 pt-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-10 uppercase tracking-tighter">
                                More from <span className="text-[var(--primary)]">{image.category}</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedImages.map((relatedImage) => (
                                    <ImageCard key={relatedImage.id} image={relatedImage} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Full Screen Zoom Overlay */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-[200] bg-black/98 flex flex-col items-center justify-center p-4 cursor-zoom-out animate-fade-in"
                    onClick={() => setIsZoomed(false)}
                >
                    {/* Top Toolbar */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                        <div className="text-white">
                            <h3 className="font-bold text-lg">{image.title}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">{image.id}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={triggerDownload}
                                className="bg-[var(--primary)] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                            </button>
                            <button
                                className="text-white hover:text-[var(--primary)] transition-colors"
                                onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                            >
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center mt-20">
                        <img
                            src={image.url}
                            alt={image.title}
                            className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-zoom-in"
                        />
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-10 text-white/50 text-xs font-medium tracking-widest uppercase">
                        Click anywhere to close preview
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

