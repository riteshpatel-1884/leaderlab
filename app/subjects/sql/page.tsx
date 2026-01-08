"use client";

import React, { useState, useEffect } from "react";
import { SqlQuestion, sqlQuestions } from "@/data/sql/sqlQuestions";
import MacCodeWindow from "@/app/component/MacCodeWindow/MacCodeWindow";
import { X, Play, Loader2, Send, GripVertical, Filter } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import Navbar from "@/app/component/navbar/navbar";

export default function SqlPracticePage() {
  const [selectedQuestion, setSelectedQuestion] = useState<SqlQuestion | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Filter states
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  
  // Resizable widths and heights
  const [problemWidth, setProblemWidth] = useState(41.666667);
  const [queryHeight, setQueryHeight] = useState(60);
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    } else if (savedTheme === 'light') {
      setIsDark(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Save theme preference and apply class whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, mounted]);

  // Group questions by topic
  const groupedQuestions = sqlQuestions.reduce((acc, question) => {
    const topic = question.topic || "Other";
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(question);
    return acc;
  }, {} as Record<string, SqlQuestion[]>);

  // Get unique topics and difficulties
  const topics = ["All", ...Object.keys(groupedQuestions).sort()];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  // Filter questions
  const filteredGroupedQuestions = Object.entries(groupedQuestions).reduce((acc, [topic, questions]) => {
    // Filter by topic
    if (selectedTopic !== "All" && topic !== selectedTopic) {
      return acc;
    }

    // Filter by difficulty
    const filteredQuestions = selectedDifficulty === "All" 
      ? questions 
      : questions.filter(q => q.difficulty === selectedDifficulty);

    if (filteredQuestions.length > 0) {
      acc[topic] = filteredQuestions;
    }

    return acc;
  }, {} as Record<string, SqlQuestion[]>);

  const openQuestion = (q: SqlQuestion) => {
    setSelectedQuestion(q);
    setUserQuery("");
    setFeedback("");
  };

  const closeQuestion = () => {
    setSelectedQuestion(null);
  };

  const handleSubmit = async () => {
    if (!userQuery.trim()) return;
    setLoading(true);
    setFeedback("");

    try {
      const res = await fetch("/api/evaluate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion?.description,
          schema: selectedQuestion?.schema,
          userQuery: userQuery,
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch (err) {
      setFeedback("Error connecting to the interviewer.");
    } finally {
      setLoading(false);
    }
  };

  const handleHorizontalMouseDown = (e: React.MouseEvent) => {
    setIsResizingHorizontal(true);
    e.preventDefault();
  };

  const handleVerticalMouseDown = (e: React.MouseEvent) => {
    setIsResizingVertical(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingHorizontal) {
        const modal = document.getElementById('modal-container');
        if (!modal) return;
        
        const rect = modal.getBoundingClientRect();
        const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
        
        if (newWidth > 20 && newWidth < 70) {
          setProblemWidth(newWidth);
        }
      }
      
      if (isResizingVertical) {
        const panel = document.getElementById('right-panel');
        if (!panel) return;
        
        const rect = panel.getBoundingClientRect();
        const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
        
        if (newHeight > 20 && newHeight < 80) {
          setQueryHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingHorizontal(false);
      setIsResizingVertical(false);
    };

    if (isResizingHorizontal || isResizingVertical) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingHorizontal, isResizingVertical]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e27] text-gray-900 dark:text-white transition-colors duration-300">
      
      <Navbar/> 

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 pt-40">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Practice <span className="text-indigo-600 dark:text-indigo-400 relative inline-block"> SQL </span> the way <br />
            <span className="text-indigo-600 dark:text-indigo-400 relative inline-block">
              interviews judge you.
              <svg className="absolute -bottom-7 left-0 w-full" viewBox="0 0 300 12" fill="none">
               
              </svg>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            Write the{" "}
            <span className="font-bold text-gray-900 dark:text-white underline decoration-indigo-600 dark:decoration-indigo-400 underline-offset-4">SQL query.</span>{" "}
            Get evaluated the way interviews evaluate it.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2">
              <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter:</span>
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-indigo-500'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Topic Filter */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer hover:border-indigo-500 transition-all"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic === "All" ? "All Topics" : topic}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions Grouped by Topic */}
        <div className="space-y-8">
          {Object.entries(filteredGroupedQuestions).map(([topic, questions]) => (
            <div key={topic} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{topic}</h2>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold">
                  {questions.length} {questions.length === 1 ? 'question' : 'questions'}
                </span>
              </div>

              <div className="space-y-3">
                {questions.map((q) => (
                  <motion.div
                    key={q.id}
                    onClick={() => openQuestion(q)}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    className="group cursor-pointer border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-5 rounded-xl hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <Play className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {q.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {q.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 
                          q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : 
                          'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                        {q.difficulty}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(filteredGroupedQuestions).length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No questions found with the selected filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pop-up Modal */}
      <AnimatePresence>
        {selectedQuestion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={closeQuestion}
          >
            <motion.div 
              id="modal-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-7xl h-[90vh] bg-white dark:bg-[#0f1629] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border-2 border-gray-200 dark:border-gray-800"
            >
              {/* LEFT SIDE: Problem & Schema - Resizable */}
              <div 
                style={{ width: `${problemWidth}%` }}
                className="border-r-2 border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-[#0a0e27] relative"
              >
                <div className="p-8 overflow-y-auto h-full">
                  <button 
                    onClick={closeQuestion}
                    className="mb-6 flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors md:hidden"
                  >
                    <X className="w-4 h-4 mr-2" /> Close
                  </button>

                  <h2 className="text-3xl font-bold mb-3">{selectedQuestion.title}</h2>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-6
                    ${selectedQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : 
                      selectedQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400' : 
                      'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'}`}>
                    {selectedQuestion.difficulty}
                  </span>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">Problem</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedQuestion.description}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Database Schema</h3>
                    <MacCodeWindow code={selectedQuestion.schema} title="schema.sql" />
                  </div>
                </div>
              </div>

              {/* HORIZONTAL RESIZE HANDLE */}
              <div 
                className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 dark:hover:bg-indigo-500 cursor-col-resize flex items-center justify-center group relative"
                onMouseDown={handleHorizontalMouseDown}
              >
                <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 absolute" />
              </div>

              {/* RIGHT SIDE: IDE & Feedback - Resizable */}
              <div 
                id="right-panel"
                className="flex-1 flex flex-col h-full bg-white dark:bg-[#0f1629] relative"
              >
                <button 
                  onClick={closeQuestion}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 hover:text-red-600 transition-all z-10 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Input Area - Resizable */}
                <div className="p-8 flex flex-col" style={{ height: `${queryHeight}%` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold">Your Query</h3>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full uppercase tracking-wide">SQL</span>
                  </div>
                  
                  <div className="flex-1 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg min-h-0">
                    <CodeMirror
                      value={userQuery}
                      height="100%"
                      theme={isDark ? "dark" : "light"}
                      extensions={[sql()]}
                      onChange={(value) => setUserQuery(value)}
                      placeholder="SELECT * FROM ..."
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !userQuery}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:cursor-not-allowed shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Evaluating...
                        </>
                      ) : (
                        <>
                          Submit Solution <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* VERTICAL RESIZE HANDLE */}
                {feedback && (
                  <div 
                    className="h-1 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 dark:hover:bg-indigo-500 cursor-row-resize flex items-center justify-center group relative"
                    onMouseDown={handleVerticalMouseDown}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 rotate-90 absolute" />
                  </div>
                )}

                {/* Feedback Area */}
                {feedback && (
                  <div 
                    style={{ height: `${100 - queryHeight}%` }}
                    className="border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0e27] relative overflow-hidden"
                  >
                    <div className="p-8 overflow-y-auto h-full">
                      <h3 className="text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-4 flex items-center gap-2">
                        💬 Interviewer Feedback
                      </h3>
                      <div className="prose dark:prose-invert prose-indigo max-w-none">
                        <ReactMarkdown>{feedback}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}