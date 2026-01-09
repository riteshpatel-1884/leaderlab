'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-4xl transition-all duration-500 ${
          scrolled ? 'top-2 sm:top-4 w-[92%] sm:w-[85%]' : ''
        }`}
      >
        <div className={`bg-gray-900/95 backdrop-blur-2xl border border-gray-800 rounded-full px-4 sm:px-8 py-3 sm:py-4 shadow-2xl transition-all duration-500 ${
          scrolled ? 'shadow-purple-500/10 py-2.5 sm:py-3' : 'shadow-purple-500/5'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="/">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-white">
                  Leader<span className="text-brand-primary">Lab.</span>
                </span>
              </a>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-gray-400 hover:text-blue-500 transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#how-it-works" className="text-sm font-semibold text-gray-400 hover:text-blue-500 transition-colors relative group">
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#subjects" className="text-sm font-semibold text-gray-400 hover:text-blue-500 transition-colors relative group">
                Subjects
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <a href="/subjects/sql">
                <button className="px-5 py-2.5 bg-brand-primary text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  Try one question
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-gray-900/98 backdrop-blur-2xl border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-6 gap-2">
              <a 
                href="#features" 
                onClick={handleLinkClick}
                className="text-base font-semibold text-gray-300 hover:text-purple-500 transition-colors py-3 px-4 rounded-xl hover:bg-gray-800/50"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={handleLinkClick}
                className="text-base font-semibold text-gray-300 hover:text-purple-500 transition-colors py-3 px-4 rounded-xl hover:bg-gray-800/50"
              >
                How it Works
              </a>
              <a 
                href="#subjects" 
                onClick={handleLinkClick}
                className="text-base font-semibold text-gray-300 hover:text-purple-500 transition-colors py-3 px-4 rounded-xl hover:bg-gray-800/50"
              >
                Subjects
              </a>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <a href="/subjects/sql" onClick={handleLinkClick}>
                  <button className="w-full px-5 py-3.5 bg-brand-primary text-white rounded-full font-semibold text-base hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    Try one question
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}