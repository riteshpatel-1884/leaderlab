"use client";
import React, { useState, useEffect } from 'react';
import {
  FaGraduationCap,
  FaBars,
  FaXmark,
  FaBrain,
  FaBullseye,
  FaBolt,
  FaUsers,
  FaArrowTrendUp,
  FaBookOpen,
  FaAward,
  FaArrowRight,
  FaWandMagicSparkles,
  FaCircleCheck,
  FaFileLines,
} from "react-icons/fa6";
import Navbar from './components/Navbar/navbar';
import Footer from './components/footer/footer';
 



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

export default function MinimalHomepage() {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      icon: FaBolt,
      title: "Coding Challenge Mentor",
      description: "AI mentor that explains DSA concepts, debugs your code, and provides optimal solutions with explanations",
      quarter: "Q1 2026",
      features: ["Step-by-step explanations", "Multiple solution approaches", "Complexity analysis"]
    },
    {
      icon: FaUsers,
      title: "Smart Study Groups",
      description: "AI matches you with peers based on learning style, subjects, and goals for collaborative success",
      quarter: "Q2 2026",
      features: ["AI-powered peer matching", "Collaborative note-taking", "Group study session scheduler"]
    },
    {
      icon: FaArrowTrendUp,
      title: "Career Path Predictor",
      description: "AI model analyzes your skills, interests, and market trends to suggest optimal career trajectories",
      quarter: "Q1 2026",
      features: ["Personalized roadmaps", "Skill gap analysis", "Industry trend insights"]
    },
    {
      icon: FaBookOpen,
      title: "AI Placement Prep Assistant",
      description: "Adaptive quiz generation and personalized study plans based on your weak areas and exam patterns",
      quarter: "Q2 2026",
      features: ["Previous year paper analysis", "Adaptive practice tests", "Performance tracking"]
    },
    {
      icon: FaAward,
      title: "LinkedIn Profile Optimizer",
      description: "AI-powered suggestions to make your LinkedIn profile 10x more attractive to campus recruiters",
      quarter: "Q2 2026",
      features: ["Headline optimization", "Keyword suggestions", "Content ideas generator"]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Simple background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Meet your new
              <br />
              <span className="text-blue-500">AI-Powered</span>
              <br />
              Placement partner
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Analyze your resume, beat ATS filters, and prepare smarter for campus placements with AI built specifically for students and freshers.
            </p>

            <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
              Get Started
              <FaArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Why Our Resume Analyzer Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why our <span className="text-blue-500">Resume Analyzer</span> stands out
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built specifically for college students and freshers targeting campus placements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 border border-gray-800 rounded-lg hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center mb-4 text-white-500">
                  {/* explicit size ensures visibility */}
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section id="upcoming" className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-full mb-6">
              <FaWandMagicSparkles className="text-white-500" size={16} />
              <span className="text-white-500 text-sm font-medium">Coming Soon</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What's <span className="text-blue-500">next</span> for You
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're constantly innovating to bring you the most powerful AI tools for placement success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, idx) => (
              <div key={idx} className="p-6 border border-gray-800 rounded-lg hover:border-blue-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center text-white-500">
                    <feature.icon size={24} />
                  </div>
                  <span className="px-3 py-1 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded text-white-500 text-xs font-medium">
                    {feature.quarter}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-2">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <FaCircleCheck className="text-white-500 flex-shrink-0" size={16} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Suggest Feature CTA */}
          <div className="mt-16 text-center">
            <div className="inline-block p-8 border border-gray-800 rounded-lg hover:border-blue-500 transition-colors">
              <p className="text-xl mb-4">Have a feature idea?</p>
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2">
                <FaFileLines size={20} />
                Suggest a Feature
              </button>
              <p className="text-sm text-gray-400 mt-3">ritesh20047@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}