'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl transition-all duration-500 ${
        scrolled ? 'top-4 w-[85%]' : ''
      }`}
    >
      <div className={`bg-surface/90 backdrop-blur-2xl border border-border-subtle rounded-full px-8 py-4 shadow-2xl transition-all duration-500 ${
        scrolled ? 'shadow-brand-primary/10 py-3' : 'shadow-brand-primary/5'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="/">
              <span className="font-bold text-xl tracking-tight text-white">
              Leader<span className="text-brand-primary">Lab.</span>
            </span>
            </a>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-text-secondary hover:text-brand-primary transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-text-secondary hover:text-brand-primary transition-colors relative group">
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#subjects" className="text-sm font-semibold text-text-secondary hover:text-brand-primary transition-colors relative group">
              Subjects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a href="/subjects/sql">
              <button className="px-5 py-2.5 bg-brand-primary text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-brand-primary/30 hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Try one question
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}