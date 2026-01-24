'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import ImageCard from '@/components/ImageCard';
import { categories, ImageData, mockAnalytics } from '@/lib/mockData';

// --- SUB-COMPONENTS (SPA INTERNAL VIEWS) ---

function LibraryView({ isAdmin }: { isAdmin: boolean }) {
    const [images, setImages] = useState<ImageData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const fetchImages = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/images`);
            const data = await response.json();
            if (Array.isArray(data)) setImages(data);
        } catch (error) {
            console.error('Failed to fetch images:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) fetchImages();
    }, [isAdmin]);

    const filteredImages = useMemo(() => images.filter(img => {
        const query = searchQuery.toLowerCase();
        return (
            (img.title?.toLowerCase() || '').includes(query) ||
            (img.category?.toLowerCase() || '').includes(query) ||
            (img.author?.toLowerCase() || '').includes(query) ||
            (img.description?.toLowerCase() || '').includes(query)
        );
    }), [images, searchQuery]);

    const handleDelete = async (id: string) => {
        if (confirm('Bhidu, pakka delete karna hai?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/images/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) setImages(images.filter(img => img.id !== id));
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Loading Assets...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-slideUp">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-sans font-black text-gray-900 uppercase tracking-tight">Image <span className="text-[var(--primary)]">Library</span></h2>
                    <p className="text-sm text-gray-500 mt-1">{filteredImages.length} masterpieces archived</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggles */}
                    <div className="bg-white p-1 rounded-xl border border-gray-200 flex items-center shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-red-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-red-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search images..."
                            className="w-full md:w-64 pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all outline-none text-sm"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredImages.map((image, idx) => (
                        <div key={image.id} className="relative group">
                            <ImageCard image={image} allowDownload={false} />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(image.id);
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-600 shadow-lg"
                                title="Delete Image"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Preview</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Category</th>

                                <th className="px-8 py-5 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredImages.map((image, idx) => (
                                <tr key={image.id} className="group hover:bg-gray-50/50 transition-all" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <td className="px-8 py-4">
                                        <div className="w-20 h-14 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                                            <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="font-bold text-gray-900 text-sm group-hover:text-[var(--primary)] transition-colors">{image.title}</p>
                                        <p className="text-xs text-gray-500 font-medium">{image.author}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold uppercase">
                                            {image.category}
                                        </span>
                                    </td>

                                    <td className="px-8 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(image.id)}
                                            className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500 transition-all active:scale-90"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function UploadView({ user }: { user: any }) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', category: '', tags: '', file: null as File | null });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.file) { alert('Please select an image!'); return; }
        setIsUploading(true);

        try {
            const data = new FormData();
            data.append('image', formData.file);
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('author', user?.name || 'Admin');
            data.append('tags', formData.tags);

            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/images`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (response.ok) {
                alert('Image uploaded successfully! 🕶️');
                setFormData({ title: '', description: '', category: '', tags: '', file: null });
                setPreviewUrl(null);
            }
        } catch (error) { console.error(error); }
        finally { setIsUploading(false); }
    };

    return (
        <div className="max-w-3xl mx-auto animate-slideUp space-y-8">
            <div>
                <h2 className="text-3xl font-sans font-black text-gray-900 uppercase tracking-tight">Upload New <span className="text-[var(--primary)]">Masterpiece</span></h2>
                <p className="text-gray-500 font-sans text-sm mt-2">Upload an image and fill in the details below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Upload Image Area */}
                <div className="relative aspect-[4/3] max-h-96 rounded-3xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center overflow-hidden group hover:border-[var(--primary)] transition-all">
                    {previewUrl ? (
                        <>
                            <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewUrl(null);
                                        setFormData({ ...formData, file: null });
                                    }}
                                    className="px-6 py-3 bg-white text-gray-900 rounded-2xl font-bold uppercase text-xs tracking-wider hover:bg-gray-100 transition-all"
                                >
                                    Change Image
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-12">
                            <div className="w-12 h-12 mx-auto mb-6 text-gray-400 group-hover:text-[var(--primary)] transition-colors">
                                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-sans font-medium text-base mb-2">Drag 'n' drop files here, or click to select files</p>
                            <p className="text-gray-400 font-sans text-sm">You can upload images (up to 10 MB each)</p>
                        </div>
                    )}
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>

                {/* Form Details - Always visible */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-[var(--primary)]/10 outline-none font-bold font-sans"
                            placeholder="e.g. Beautiful Sunset in Mumbai"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description *</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-[var(--primary)]/10 outline-none resize-none font-sans"
                            placeholder="Describe this masterpiece..."
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-[var(--primary)]/10 outline-none cursor-pointer font-sans"
                                required
                            >
                                <option value="">Select...</option>
                                {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-[var(--primary)]/10 outline-none font-sans"
                                placeholder="nature, art, sunset..."
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-5 rounded-2xl bg-[var(--primary)] text-white font-black uppercase tracking-wider text-sm hover:bg-[#d92e24] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                >
                    {isUploading ? 'UPLOADING...' : 'Upload to Collection 🕶️'}
                </button>
            </form>
        </div>
    );
}


// --- MAIN DASHBOARD ---

export default function AdminPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'images' | 'upload'>('overview');

    if (authLoading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-40 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-8 text-xs font-black text-gray-400 uppercase tracking-widest">Initializing Dashboard...</p>
            </div>
        </div>
    );

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 pt-48 text-center px-4">
                <Navbar />
                <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl">
                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tight mb-4">Access Denied</h1>
                <p className="text-gray-500 mb-8">Admin privileges required</p>
                <Link href="/" className="inline-block bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all">Back to Home</Link>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-sans font-black text-gray-900 uppercase tracking-tight">Admin Dashboard</h1>
                                <p className="text-gray-500 font-sans font-medium mt-1 text-sm">Welcome back, {user.name} 🕶️</p>
                            </div>
                        </div>
                        {/* Header Action Buttons Removed */}
                    </div>

                    {/* Main Content */}
                    <div className="min-h-[60vh]">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden animate-fadeInUp" style={{ animationDelay: '100ms' }} onClick={() => setActiveTab('upload')}>
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500">
                                            <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                        </div>
                                        <h3 className="text-xl font-sans font-bold text-gray-800 uppercase tracking-tight mb-3">Upload Images</h3>
                                        <p className="text-gray-600 font-sans font-medium text-sm mb-6 leading-relaxed">Upload new images to the system.</p>
                                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold uppercase text-xs tracking-wider hover:bg-black transition-all">
                                            Go to Upload
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Manage Images */}
                                <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden animate-fadeInUp" style={{ animationDelay: '200ms' }} onClick={() => setActiveTab('images')}>
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500">
                                            <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                        </div>
                                        <h3 className="text-xl font-sans font-bold text-gray-800 uppercase tracking-tight mb-3">Manage Images</h3>
                                        <p className="text-gray-600 font-sans font-medium text-sm mb-6 leading-relaxed">Organize and edit existing images.</p>
                                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold uppercase text-xs tracking-wider hover:bg-black transition-all">
                                            Go to Images
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                        {activeTab !== 'overview' && (
                            <div className="space-y-8">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors group"
                                >
                                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    Back to Dashboard
                                </button>

                                {activeTab === 'images' && <LibraryView isAdmin={isAdmin} />}
                                {activeTab === 'upload' && <UploadView user={user} />}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
