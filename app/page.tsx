"use client";
import React, { useState } from 'react';
import {
  FaBrain,
  FaBullseye,
  FaBolt,
  FaUsers,
  FaArrowRight,
  FaWandMagicSparkles,
  FaFileLines,
  FaCirclePlay,
  FaChartLine,
  FaCircleCheck,
  FaRankingStar,
  FaLightbulb,
  FaTrophy,
  FaXmark,
  FaBug,
  FaPaperPlane,
  FaSpinner
} from "react-icons/fa6";
import Link from 'next/link';

// --- TYPES ---
interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface UpcomingFeature {
  icon: React.ElementType;
  title: string;
  description: string;
  quarter: string;
  features: string[];
}

// --- MAIN COMPONENT ---
export default function MinimalHomepage() {
  // --- STATE FOR MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'FEATURE' | 'ISSUE'>('FEATURE');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  // Popular Feature Tags
  const featureTags = [
    "Gamification 🎮", "Dark Mode 🌙", "Interview Prep 🤝", 
    "Mobile App 📱", "Resume Builder 📄", "Mock Tests 📝"
  ];

  // Common Issue Tags
  const issueTags = [
    "Login Issues 🔑", "Slow Loading 🐢", "Broken Link 🔗", 
    "UI Glitch 🎨", "Payment Issue 💳", "Mobile View 📱"
  ];

  // --- HANDLERS ---
  const openModal = (type: 'FEATURE' | 'ISSUE') => {
    setModalTab(type);
    setSubmitStatus('IDLE');
    setSelectedTag('');
    setDescription('');
    setIsModalOpen(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !selectedTag) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: modalTab,
          category: selectedTag,
          description: description,
          email: email
        })
      });

      if (res.ok) {
        setSubmitStatus('SUCCESS');
        setTimeout(() => {
          closeModal();
          setSubmitStatus('IDLE');
        }, 2000);
      } else {
        setSubmitStatus('ERROR');
      }
    } catch (error) {
      setSubmitStatus('ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DATA ---
  const features: Feature[] = [
    {
      icon: FaBrain,
      title: "Campus-Specific AI",
      description: "Trained on 10,000+ successful campus placement resumes to understand what actually works"
    },
    {
      icon: FaBullseye,
      title: "Company ATS Match",
      description: "Real-time compatibility check with ATS systems used by top companies hiring from campuses"
    },
    {
      icon: FaBolt,
      title: "Instant Feedback",
      description: "Get actionable suggestions in seconds, not days. Fix issues before applying"
    }
  ];

  const upcomingFeatures: UpcomingFeature[] = [
    {
      icon: FaUsers,
      title: "Smart Study Groups",
      description: "AI matches you with peers based on learning style, subjects, and goals for collaborative success",
      quarter: "Q2 2026",
      features: ["AI-powered peer matching", "Collaborative note-taking", "Group study session scheduler"]
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* Gradient Orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* =========================================
          FEEDBACK MODAL 
         ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-[#0F1117] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0F1117]">
              <h3 className="text-xl font-bold text-white">
                {modalTab === 'FEATURE' ? '✨ Suggest a Feature' : '🐞 Report an Issue'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <FaXmark size={24} />
              </button>
            </div>

            {/* Scrollable Body - Hiding Scrollbar */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .custom-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>

              {submitStatus === 'SUCCESS' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCircleCheck className="text-green-500" size={30} />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Thank You!</h4>
                  <p className="text-gray-400">Your feedback has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Toggle Tabs */}
                  <div className="flex p-1 bg-gray-900 rounded-lg border border-gray-800">
                    <button
                      type="button"
                      onClick={() => { setModalTab('FEATURE'); setSelectedTag(''); }}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2
                        ${modalTab === 'FEATURE' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      <FaLightbulb /> New Idea
                    </button>
                    <button
                      type="button"
                      onClick={() => { setModalTab('ISSUE'); setSelectedTag(''); }}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2
                        ${modalTab === 'ISSUE' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      <FaBug /> Bug Report
                    </button>
                  </div>

                  {/* Tags Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      {modalTab === 'FEATURE' ? 'What do you want to see?' : 'What went wrong?'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(modalTab === 'FEATURE' ? featureTags : issueTags).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all
                            ${selectedTag === tag 
                              ? (modalTab === 'FEATURE' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-red-500/20 border-red-500 text-red-400')
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {modalTab === 'FEATURE' ? 'Tell us more about your idea' : 'Describe the issue'}
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={modalTab === 'FEATURE' 
                        ? "I think adding a leaderboard for colleges would be cool..." 
                        : "When I click the profile button, nothing happens..."}
                      className="w-full h-32 bg-black/30 border border-gray-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Your Email <span className="text-gray-600 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-black/30 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || (!description && !selectedTag)}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                      ${modalTab === 'FEATURE' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500' 
                        : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500'}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                  </button>

                  {submitStatus === 'ERROR' && (
                    <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </div>
            
            {/* Footer Text */}
            <div className="p-4 bg-gray-900/50 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">
                Or email us directly at <span className="text-blue-400">ritesh20047@gmail.com</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Full Height */}
      <section className="relative min-h-screen flex items-center px-6 pt-16 pb-20 md:pb-0">
        {/* ... (Existing Hero Background Code) ... */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}} />
          <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tight">
                Are You Actually{" "}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                    Job-Ready?
                  </span>
                  <div className="absolute -bottom-3 left-0 w-full h-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-xl" />
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-xl">
                LeaderLab tracks your preparation, ranks your progress, and exposes your blind spots before recruiters do.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/technical-area">
                <button className="group cursor-pointer px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white text-lg font-bold rounded-xl transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105">
                  Start Your Journey
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
                </Link>
                
                <button className="px-8 cursor-pointer py-4 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-purple-400/50 text-white text-lg font-bold rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 flex items-center gap-3">
                  <FaCirclePlay size={20} />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Visual - COMPACT Flowchart */}
            <div className="relative w-full max-w-md mx-auto">
               {/* ... (Existing Flowchart Code) ... */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-5 border border-gray-700/50 shadow-2xl">
                {/* Compact Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FaChartLine size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">Your Journey Path</div>
                    <div className="text-xs text-gray-400">Track → Rank → Improve</div>
                  </div>
                </div>
                
                {/* Compact Steps */}
                <div className="space-y-2">
                  
                  {/* Step 1: Commit */}
                  <div className="relative p-3 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <FaCircleCheck size={16} className="text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-white font-bold text-sm">Daily Commitment + Technical Area</h3>
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 w-3/4" />
                          </div>
                          <span className="text-[10px] font-bold text-blue-400">+150</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tiny Arrow */}
                  <div className="flex justify-center h-3">
                     <div className="w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
                  </div>

                  {/* Step 2: Rank */}
                  <div className="relative p-3 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <FaRankingStar size={16} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-white font-bold text-sm">Global Rank</h3>
                          <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30">LIVE</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-400">Rank: <span className="text-white font-bold">#247</span></span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full" />
                          <span className="text-gray-400">Pts: <span className="text-white font-bold">2,450</span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tiny Arrow */}
                  <div className="flex justify-center h-3">
                     <div className="w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />
                  </div>

                  {/* Step 3: Compare */}
                  <div className="relative p-3 bg-gradient-to-r from-pink-500/10 to-transparent border border-pink-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <FaChartLine size={16} className="text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm mb-1.5">Analysis</h3>
                        <div className="flex gap-2 text-[10px]">
                          <div className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-green-400">
                             Top 5%
                          </div>
                          <div className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-orange-400">
                             Ahead of 9k+
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tiny Arrow */}
                  <div className="flex justify-center h-3">
                     <div className="w-0.5 bg-gradient-to-b from-pink-500 to-green-500" />
                  </div>

                  {/* Step 4: Improve */}
                  <div className="relative p-3 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <FaLightbulb size={16} className="text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm mb-1.5">Focus Areas</h3>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-[10px] text-red-300">DSA 45%</span>
                          <span className="px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/30 rounded text-[10px] text-yellow-300">Sys Des 68%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact CTA Button */}
               <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <Link href="/my-commitment" className="block w-full">
                    <button className="w-full cursor-pointer py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white text-sm font-bold rounded-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30">
                      <FaTrophy size={14} />
                      Start Climbing
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Platform Section */}
      <section id="features" className="py-24 px-6 relative">
         {/* ... (Existing code) ... */}
         <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <FaBullseye className="text-blue-500" size={16} />
              <span className="text-blue-400 text-sm font-medium">Core Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">LeaderLab</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Purpose-built for college students and freshers targeting campus placements with real results
            </p>
          </div>
          {/* ... (Trust section code) ... */}
           <div className="mt-16 grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className="text-3xl font-bold text-blue-500 mb-2">100%</div>
              <div className="text-sm text-gray-400">Free to Use</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className="text-3xl font-bold text-green-500 mb-2">Live</div>
              <div className="text-sm text-gray-400">Ranking System</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className="text-3xl font-bold text-orange-500 mb-2">AI-Powered</div>
              <div className="text-sm text-gray-400">Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section id="upcoming" className="py-24 px-6 relative bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-6">
              <FaWandMagicSparkles className="text-blue-400" size={16} />
              <span className="text-blue-400 text-sm font-medium">Product Roadmap 2026</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Innovations</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're building the future of AI-powered placement preparation. Here's what's coming next
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 mb-12">
            {upcomingFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="md:col-span-2 flex justify-center"
              >
                <div
                  className="group p-6 bg-gray-900 border border-gray-800 rounded-2xl 
                            hover:border-blue-500/50 hover:shadow-xl 
                            w-full max-w-xl"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                      <feature.icon size={22} className="text-blue-400" />
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-semibold">
                      {feature.quarter}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-gray-800">
                    {feature.features.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <FaCircleCheck className="text-blue-500 flex-shrink-0" size={14} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggest Feature CTA - UPDATED */}
          <div className="max-w-3xl mx-auto">
            <div className="p-8 md:p-10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                <FaFileLines size={28} className="text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Have a Feature Idea?</h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Help us build the best placement preparation platform. Share your ideas or report issues to shape the future of our product
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <button 
                  onClick={() => openModal('FEATURE')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl inline-flex items-center gap-3 shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                >
                  <FaFileLines size={20} />
                  Submit Your Idea
                </button>
                
                <button 
                   onClick={() => openModal('ISSUE')}
                   className="px-8 py-4 bg-gray-800 border border-gray-700 hover:border-red-500/50 hover:bg-gray-800/80 text-white font-semibold rounded-xl inline-flex items-center gap-3 hover:scale-105 transition-all"
                >
                  <FaBug className="text-red-400" size={20} />
                  Report a Problem
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>Or email us at</span>
                <a href="mailto:ritesh20047@gmail.com" className="text-blue-400 hover:text-blue-300 font-medium">
                  ritesh20047@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}