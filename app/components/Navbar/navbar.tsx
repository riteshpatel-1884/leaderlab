"use client";

import { useState, useEffect } from "react";
import { Sparkles, Menu, X, ChevronRight, FileText, LogIn } from "lucide-react";
import Image from "next/image"; 
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Get user authentication status from Clerk
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/2026-goals", label: "2026 Goals", icon: FileText, description: "My Goals of 2026" },
     { href: "/dashboard", label: "Dashboard", icon: FileText, description: "My profile details" },
      { href: "/my-commitment", label: "My Commitment", icon: FileText, description: "My daily commitment" },
      { href: "/where-i-stand", label: "Where I Stand", icon: FileText, description: "Where I stand in the job market" }
  ];

  return (
    <>
      <div>
        <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/5"
            : "bg-transparent"
        }`}
       >
        <nav className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="block">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-lg opacity-50" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Image 
                      src="/logo/icon.png" 
                      alt="Project X logo" 
                      width={132} 
                      height={132} 
                      className="-mr-1" 
                    />
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              
              {/* Conditional Auth Button - Desktop */}
              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <div className="flex items-center">
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-9 h-9"
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <Link
                      href="/sign-in"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-[60] p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[55] md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-slate-950 z-[55] md:hidden transform transition-transform duration-300 ease-out border-l border-slate-800/50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20 pointer-events-none" />
          
          {/* Menu Header */}
          <div className="relative pt-16 pb-1 px-6 border-b border-slate-800/70">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <Image 
                  src="/logo/logo.png" 
                  alt="LeaderLab" 
                  width={132} 
                  height={132} 
                  className="-mr-1" 
                />
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="relative flex-1 overflow-y-auto py-6 px-6 hide-scrollbar">
            <div className="space-y-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/50 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg blur group-hover:blur-md transition-all" />
                      <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700/50 group-hover:border-slate-600 transition-all">
                        <Icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-white font-medium block">{link.label}</span>
                      <span className="text-xs text-slate-500 block truncate">{link.description}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Menu Footer - Conditional Auth */}
          <div className="relative p-6 border-t border-slate-800/70 bg-slate-950/50">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  // Authenticated User
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm text-green-400 font-medium">Signed in</span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full shadow-lg">
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-9 h-9"
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  // Not Authenticated - Sign In Button
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border border-blue-500/50 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    <LogIn className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Sign In</span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}