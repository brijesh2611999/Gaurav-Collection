'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ImageData } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';

interface ImageCardProps {
    image: ImageData;
    allowDownload?: boolean;
}

export default function ImageCard({ image, allowDownload = true }: ImageCardProps) {
    const { user } = useAuth(); // Get user from auth context
    const [isHovered, setIsHovered] = useState(false);
    const [imgError, setImgError] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (user) {
            try {
                // Fetch the image as a blob
                const response = await fetch(image.url);
                const blob = await response.blob();

                // Create a temporary link element
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                // Set filename based on title or default
                const filename = `${image.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
                link.download = filename;

                // Append to body, click, and cleanup
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download failed:', error);
                // Fallback if fetch fails (e.g. CORS)
                window.open(image.url, '_blank');
            }
        } else {
            alert('Please login first to download images.');
        }
    };

    if (imgError) return null; // Hide the card if the image asset is missing from Cloudinary

    return (
        <Link href={`/image/${image.id}`}>
            <div
                className="group relative overflow-hidden transition-all duration-300 aspect-[4/5] bg-gray-100"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Fixed Size Image Container - Crops overflow */}
                <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={() => setImgError(true)}
                />

                {/* Sleek Overlay - Only visible on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-between p-4">
                    {/* Top Row: ID & Download */}
                    <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-500 delay-75">
                        <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-2 py-1 rounded border border-white/20">
                            #{image.id.slice(-4)}
                        </span>
                        {allowDownload && (
                            <button
                                onClick={handleDownload}
                                className="bg-white/10 backdrop-blur-md text-white p-2 hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300 border border-white/10 rounded-sm"
                                title="Download Image"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Bottom Row: Title & Price */}
                    <div className="opacity-0 group-hover:opacity-100 translate-y-[10px] group-hover:translate-y-0 transition-all duration-500 delay-100">
                        <h3 className="font-bold text-sm text-white line-clamp-2 mb-1 tracking-tight">
                            {image.title}
                        </h3>
                        <div className="flex justify-between items-center border-t border-white/20 pt-2">
                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{image.author}</span>
                            <span className="font-black text-green-400 text-xs tracking-widest">FREE</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
