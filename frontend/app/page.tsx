'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageCard from '@/components/ImageCard';
import { categories, ImageData } from '@/lib/mockData';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://gaurav-collection.onrender.com/api/images');
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

  const featuredImages = images.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Gaurav Collection Authentic Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Large, Emotive Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&q=80')`,
              animation: 'slowZoom 20s infinite alternate'
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 drop-shadow-lg tracking-tight">
            The World's Largest Collection of
            <br />
            <span className="text-white">Indian Images</span>
          </h1>

          {/* Gaurav Collection Authentic High-Contrast Search */}
          <div className="max-w-3xl mx-auto mt-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/browse?q=${encodeURIComponent(searchQuery)}`;
              }}
              className="relative flex items-center bg-gradient-to-r from-white/95 via-white/80 to-white/95 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl p-0.5 border border-white/20"
            >
              <div className="flex-grow flex items-center px-3 sm:px-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="w-full px-2 sm:px-4 py-2 bg-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="ib-button-red h-full px-4 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-base uppercase tracking-widest rounded-lg mr-0.5 whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium">
            <span className="opacity-80">Popular:</span>
            {['Festivals', 'People', 'Lifestyle', 'Nature'].map((tag) => (
              <Link
                key={tag}
                href={`/browse?q=${tag.toLowerCase()}`}
                className="hover:underline underline-offset-4"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Categories Section - Clean & Professional */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b-2 border-gray-100 pb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Browse by <span className="text-[var(--primary)]">Category</span>
            </h2>
            <Link href="/browse" className="text-[var(--primary)] font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/browse?category=${category.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Find distinctive images for categories */}
                <div className="absolute inset-0 z-0">
                  <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110`}
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542332213-31f87348057f?w=600&h=450&fit=crop&q=80')` }} />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 z-10">
                  <span className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{category.icon}</span>
                  <h3 className="text-2xl font-bold tracking-wide uppercase">{category.name}</h3>
                  <div className="w-12 h-1 bg-[var(--primary)] mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Images Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Now</h2>
            <div className="w-20 h-1.5 bg-[var(--primary)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
            {featuredImages.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/browse"
              className="inline-block px-12 py-4 ib-button-red rounded-sm text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Explore Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Values / Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="text-5xl text-[var(--primary)] mb-6">🏆</div>
              <h3 className="text-xl font-bold mb-4 uppercase">World Class Quality</h3>
              <p className="text-gray-600">Every image in our collection is meticulously curated for technical excellence.</p>
            </div>
            <div className="p-6">
              <div className="text-5xl text-[var(--primary)] mb-6">⚡</div>
              <h3 className="text-xl font-bold mb-4 uppercase">Instant Download</h3>
              <p className="text-gray-600">Get your high-resolution images immediately after purchase with our secure system.</p>
            </div>
            <div className="p-6">
              <div className="text-5xl text-[var(--primary)] mb-6">🤝</div>
              <h3 className="text-xl font-bold mb-4 uppercase">Trusted by Thousands</h3>
              <p className="text-gray-600">The preferred choice for advertising agencies and brands globally.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Ready to transform your creative projects?</h2>
          <p className="text-xl text-gray-400 mb-12">Join the largest community of Indian visual storytelling today.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/browse"
              className="px-10 py-4 ib-button-red text-lg tracking-widest uppercase font-bold"
            >
              Start Browsing
            </Link>
            <button className="px-10 py-4 border-2 border-white hover:bg-white hover:text-gray-900 transition-all text-lg tracking-widest uppercase font-bold">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
