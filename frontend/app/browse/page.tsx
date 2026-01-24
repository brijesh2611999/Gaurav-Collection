'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageCard from '@/components/ImageCard';
import { categories, ImageData } from '@/lib/mockData';

function BrowseContent() {
    const searchParams = useSearchParams();
    const queryCategory = searchParams.get('category');
    const querySearch = searchParams.get('q');

    const [selectedCategory, setSelectedCategory] = useState<string>(queryCategory || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(querySearch || '');
    const [sortBy, setSortBy] = useState<string>('popular');
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/images`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setImages(data);
                }
            } catch (error) {
                console.error('Failed to fetch images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (queryCategory) setSelectedCategory(queryCategory);
        if (querySearch) setSearchQuery(querySearch);
    }, [queryCategory, querySearch]);

    const filteredImages = images.filter(img => {
        const matchesCategory = selectedCategory === 'all' || img.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = searchQuery === '' ||
            img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            img.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            img.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Sorting logic
    const sortedImages = [...filteredImages].sort((a, b) => {
        if (sortBy === 'recent') return b.id.localeCompare(a.id);
        if (sortBy === 'downloads') return b.downloads - a.downloads;
        return b.likes - a.likes;
    });

    return (
        <div className="pt-32 pb-20 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 border-b-2 border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Browse <span className="text-[var(--primary)]">Images</span>
                        </h1>
                        <p className="text-gray-500 font-medium">
                            Displaying {sortedImages.length} results
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                    </div>

                    {/* Quick Search */}
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Refine search..."
                            className="w-full px-4 py-2.5 pl-12 rounded-xl border border-gray-300 focus:border-[var(--primary)] focus:outline-none shadow-sm text-sm"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="mb-12 space-y-8">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-2.5 rounded text-sm font-bold uppercase tracking-widest transition-all ${selectedCategory === 'all'
                                ? 'ib-button-red shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.slug)}
                                className={`px-6 py-2.5 rounded text-sm font-bold uppercase tracking-widest transition-all ${selectedCategory === category.slug
                                    ? 'ib-button-red shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Settings Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-4 bg-gray-50 border border-gray-200 rounded">
                        <div className="flex items-center space-x-4">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Sort By:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded bg-white text-sm font-bold text-gray-700 focus:outline-none focus:border-[var(--primary)]"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="recent">Most Recent</option>
                                <option value="downloads">Highest Downloads</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded border transition-all ${viewMode === 'grid'
                                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md'
                                    : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('masonry')}
                                className={`p-2 rounded border transition-all ${viewMode === 'masonry'
                                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md'
                                    : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Images Display - Uniform Grid Style */}
                {sortedImages.length > 0 ? (
                    <div className={
                        viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1"
                            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
                    }>
                        {sortedImages.map((image) => (
                            <ImageCard key={image.id} image={image} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                        <div className="text-6xl mb-6 opacity-30">🔍</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No matching images found</h2>
                        <p className="text-gray-500 mb-10 max-w-sm mx-auto">We couldn't find anything matching your search. Please try different keywords or browse categories.</p>
                        <button
                            onClick={() => { setSelectedCategory('all'); setSearchQuery('') }}
                            className="px-10 py-3 ib-button-red rounded font-bold uppercase tracking-widest text-sm"
                        >
                            Reset Search
                        </button>
                    </div>
                )}

                {/* Load More */}
                {sortedImages.length > 0 && (
                    <div className="text-center mt-20">
                        <button className="px-12 py-4 border-2 border-[var(--primary)] text-[var(--primary)] font-bold uppercase tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all">
                            Load More Results
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BrowsePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Suspense fallback={<div className="pt-32 text-center font-bold uppercase tracking-widest text-gray-400">Searching Registry...</div>}>
                <BrowseContent />
            </Suspense>
            <Footer />
        </div>
    );
}
