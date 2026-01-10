"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SqlQuestion, sqlQuestions } from "@/data/sql/sqlQuestions";
import MacCodeWindow from "@/app/component/MacCodeWindow/MacCodeWindow";
import { X, Play, Loader2, Send, GripVertical, Filter, ChevronDown, ChevronUp, MessageSquare, Brain, Zap, ArrowLeft, CheckCircle2, Trophy, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { useUser } from "@clerk/nextjs";

export default function SqlPracticePage() {
  const { user, isLoaded } = useUser();
  const [selectedQuestion, setSelectedQuestion] = useState<SqlQuestion | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<SqlQuestion | null>(null);
  
  // Cooldown states
  const [cooldownEnd, setCooldownEnd] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  
  // Progress states
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [failedIds, setFailedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"practice" | "solved" | "locked">("practice");
  
  // New attempt tracking states
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [hasAskedFollowUp, setHasAskedFollowUp] = useState<boolean>(false);
  const [showPracticeMoreButton, setShowPracticeMoreButton] = useState<boolean>(false);
  const [showFollowUpTextArea, setShowFollowUpTextArea] = useState<boolean>(false);
  const [hintLoading, setHintLoading] = useState<boolean>(false);
  
  // Follow-up conversation states
  const [followUpResponse, setFollowUpResponse] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  
  // Mobile section visibility
  const [showProblem, setShowProblem] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  
  // Filter states
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  
  // Resizable widths and heights
  const [problemWidth, setProblemWidth] = useState(41.666667);
  const [queryHeight, setQueryHeight] = useState(60);
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);

  // Calculate time left for cooldown (IST)
  useEffect(() => {
    if (!cooldownEnd) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const nowUTC = new Date();
      const nowIST = new Date(nowUTC.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const endIST = new Date(cooldownEnd.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const diff = endIST.getTime() - nowIST.getTime();

      if (diff <= 0) {
        setTimeLeft("");
        setCooldownEnd(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s (IST)`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [cooldownEnd]);

  // Fetch Solved Questions from DB
  const fetchProgress = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/user-progress?clerkUserId=${user.id}`);
      const data = await res.json();
      if (data.solvedIds) {
        setSolvedIds(data.solvedIds);
      }
      if (data.failedIds) {
        setFailedIds(data.failedIds);
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  }, [user?.id]);

  // Check cooldown status for selected question
  const checkCooldown = useCallback(async (questionId: number) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/check-cooldown?clerkUserId=${user.id}&questionId=${questionId}`);
      
      if (!res.ok) {
        console.error("Cooldown check failed:", res.status);
        setCooldownEnd(null);
        return;
      }
      
      const data = await res.json();
      
      if (data.cooldownUntil) {
        setCooldownEnd(new Date(data.cooldownUntil));
      } else {
        setCooldownEnd(null);
      }
    } catch (err) {
      console.error("Error checking cooldown:", err);
      setCooldownEnd(null);
    }
  }, [user?.id]);

  useEffect(() => {
    setMounted(true);
    if (isLoaded && user) {
      fetchProgress();
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    } else if (savedTheme === 'light') {
      setIsDark(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, [isLoaded, user, fetchProgress]);

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

  // Filter and Group questions
  const filteredGroupedQuestions = Object.entries(
    sqlQuestions.reduce((acc, question) => {
      const topic = question.topic || "Other";
      if (!acc[topic]) acc[topic] = [];
      acc[topic].push(question);
      return acc;
    }, {} as Record<string, SqlQuestion[]>)
  ).reduce((acc, [topic, questions]) => {
    if (selectedTopic !== "All" && topic !== selectedTopic) return acc;

    const filteredQuestions = questions.filter(q => {
      const isSolved = solvedIds.includes(q.id);
      const isFailed = failedIds.includes(q.id);
      const matchesDifficulty = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      
      let matchesViewMode = false;
      if (viewMode === "solved") {
        matchesViewMode = isSolved;
      } else if (viewMode === "locked") {
        matchesViewMode = isFailed;
      } else {
        matchesViewMode = !isSolved && !isFailed;
      }
      
      return matchesDifficulty && matchesViewMode;
    });

    if (filteredQuestions.length > 0) {
      acc[topic] = filteredQuestions;
    }
    return acc;
  }, {} as Record<string, SqlQuestion[]>);

  const topics = ["All", ...Array.from(new Set(sqlQuestions.map(q => q.topic))).sort()];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const openQuestion = async (q: SqlQuestion) => {
    if (window.innerWidth < 768) {
      setPendingQuestion(q);
      setShowMobileWarning(true);
    } else {
      setSelectedQuestion(q);
      setUserQuery("");
      setFeedback("");
      setQueryHeight(60);
      setConversationHistory([]);
      setFollowUpResponse("");
      setAttemptNumber(1);
      setIsCorrect(false);
      setHasAskedFollowUp(false);
      setShowPracticeMoreButton(false);
      setShowFollowUpTextArea(false);
      setHintLoading(false);
      await checkCooldown(q.id);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeQuestion = () => {
    setSelectedQuestion(null);
    setFeedback("");
    setUserQuery("");
    setFollowUpResponse("");
    setConversationHistory([]);
    setCooldownEnd(null);
    setTimeLeft("");
    setAttemptNumber(1);
    setIsCorrect(false);
    setHasAskedFollowUp(false);
    setShowPracticeMoreButton(false);
    setShowFollowUpTextArea(false);
    setHintLoading(false);
    document.body.style.overflow = 'auto';
  };

  const handleSubmit = async () => {
    if (!userQuery.trim() || cooldownEnd) return;
    setLoading(true);
    setFeedback("");
    setConversationHistory([]);

    try {
      const res = await fetch("/api/evaluate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion?.description,
          schema: selectedQuestion?.schema,
          userQuery: userQuery,
          questionId: selectedQuestion?.id,
          difficulty: selectedQuestion?.difficulty,
          topic: selectedTopic === "All" ? selectedQuestion?.topic : selectedTopic,
          clerkUserId: user?.id,
          attemptNumber: attemptNumber,
        }),
      });
      const data = await res.json();
      
      // Check if cooldown was set and lock immediately
      if (data.cooldown && data.cooldownUntil) {
        setCooldownEnd(new Date(data.cooldownUntil));
        setShowFollowUpTextArea(false); // Hide text area when locked
      }
      
      setFeedback(data.feedback);
      setIsCorrect(data.isCorrect);
      setHasAskedFollowUp(data.hasAskedFollowUp);
      
      // Show text area after correct answer OR after final attempt (when answer is shown)
      if (data.isCorrect || (attemptNumber >= 3 && !data.isCorrect)) {
        setShowFollowUpTextArea(true);
      }
      
      // Show practice more button if user passed and no follow-up was asked
      if (data.isCorrect && !data.hasAskedFollowUp) {
        setShowPracticeMoreButton(true);
      }
      
      // If wrong and not locked, increment attempt number
      if (!data.isCorrect && !data.cooldown) {
        setAttemptNumber(attemptNumber + 1);
      }
      
      // Refetch progress when question is solved OR locked
      if (data.isCorrect || data.cooldown) {
        fetchProgress();
      }

      setConversationHistory([{ role: "assistant", content: data.feedback }]);
      if (window.innerWidth < 768) setShowFeedback(true);
    } catch (err) {
      setFeedback("Error connecting to the interviewer.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpSubmit = async () => {
    if (!followUpResponse.trim() || cooldownEnd) return;
    setFollowUpLoading(true);
    try {
      const updatedHistory = [...conversationHistory, { role: "user", content: followUpResponse }];
      const res = await fetch("/api/evaluate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion?.description,
          schema: selectedQuestion?.schema,
          userQuery: userQuery,
          followUp: true,
          conversationHistory: updatedHistory,
          userResponse: followUpResponse,
          questionId: selectedQuestion?.id,
          difficulty: selectedQuestion?.difficulty,
          topic: selectedTopic === "All" ? selectedQuestion?.topic : selectedTopic,
          clerkUserId: user?.id,
          isCorrect: isCorrect,
          hasAskedFollowUp: hasAskedFollowUp,
          attemptNumber: attemptNumber,
        }),
      });
      const data = await res.json();
      
      setConversationHistory([...updatedHistory, { role: "assistant", content: data.feedback }]);
      setFeedback(data.feedback);
      setFollowUpResponse("");
      
      // If AI asked a follow-up and user answered, mark it as answered
      if (hasAskedFollowUp) {
        setShowPracticeMoreButton(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleHintRequest = async () => {
    if (cooldownEnd) return;
    setHintLoading(true);
    try {
      const hintMessage = `I'm stuck. Can you give me a specific hint to help me solve this SQL problem? Here's my current query:

\`\`\`sql
${userQuery}
\`\`\`

What should I focus on improving?`;
      
      const updatedHistory = [...conversationHistory, { role: "user", content: hintMessage }];
      
      const res = await fetch("/api/evaluate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion?.description,
          schema: selectedQuestion?.schema,
          userQuery: userQuery,
          followUp: true,
          conversationHistory: updatedHistory,
          userResponse: hintMessage,
          questionId: selectedQuestion?.id,
          difficulty: selectedQuestion?.difficulty,
          topic: selectedTopic === "All" ? selectedQuestion?.topic : selectedTopic,
          clerkUserId: user?.id,
          isCorrect: isCorrect,
          hasAskedFollowUp: hasAskedFollowUp,
          attemptNumber: attemptNumber,
        }),
      });
      const data = await res.json();
      
      setConversationHistory([...updatedHistory, { role: "assistant", content: data.feedback }]);
      setFeedback(data.feedback);
    } catch (err) {
      console.error(err);
    } finally {
      setHintLoading(false);
    }
  };

  // RESIZING LOGIC
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingHorizontal) {
        const modal = document.getElementById('modal-container');
        if (modal) {
          const rect = modal.getBoundingClientRect();
          const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
          if (newWidth > 20 && newWidth < 70) setProblemWidth(newWidth);
        }
      }
      if (isResizingVertical) {
        const panel = document.getElementById('right-panel');
        if (panel) {
          const rect = panel.getBoundingClientRect();
          const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
          if (newHeight > 15 && newHeight < 85) setQueryHeight(newHeight);
        }
      }
    };
    const handleMouseUp = () => { setIsResizingHorizontal(false); setIsResizingVertical(false); };
    if (isResizingHorizontal || isResizingVertical) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingHorizontal, isResizingVertical]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e27] text-gray-900 dark:text-white transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-0">
        <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 hover:border-indigo-500 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Home</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Practice <span className="text-indigo-600 dark:text-indigo-400">SQL</span> like an <br className="hidden sm:block" />
            <span className="text-indigo-600 dark:text-indigo-400">Interview.</span>
          </h1>
          
          <div className="flex flex-col items-center gap-4 sm:gap-6 mt-6 sm:mt-10">
            {/* VIEW MODE TOGGLE */}
            <div className="flex flex-wrap sm:flex-nowrap justify-center p-1.5 bg-gray-200 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-800 w-full max-w-md sm:w-fit sm:max-w-none">
              <button
                onClick={() => setViewMode("practice")}
                className={`flex-1 sm:flex-none justify-center whitespace-nowrap flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  viewMode === "practice" 
                  ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-lg" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4" /> Practice
              </button>
              <button
                onClick={() => setViewMode("solved")}
                className={`flex-1 sm:flex-none justify-center whitespace-nowrap flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  viewMode === "solved" 
                  ? "bg-white dark:bg-green-600 text-green-600 dark:text-white shadow-lg" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> Solved ({solvedIds.length})
              </button>
              <button
                onClick={() => setViewMode("locked")}
                className={`flex-1 sm:flex-none justify-center whitespace-nowrap flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  viewMode === "locked" 
                  ? "bg-white dark:bg-orange-600 text-orange-600 dark:text-white shadow-lg" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> Locked ({failedIds.length})
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-2 w-full">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 rounded-xl px-3 sm:px-4 py-2">
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                <span className="text-xs sm:text-sm font-bold">Filter:</span>
              </div>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-indigo-500'
                  }`}
                >
                  {diff}
                </button>
              ))}
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 cursor-pointer outline-none focus:border-indigo-500 max-w-[150px] sm:max-w-none"
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>{topic === "All" ? "All Topics" : topic}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="space-y-8">
          {Object.entries(filteredGroupedQuestions).map(([topic, questions]) => (
            <div key={topic} className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <h2 className="text-xl font-bold">{topic}</h2>
                <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs font-bold rounded-full">{questions.length}</span>
              </div>
              <div className="grid gap-3">
                {questions.map((q) => {
                  const isSolved = solvedIds.includes(q.id);
                  const isFailed = failedIds.includes(q.id);
                  
                  return (
                    <motion.div
                      key={q.id}
                      onClick={() => openQuestion(q)}
                      whileHover={{ x: 4 }}
                      className="group cursor-pointer border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-5 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          isSolved 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                            : isFailed 
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-500'
                        }`}>
                          {isSolved ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isFailed ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{q.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{q.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isFailed && (
                          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600">
                            🔒 LOCKED
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                          q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                          q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {Object.keys(filteredGroupedQuestions).length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              {viewMode === "locked" ? (
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              ) : (
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              )}
              <p className="text-xl text-gray-500 font-medium">
                {viewMode === "solved" 
                  ? "You haven't solved any questions in this category yet." 
                  : viewMode === "locked"
                  ? "No locked questions! Keep practicing to maintain your streak."
                  : "All questions in this category have been solved!"}
              </p>
              {viewMode === "practice" && (
                <button onClick={() => setViewMode("solved")} className="mt-4 text-indigo-500 font-bold hover:underline">
                  View Solved Questions →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL & OVERLAYS */}
      <AnimatePresence>
        {selectedQuestion && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={closeQuestion}
          >
            <motion.div 
              id="modal-container"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-7xl h-[90vh] bg-white dark:bg-[#0f1629] rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200 dark:border-gray-800 
                         flex flex-col md:flex-row"
            >
              {/* DESKTOP LAYOUT (md and above) */}
              <div className="hidden md:flex w-full h-full">
                {/* LEFT: Problem & Schema */}
                <div style={{ width: `${problemWidth}%` }} className="border-r-2 border-gray-200 dark:border-gray-800 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0a0e27]">
                  <h2 className="text-3xl font-bold mb-4">{selectedQuestion.title}</h2>
                  <div className="flex gap-2 mb-6">
                     <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-lg text-xs font-bold">{selectedQuestion.topic}</span>
                     <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">{selectedQuestion.difficulty}</span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-lg font-bold text-indigo-500">The Challenge</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedQuestion.description}</p>
                    <h3 className="text-lg font-bold text-indigo-500 mt-8 mb-4">Database Schema</h3>
                    <MacCodeWindow code={selectedQuestion.schema} title="schema.sql" />
                  </div>
                </div>

                {/* HORIZONTAL RESIZE HANDLE */}
                <div className="w-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 cursor-col-resize transition-colors flex items-center justify-center" onMouseDown={() => setIsResizingHorizontal(true)}>
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                {/* RIGHT: IDE & Feedback */}
                <div id="right-panel" className="flex-1 flex flex-col relative bg-white dark:bg-[#0f1629]">
                  <button onClick={closeQuestion} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10 transition-colors">
                    <X className="w-6 h-6" />
                  </button>

                  {/* Top Section: Code Editor */}
                  <div className="p-8 flex flex-col min-h-0" style={{ height: `${feedback ? queryHeight : 100}%` }}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" /> Your Solution
                      {attemptNumber > 1 && !cooldownEnd && (
                        <span className="ml-auto text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-lg font-normal">
                          Attempt {attemptNumber}/3
                        </span>
                      )}
                      {cooldownEnd && (
                        <span className="ml-auto text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-lg font-normal">
                          🔒 Locked
                        </span>
                      )}
                    </h3>
                    <div className={`flex-1 border-2 rounded-2xl overflow-hidden shadow-inner ${cooldownEnd ? 'border-orange-300 dark:border-orange-700 opacity-60' : 'border-gray-200 dark:border-gray-700'}`}>
                      <CodeMirror
                        value={userQuery}
                        height="100%"
                        theme={isDark ? "dark" : "light"}
                        extensions={[sql()]}
                        onChange={(value) => !cooldownEnd && setUserQuery(value)}
                        placeholder={cooldownEnd ? "-- Editor locked during cooldown period..." : "-- Write your SQL query here..."}
                        editable={!cooldownEnd}
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      {cooldownEnd ? (
                        <div className="flex items-center gap-3 bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 px-6 py-3 rounded-xl font-bold">
                          <Clock className="w-5 h-5 animate-pulse" />
                          <span>Retry in: {timeLeft}</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={loading || !userQuery || !user}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit</>}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* VERTICAL RESIZE HANDLE (ONLY SHOWS IF FEEDBACK EXISTS) */}
                  {feedback && (
                    <div 
                      className="h-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 cursor-row-resize transition-colors flex items-center justify-center group" 
                      onMouseDown={() => setIsResizingVertical(true)}
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-white rotate-90" />
                    </div>
                  )}

                  {/* Bottom Section: Feedback Area */}
                  {feedback && (
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0e27]/50 overflow-y-auto p-8" style={{ height: `${100 - queryHeight}%` }}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold">Interviewer's Review</h3>
                      </div>
                      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                        <div className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown>{feedback}</ReactMarkdown>
                        </div>
                        
                        {/* Practice More Button - Shows when user passed and no follow-up */}
                        {showPracticeMoreButton && (
                          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <button
                              onClick={closeQuestion}
                              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all"
                            >
                              <Trophy className="w-5 h-5" />
                              Practice More Questions
                            </button>
                          </div>
                        )}
                        
                        {/* Hint Button - Shows when answer is wrong and text area not shown yet */}
                        {!cooldownEnd && !showFollowUpTextArea && !isCorrect && feedback && (
                          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <button
                              onClick={handleHintRequest}
                              disabled={hintLoading}
                              className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-all"
                            >
                              {hintLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <>
                                  <Brain className="w-5 h-5" />
                                  Get a Hint
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        
                        {/* Follow up Chat Text Area - Shows after correct answer OR after final solution shown */}
                        {!cooldownEnd && showFollowUpTextArea && (
                          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3">
                              {isCorrect ? "Have a question about this problem?" : "Have a question about the solution?"}
                            </h4>
                            <div className="flex flex-col gap-2">
                              <textarea
                                value={followUpResponse}
                                onChange={(e) => setFollowUpResponse(e.target.value)}
                                placeholder={isCorrect ? "Ask anything about this SQL problem..." : "Ask anything about the solution..."}
                                className="w-full min-h-[80px] max-h-[200px] bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all resize-y"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.ctrlKey && !cooldownEnd) {
                                    handleFollowUpSubmit();
                                  }
                                }}
                                disabled={!!cooldownEnd}
                              />
                              <button 
                                onClick={handleFollowUpSubmit}
                                disabled={followUpLoading || !followUpResponse || !!cooldownEnd}
                                className="self-end px-6 py-2 bg-indigo-600 text-white rounded-xl disabled:bg-gray-400 transition-colors font-bold flex items-center gap-2"
                              >
                                {followUpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send</>}
                              </button>
                              <p className="text-xs text-gray-500 dark:text-gray-400 self-end">Ctrl + Enter to send</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Locked Message for Follow-up */}
                        {cooldownEnd && (
                          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-center gap-3 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 px-6 py-4 rounded-xl">
                              <Clock className="w-5 h-5" />
                              <span className="font-medium">Chat locked during cooldown period</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MOBILE LAYOUT (below md) */}
              <div className="flex md:hidden flex-col w-full h-full overflow-y-auto">
                {/* Close Button - Fixed at top */}
                <div className="sticky top-0 z-20 bg-white dark:bg-[#0f1629] border-b-2 border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold truncate flex-1">{selectedQuestion.title}</h2>
                  <button onClick={closeQuestion} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* 1. Question Section */}
                <div className="bg-gray-50 dark:bg-[#0a0e27] p-6">
                  <button
                    onClick={() => setShowProblem(!showProblem)}
                    className="flex items-center justify-between w-full mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-lg font-bold">Question</h3>
                    </div>
                    {showProblem ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  
                  {showProblem && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-lg text-xs font-bold">{selectedQuestion.topic}</span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">{selectedQuestion.difficulty}</span>
                      </div>
                      <div className="prose dark:prose-invert max-w-none">
                        <h4 className="text-sm font-bold text-indigo-500">The Challenge</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedQuestion.description}</p>
                        <h4 className="text-sm font-bold text-indigo-500 mt-4 mb-2">Database Schema</h4>
                        <MacCodeWindow code={selectedQuestion.schema} title="schema.sql" />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Your Solution Section */}
                <div className="bg-white dark:bg-[#0f1629] p-6 border-t-2 border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => setShowEditor(!showEditor)}
                    className="flex items-center justify-between w-full mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-lg font-bold">Your Solution</h3>
                      {attemptNumber > 1 && !cooldownEnd && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-lg font-normal">
                          {attemptNumber}/3
                        </span>
                      )}
                      {cooldownEnd && (
                        <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-lg font-normal">
                          🔒 Locked
                        </span>
                      )}
                    </div>
                    {showEditor ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  
                  {showEditor && (
                    <div className="space-y-4">
                      <div className={`border-2 rounded-2xl overflow-hidden shadow-inner ${cooldownEnd ? 'border-orange-300 dark:border-orange-700 opacity-60' : 'border-gray-200 dark:border-gray-700'}`}>
                        <CodeMirror
                          value={userQuery}
                          height="300px"
                          theme={isDark ? "dark" : "light"}
                          extensions={[sql()]}
                          onChange={(value) => !cooldownEnd && setUserQuery(value)}
                          placeholder={cooldownEnd ? "-- Editor locked during cooldown period..." : "-- Write your SQL query here..."}
                          editable={!cooldownEnd}
                        />
                      </div>
                      
                      {/* Submit Button */}
                      {cooldownEnd ? (
                        <div className="flex items-center justify-center gap-3 bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 px-4 py-3 rounded-xl font-bold text-sm">
                          <Clock className="w-5 h-5 animate-pulse" />
                          <span>Retry in: {timeLeft}</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={loading || !userQuery || !user}
                          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Query</>}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Feedback Section (only shows after submission) */}
                {feedback && (
                  <div className="bg-gray-50 dark:bg-[#0a0e27]/50 p-6 border-t-2 border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => setShowFeedback(!showFeedback)}
                      className="flex items-center justify-between w-full mb-4"
                    >
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-bold">Interviewer's Review</h3>
                      </div>
                      {showFeedback ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {showFeedback && (
                      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
                        <div className="prose dark:prose-invert max-w-none prose-sm">
                          <ReactMarkdown>{feedback}</ReactMarkdown>
                        </div>
                        
                        {/* Practice More Button */}
                        {showPracticeMoreButton && (
                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <button
                              onClick={closeQuestion}
                              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all"
                            >
                              <Trophy className="w-4 h-4" />
                              Practice More
                            </button>
                          </div>
                        )}
                        
                        {/* Hint Button - Shows when answer is wrong and text area not shown yet */}
                        {!cooldownEnd && !showFollowUpTextArea && !isCorrect && feedback && (
                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <button
                              onClick={handleHintRequest}
                              disabled={hintLoading}
                              className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-all"
                            >
                              {hintLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Brain className="w-4 h-4" />
                                  Get a Hint
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        
                        {/* Follow up Chat Text Area - Shows after correct answer OR after final solution shown */}
                        {!cooldownEnd && showFollowUpTextArea && (
                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3">
                              {isCorrect ? "Have a question?" : "Questions about the solution?"}
                            </h4>
                            <div className="flex flex-col gap-2">
                              <textarea
                                value={followUpResponse}
                                onChange={(e) => setFollowUpResponse(e.target.value)}
                                placeholder={isCorrect ? "Ask anything..." : "Ask about the solution..."}
                                className="w-full min-h-[80px] max-h-[150px] bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm resize-y"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.ctrlKey && !cooldownEnd) {
                                    handleFollowUpSubmit();
                                  }
                                }}
                                disabled={!!cooldownEnd}
                              />
                              <button 
                                onClick={handleFollowUpSubmit}
                                disabled={followUpLoading || !followUpResponse || !!cooldownEnd}
                                className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-xl disabled:bg-gray-400 transition-colors font-bold"
                              >
                                {followUpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send</>}
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Locked Message for Follow-up */}
                        {cooldownEnd && (
                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-center gap-3 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 px-4 py-3 rounded-xl text-sm">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">Locked during cooldown</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE WARNING */}
      <AnimatePresence>
        {showMobileWarning && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
            <div className="max-w-xs">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Desktop Recommended</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">Coding challenges are best experienced on a larger screen with a physical keyboard.</p>
              <div className="flex flex-col gap-3">
                <button onClick={async () => { setSelectedQuestion(pendingQuestion); await checkCooldown(pendingQuestion!.id); setShowMobileWarning(false); setPendingQuestion(null); }} className="w-full py-4 bg-indigo-600 rounded-2xl font-bold shadow-lg shadow-indigo-500/20">
                  Continue Anyway
                </button>
                <button onClick={() => setShowMobileWarning(false)} className="w-full py-4 bg-white/10 rounded-2xl font-bold">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { SqlQuestion, sqlQuestions } from "@/data/sql/sqlQuestions";
// import MacCodeWindow from "@/app/component/MacCodeWindow/MacCodeWindow";
// import { X, Play, Loader2, Send, GripVertical, Filter, ChevronDown, ChevronUp, MessageSquare, Brain, Zap, ArrowLeft, CheckCircle2, Trophy, Clock } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import { motion, AnimatePresence } from "framer-motion";
// import CodeMirror from '@uiw/react-codemirror';
// import { sql } from '@codemirror/lang-sql';
// import { useUser } from "@clerk/nextjs";

// export default function SqlPracticePage() {
//   const { user, isLoaded } = useUser();
//   const [selectedQuestion, setSelectedQuestion] = useState<SqlQuestion | null>(null);
//   const [userQuery, setUserQuery] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isDark, setIsDark] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [showMobileWarning, setShowMobileWarning] = useState(false);
//   const [pendingQuestion, setPendingQuestion] = useState<SqlQuestion | null>(null);
  
//   // Cooldown states
//   const [cooldownEnd, setCooldownEnd] = useState<Date | null>(null);
//   const [timeLeft, setTimeLeft] = useState<string>("");
  
//   // Progress states
//   const [solvedIds, setSolvedIds] = useState<number[]>([]);
//   const [failedIds, setFailedIds] = useState<number[]>([]);
//   const [viewMode, setViewMode] = useState<"practice" | "solved" | "locked">("practice");
  
//   // Follow-up conversation states
//   const [followUpResponse, setFollowUpResponse] = useState("");
//   const [followUpLoading, setFollowUpLoading] = useState(false);
//   const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
//   const [initialVerdict, setInitialVerdict] = useState<string | null>(null); // Track if initial query passed
//   const [followUpHeight, setFollowUpHeight] = useState(100); // Height for follow-up input (in pixels)
  
//   // Mobile section visibility
//   const [showProblem, setShowProblem] = useState(true);
//   const [showEditor, setShowEditor] = useState(true);
//   const [showFeedback, setShowFeedback] = useState(true);
  
//   // Filter states
//   const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
//   const [selectedTopic, setSelectedTopic] = useState<string>("All");
  
//   // Resizable widths and heights
//   const [problemWidth, setProblemWidth] = useState(41.666667);
//   const [queryHeight, setQueryHeight] = useState(60);
//   const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
//   const [isResizingVertical, setIsResizingVertical] = useState(false);
//   const [isResizingFollowUp, setIsResizingFollowUp] = useState(false); // For follow-up input resize

//   // Calculate time left for cooldown (IST)
//   useEffect(() => {
//     if (!cooldownEnd) {
//       setTimeLeft("");
//       return;
//     }

//     const updateTimer = () => {
//       // Get current time in IST
//       const nowUTC = new Date();
//       const nowIST = new Date(nowUTC.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      
//       // Get cooldown end time in IST
//       const endIST = new Date(cooldownEnd.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      
//       const diff = endIST.getTime() - nowIST.getTime();

//       if (diff <= 0) {
//         setTimeLeft("");
//         setCooldownEnd(null);
//         return;
//       }

//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//       setTimeLeft(`${hours}h ${minutes}m ${seconds}s (IST)`);
//     };

//     updateTimer();
//     const interval = setInterval(updateTimer, 1000);

//     return () => clearInterval(interval);
//   }, [cooldownEnd]);

//   // Fetch Solved Questions from DB
//   const fetchProgress = useCallback(async () => {
//     if (!user?.id) return;
//     try {
//       const res = await fetch(`/api/user-progress?clerkUserId=${user.id}`);
//       const data = await res.json();
//       if (data.solvedIds) {
//         setSolvedIds(data.solvedIds);
//       }
//       if (data.failedIds) {
//         setFailedIds(data.failedIds);
//       }
//     } catch (err) {
//       console.error("Error fetching progress:", err);
//     }
//   }, [user?.id]);

//   // Check cooldown status for selected question
//   const checkCooldown = useCallback(async (questionId: number) => {
//     if (!user?.id) return;
//     try {
//       const res = await fetch(`/api/check-cooldown?clerkUserId=${user.id}&questionId=${questionId}`);
      
//       if (!res.ok) {
//         console.error("Cooldown check failed:", res.status);
//         setCooldownEnd(null);
//         return;
//       }
      
//       const data = await res.json();
      
//       if (data.cooldownUntil) {
//         setCooldownEnd(new Date(data.cooldownUntil));
//       } else {
//         setCooldownEnd(null);
//       }
//     } catch (err) {
//       console.error("Error checking cooldown:", err);
//       setCooldownEnd(null);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     setMounted(true);
//     if (isLoaded && user) {
//       fetchProgress();
//     }
    
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setIsDark(true);
//     } else if (savedTheme === 'light') {
//       setIsDark(false);
//     } else {
//       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//       setIsDark(prefersDark);
//     }
//   }, [isLoaded, user, fetchProgress]);

//   useEffect(() => {
//     if (mounted) {
//       localStorage.setItem('theme', isDark ? 'dark' : 'light');
//       if (isDark) {
//         document.documentElement.classList.add('dark');
//       } else {
//         document.documentElement.classList.remove('dark');
//       }
//     }
//   }, [isDark, mounted]);

//   // Filter and Group questions
//   const filteredGroupedQuestions = Object.entries(
//     sqlQuestions.reduce((acc, question) => {
//       const topic = question.topic || "Other";
//       if (!acc[topic]) acc[topic] = [];
//       acc[topic].push(question);
//       return acc;
//     }, {} as Record<string, SqlQuestion[]>)
//   ).reduce((acc, [topic, questions]) => {
//     if (selectedTopic !== "All" && topic !== selectedTopic) return acc;

//     const filteredQuestions = questions.filter(q => {
//       const isSolved = solvedIds.includes(q.id);
//       const isFailed = failedIds.includes(q.id);
//       const matchesDifficulty = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      
//       let matchesViewMode = false;
//       if (viewMode === "solved") {
//         matchesViewMode = isSolved;
//       } else if (viewMode === "locked") {
//         matchesViewMode = isFailed;
//       } else {
//         matchesViewMode = !isSolved && !isFailed;
//       }
      
//       return matchesDifficulty && matchesViewMode;
//     });

//     if (filteredQuestions.length > 0) {
//       acc[topic] = filteredQuestions;
//     }
//     return acc;
//   }, {} as Record<string, SqlQuestion[]>);

//   const topics = ["All", ...Array.from(new Set(sqlQuestions.map(q => q.topic))).sort()];
//   const difficulties = ["All", "Easy", "Medium", "Hard"];

//   const openQuestion = async (q: SqlQuestion) => {
//     if (window.innerWidth < 768) {
//       setPendingQuestion(q);
//       setShowMobileWarning(true);
//     } else {
//       setSelectedQuestion(q);
//       setUserQuery("");
//       setFeedback("");
//       setQueryHeight(60);
//       setConversationHistory([]);
//       setFollowUpResponse("");
//       setInitialVerdict(null); // Reset initial verdict
//       setFollowUpHeight(100); // Reset follow-up input height
//       await checkCooldown(q.id);
//       document.body.style.overflow = 'hidden';
//     }
//   };

//   const closeQuestion = () => {
//     setSelectedQuestion(null);
//     setFeedback("");
//     setUserQuery("");
//     setFollowUpResponse("");
//     setConversationHistory([]);
//     setCooldownEnd(null);
//     setTimeLeft("");
//     setInitialVerdict(null); // Reset initial verdict
//     setFollowUpHeight(100); // Reset follow-up input height
//     document.body.style.overflow = 'auto';
//   };

//   const handleSubmit = async () => {
//     if (!userQuery.trim() || cooldownEnd) return;
//     setLoading(true);
//     setFeedback("");
//     setConversationHistory([]);
//     setInitialVerdict(null); // Reset before submission

//     try {
//       const res = await fetch("/api/evaluate-sql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: selectedQuestion?.description,
//           schema: selectedQuestion?.schema,
//           userQuery: userQuery,
//           questionId: selectedQuestion?.id,
//           difficulty: selectedQuestion?.difficulty,
//           topic: selectedTopic === "All" ? selectedQuestion?.topic : selectedTopic,
//           clerkUserId: user?.id,
//         }),
//       });
//       const data = await res.json();
      
//       // Track initial verdict
//       if (data.initialVerdict) {
//         setInitialVerdict(data.initialVerdict);
//       }
      
//       // Check if cooldown was set and lock immediately
//       if (data.cooldown && data.cooldownUntil) {
//         setCooldownEnd(new Date(data.cooldownUntil));
//       }
      
//       setFeedback(data.feedback);
      
//       if (data.feedback.toUpperCase().includes("PASS")) {
//         fetchProgress();
//       }

//       setConversationHistory([{ role: "assistant", content: data.feedback }]);
//       if (window.innerWidth < 768) setShowFeedback(true);
//     } catch (err) {
//       setFeedback("Error connecting to the interviewer.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFollowUpSubmit = async () => {
//     if (!followUpResponse.trim() || cooldownEnd) return;
//     setFollowUpLoading(true);
//     try {
//       const updatedHistory = [...conversationHistory, { role: "user", content: followUpResponse }];
//       const res = await fetch("/api/evaluate-sql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: selectedQuestion?.description,
//           schema: selectedQuestion?.schema,
//           userQuery: userQuery,
//           followUp: true,
//           conversationHistory: updatedHistory,
//           userResponse: followUpResponse,
//           questionId: selectedQuestion?.id,
//           difficulty: selectedQuestion?.difficulty,
//           topic: selectedTopic === "All" ? selectedQuestion?.topic : selectedTopic,
//           clerkUserId: user?.id,
//           initialVerdict: initialVerdict, // Pass the initial verdict
//         }),
//       });
//       const data = await res.json();
      
//       // CRITICAL: Check if cooldown was set from follow-up and lock IMMEDIATELY
//       if (data.cooldown && data.cooldownUntil) {
//         setCooldownEnd(new Date(data.cooldownUntil));
//       }
      
//       setConversationHistory([...updatedHistory, { role: "assistant", content: data.feedback }]);
//       setFeedback(data.feedback);
//       setFollowUpResponse("");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setFollowUpLoading(false);
//     }
//   };

//   // RESIZING LOGIC
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isResizingHorizontal) {
//         const modal = document.getElementById('modal-container');
//         if (modal) {
//           const rect = modal.getBoundingClientRect();
//           const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
//           if (newWidth > 20 && newWidth < 70) setProblemWidth(newWidth);
//         }
//       }
//       if (isResizingVertical) {
//         const panel = document.getElementById('right-panel');
//         if (panel) {
//           const rect = panel.getBoundingClientRect();
//           const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
//           if (newHeight > 15 && newHeight < 85) setQueryHeight(newHeight);
//         }
//       }
//       if (isResizingFollowUp) {
//         const followUpContainer = document.getElementById('follow-up-container');
//         if (followUpContainer) {
//           const rect = followUpContainer.getBoundingClientRect();
//           const newHeight = e.clientY - rect.top;
//           if (newHeight > 50 && newHeight < 400) setFollowUpHeight(newHeight);
//         }
//       }
//     };
//     const handleMouseUp = () => { 
//       setIsResizingHorizontal(false); 
//       setIsResizingVertical(false); 
//       setIsResizingFollowUp(false);
//     };
//     if (isResizingHorizontal || isResizingVertical || isResizingFollowUp) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     }
//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isResizingHorizontal, isResizingVertical, isResizingFollowUp]);

//   if (!mounted) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e27] text-gray-900 dark:text-white transition-colors duration-300">
//       {/* HEADER SECTION */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-0">
//         <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 hover:border-indigo-500 transition-all group">
//           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//           <span className="font-semibold text-sm">Back to Home</span>
//         </a>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className="text-3xl sm:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
//             Practice <span className="text-indigo-600 dark:text-indigo-400">SQL</span> like an <br className="hidden sm:block" />
//             <span className="text-indigo-600 dark:text-indigo-400">Interview.</span>
//           </h1>
          
//           <div className="flex flex-col items-center gap-4 sm:gap-6 mt-6 sm:mt-10">
//             {/* VIEW MODE TOGGLE */}
//             <div className="flex flex-wrap sm:flex-nowrap justify-center p-1.5 bg-gray-200 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-800 w-full max-w-md sm:w-fit sm:max-w-none">
//               <button
//                 onClick={() => setViewMode("practice")}
//                 className={`flex-1 sm:flex-none justify-center whitespace-nowrap flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
//                   viewMode === "practice" 
//                   ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-lg" 
//                   : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//                 }`}
//               >
//                 <Play className="w-3 h-3 sm:w-4 sm:h-4" /> Practice
//               </button>
//               <button
//                 onClick={() => setViewMode("solved")}
//                 className={`flex-1 sm:flex-none justify-center whitespace-nowrap flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
//                   viewMode === "solved" 
//                   ? "bg-white dark:bg-green-600 text-green-600 dark:text-white shadow-lg" 
//                   : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//                 }`}
//               >
//                 <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> Solved ({solvedIds.length})
//               </button>
//               <button
//                 onClick={() => setViewMode("locked")}
//                 className={`flex-1 sm:flex-none justify-center whitespace-nowrap flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
//                   viewMode === "locked" 
//                   ? "bg-white dark:bg-orange-600 text-orange-600 dark:text-white shadow-lg" 
//                   : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//                 }`}
//               >
//                 <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> Locked ({failedIds.length})
//               </button>
//             </div>

//             {/* FILTERS */}
//             <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-2 w-full">
//               <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 rounded-xl px-3 sm:px-4 py-2">
//                 <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
//                 <span className="text-xs sm:text-sm font-bold">Filter:</span>
//               </div>
//               {difficulties.map((diff) => (
//                 <button
//                   key={diff}
//                   onClick={() => setSelectedDifficulty(diff)}
//                   className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
//                     selectedDifficulty === diff
//                       ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
//                       : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-indigo-500'
//                   }`}
//                 >
//                   {diff}
//                 </button>
//               ))}
//               <select
//                 value={selectedTopic}
//                 onChange={(e) => setSelectedTopic(e.target.value)}
//                 className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 cursor-pointer outline-none focus:border-indigo-500 max-w-[150px] sm:max-w-none"
//               >
//                 {topics.map((topic) => (
//                   <option key={topic} value={topic}>{topic === "All" ? "All Topics" : topic}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* QUESTIONS LIST */}
//         <div className="space-y-8">
//           {Object.entries(filteredGroupedQuestions).map(([topic, questions]) => (
//             <div key={topic} className="space-y-4">
//               <div className="flex items-center gap-3 px-2">
//                 <h2 className="text-xl font-bold">{topic}</h2>
//                 <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs font-bold rounded-full">{questions.length}</span>
//               </div>
//               <div className="grid gap-3">
//                 {questions.map((q) => {
//                   const isSolved = solvedIds.includes(q.id);
//                   const isFailed = failedIds.includes(q.id);
                  
//                   return (
//                     <motion.div
//                       key={q.id}
//                       onClick={() => openQuestion(q)}
//                       whileHover={{ x: 4 }}
//                       className="group cursor-pointer border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-5 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className={`p-3 rounded-xl ${
//                           isSolved 
//                             ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
//                             : isFailed 
//                             ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' 
//                             : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-500'
//                         }`}>
//                           {isSolved ? (
//                             <CheckCircle2 className="w-5 h-5" />
//                           ) : isFailed ? (
//                             <Clock className="w-5 h-5" />
//                           ) : (
//                             <Play className="w-5 h-5" />
//                           )}
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{q.title}</h3>
//                           <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{q.description}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {isFailed && (
//                           <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600">
//                             🔒 LOCKED
//                           </span>
//                         )}
//                         <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
//                           q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
//                           q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
//                         }`}>
//                           {q.difficulty}
//                         </span>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}

//           {Object.keys(filteredGroupedQuestions).length === 0 && (
//             <div className="text-center py-20 bg-white dark:bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
//               {viewMode === "locked" ? (
//                 <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//               ) : (
//                 <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//               )}
//               <p className="text-xl text-gray-500 font-medium">
//                 {viewMode === "solved" 
//                   ? "You haven't solved any questions in this category yet." 
//                   : viewMode === "locked"
//                   ? "No locked questions! Keep practicing to maintain your streak."
//                   : "All questions in this category have been solved!"}
//               </p>
//               {viewMode === "practice" && (
//                 <button onClick={() => setViewMode("solved")} className="mt-4 text-indigo-500 font-bold hover:underline">
//                   View Solved Questions →
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MODAL & OVERLAYS */}
//       <AnimatePresence>
//         {selectedQuestion && (
//           <motion.div 
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
//             onClick={closeQuestion}
//           >
//             <motion.div 
//               id="modal-container"
//               initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full max-w-7xl h-[90vh] bg-white dark:bg-[#0f1629] rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200 dark:border-gray-800 
//                          flex flex-col md:flex-row"
//             >
//               {/* DESKTOP LAYOUT (md and above) */}
//               <div className="hidden md:flex w-full h-full">
//                 {/* LEFT: Problem & Schema */}
//                 <div style={{ width: `${problemWidth}%` }} className="border-r-2 border-gray-200 dark:border-gray-800 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0a0e27]">
//                   <h2 className="text-3xl font-bold mb-4">{selectedQuestion.title}</h2>
//                   <div className="flex gap-2 mb-6">
//                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-lg text-xs font-bold">{selectedQuestion.topic}</span>
//                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">{selectedQuestion.difficulty}</span>
//                   </div>
//                   <div className="prose dark:prose-invert max-w-none">
//                     <h3 className="text-lg font-bold text-indigo-500">The Challenge</h3>
//                     <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedQuestion.description}</p>
//                     <h3 className="text-lg font-bold text-indigo-500 mt-8 mb-4">Database Schema</h3>
//                     <MacCodeWindow code={selectedQuestion.schema} title="schema.sql" />
//                   </div>
//                 </div>

//                 {/* HORIZONTAL RESIZE HANDLE */}
//                 <div className="w-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 cursor-col-resize transition-colors flex items-center justify-center" onMouseDown={() => setIsResizingHorizontal(true)}>
//                   <GripVertical className="w-4 h-4 text-gray-400" />
//                 </div>

//                 {/* RIGHT: IDE & Feedback */}
//                 <div id="right-panel" className="flex-1 flex flex-col relative bg-white dark:bg-[#0f1629]">
//                   <button onClick={closeQuestion} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10 transition-colors">
//                     <X className="w-6 h-6" />
//                   </button>

//                   {/* Top Section: Code Editor */}
//                   <div className="p-8 flex flex-col min-h-0" style={{ height: `${feedback ? queryHeight : 100}%` }}>
//                     <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                       <Zap className="w-5 h-5 text-yellow-500" /> Your Solution
//                       {cooldownEnd && (
//                         <span className="ml-auto text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-lg font-normal">
//                           🔒 Locked
//                         </span>
//                       )}
//                     </h3>
//                     <div className={`flex-1 border-2 rounded-2xl overflow-hidden shadow-inner ${cooldownEnd ? 'border-orange-300 dark:border-orange-700 opacity-60' : 'border-gray-200 dark:border-gray-700'}`}>
//                       <CodeMirror
//                         value={userQuery}
//                         height="100%"
//                         theme={isDark ? "dark" : "light"}
//                         extensions={[sql()]}
//                         onChange={(value) => !cooldownEnd && setUserQuery(value)}
//                         placeholder={cooldownEnd ? "-- Editor locked during cooldown period..." : "-- Write your SQL query here..."}
//                         editable={!cooldownEnd}
//                       />
//                     </div>
//                     <div className="mt-4 flex justify-end">
//                       {cooldownEnd ? (
//                         <div className="flex items-center gap-3 bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 px-6 py-3 rounded-xl font-bold">
//                           <Clock className="w-5 h-5 animate-pulse" />
//                           <span>Retry in: {timeLeft}</span>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={handleSubmit}
//                           disabled={loading || !userQuery || !user}
//                           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
//                         >
//                           {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit</>}
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* VERTICAL RESIZE HANDLE (ONLY SHOWS IF FEEDBACK EXISTS) */}
//                   {feedback && (
//                     <div 
//                       className="h-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 cursor-row-resize transition-colors flex items-center justify-center group" 
//                       onMouseDown={() => setIsResizingVertical(true)}
//                     >
//                       <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-white rotate-90" />
//                     </div>
//                   )}

//                   {/* Bottom Section: Feedback Area */}
//                   {feedback && (
//                     <div className="flex-1 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0e27]/50 overflow-y-auto p-8" style={{ height: `${100 - queryHeight}%` }}>
//                       <div className="flex items-center gap-3 mb-6">
//                         <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30">
//                           <Brain className="w-6 h-6 text-white" />
//                         </div>
//                         <h3 className="text-xl font-bold">Interviewer's Review</h3>
//                       </div>
//                       <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
//                         <div className="prose dark:prose-invert max-w-none">
//                           <ReactMarkdown>{feedback}</ReactMarkdown>
//                         </div>
                        
//                         {/* Follow up Chat - DISABLED WHEN LOCKED */}
//                         {!cooldownEnd && (
//                           <div id="follow-up-container" className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 relative">
//                             {/* Resize Handle for Follow-up Input */}
//                             <div 
//                               className="absolute -top-3 left-0 right-0 h-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 cursor-row-resize transition-colors flex items-center justify-center group" 
//                               onMouseDown={() => setIsResizingFollowUp(true)}
//                             >
//                               <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-white rotate-90" />
//                             </div>
                            
//                             <div className="flex gap-2 items-end">
//                               <textarea
//                                 value={followUpResponse}
//                                 onChange={(e) => setFollowUpResponse(e.target.value)}
//                                 placeholder="Ask a follow-up or try a hint..."
//                                 style={{ height: `${followUpHeight}px`, minHeight: '50px' }}
//                                 className="flex-1 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all resize-y"
//                                 onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && !cooldownEnd && handleFollowUpSubmit()}
//                                 disabled={!!cooldownEnd}
//                               />
//                               <button 
//                                 onClick={handleFollowUpSubmit}
//                                 disabled={followUpLoading || !followUpResponse || !!cooldownEnd}
//                                 className="p-3 bg-indigo-600 text-white rounded-xl disabled:bg-gray-400 transition-colors flex-shrink-0"
//                               >
//                                 {followUpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//                               </button>
//                             </div>
//                             <p className="text-xs text-gray-400 mt-2">Press Ctrl+Enter to send</p>
//                           </div>
//                         )}
                        
//                         {/* Locked Message for Follow-up */}
//                         {cooldownEnd && (
//                           <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
//                             <div className="flex items-center justify-center gap-3 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 px-6 py-4 rounded-xl">
//                               <Clock className="w-5 h-5" />
//                               <span className="font-medium">Follow-up chat locked during cooldown period</span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* MOBILE LAYOUT (below md) */}
//               <div className="flex md:hidden flex-col w-full h-full overflow-y-auto">
//                 {/* Close Button - Fixed at top */}
//                 <div className="sticky top-0 z-20 bg-white dark:bg-[#0f1629] border-b-2 border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
//                   <h2 className="text-xl font-bold truncate flex-1">{selectedQuestion.title}</h2>
//                   <button onClick={closeQuestion} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0">
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>

//                 {/* 1. Question Section */}
//                 <div className="bg-gray-50 dark:bg-[#0a0e27] p-6">
//                   <button
//                     onClick={() => setShowProblem(!showProblem)}
//                     className="flex items-center justify-between w-full mb-4"
//                   >
//                     <div className="flex items-center gap-2">
//                       <MessageSquare className="w-5 h-5 text-indigo-500" />
//                       <h3 className="text-lg font-bold">Question</h3>
//                     </div>
//                     {showProblem ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                   </button>
                  
//                   {showProblem && (
//                     <div className="space-y-4">
//                       <div className="flex gap-2">
//                         <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-lg text-xs font-bold">{selectedQuestion.topic}</span>
//                         <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">{selectedQuestion.difficulty}</span>
//                       </div>
//                       <div className="prose dark:prose-invert max-w-none">
//                         <h4 className="text-sm font-bold text-indigo-500">The Challenge</h4>
//                         <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedQuestion.description}</p>
//                         <h4 className="text-sm font-bold text-indigo-500 mt-4 mb-2">Database Schema</h4>
//                         <MacCodeWindow code={selectedQuestion.schema} title="schema.sql" />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* 2. Your Solution Section */}
//                 <div className="bg-white dark:bg-[#0f1629] p-6 border-t-2 border-gray-200 dark:border-gray-800">
//                   <button
//                     onClick={() => setShowEditor(!showEditor)}
//                     className="flex items-center justify-between w-full mb-4"
//                   >
//                     <div className="flex items-center gap-2">
//                       <Zap className="w-5 h-5 text-yellow-500" />
//                       <h3 className="text-lg font-bold">Your Solution</h3>
//                       {cooldownEnd && (
//                         <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-lg font-normal">
//                           🔒 Locked
//                         </span>
//                       )}
//                     </div>
//                     {showEditor ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                   </button>
                  
//                   {showEditor && (
//                     <div className="space-y-4">
//                       <div className={`border-2 rounded-2xl overflow-hidden shadow-inner ${cooldownEnd ? 'border-orange-300 dark:border-orange-700 opacity-60' : 'border-gray-200 dark:border-gray-700'}`}>
//                         <CodeMirror
//                           value={userQuery}
//                           height="300px"
//                           theme={isDark ? "dark" : "light"}
//                           extensions={[sql()]}
//                           onChange={(value) => !cooldownEnd && setUserQuery(value)}
//                           placeholder={cooldownEnd ? "-- Editor locked during cooldown period..." : "-- Write your SQL query here..."}
//                           editable={!cooldownEnd}
//                         />
//                       </div>
                      
//                       {/* Submit Button */}
//                       {cooldownEnd ? (
//                         <div className="flex items-center justify-center gap-3 bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 px-4 py-3 rounded-xl font-bold text-sm">
//                           <Clock className="w-5 h-5 animate-pulse" />
//                           <span>Retry in: {timeLeft}</span>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={handleSubmit}
//                           disabled={loading || !userQuery || !user}
//                           className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
//                         >
//                           {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Query</>}
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* 3. Feedback Section (only shows after submission) */}
//                 {feedback && (
//                   <div className="bg-gray-50 dark:bg-[#0a0e27]/50 p-6 border-t-2 border-gray-200 dark:border-gray-800">
//                     <button
//                       onClick={() => setShowFeedback(!showFeedback)}
//                       className="flex items-center justify-between w-full mb-4"
//                     >
//                       <div className="flex items-center gap-2">
//                         <Brain className="w-5 h-5 text-indigo-500" />
//                         <h3 className="text-lg font-bold">Interviewer's Review</h3>
//                       </div>
//                       {showFeedback ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                     </button>
                    
//                     {showFeedback && (
//                       <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
//                         <div className="prose dark:prose-invert max-w-none prose-sm">
//                           <ReactMarkdown>{feedback}</ReactMarkdown>
//                         </div>
                        
//                         {/* Follow up Chat - DISABLED WHEN LOCKED */}
//                         {!cooldownEnd && (
//                           <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
//                             <div className="flex flex-col gap-2">
//                               <textarea
//                                 value={followUpResponse}
//                                 onChange={(e) => setFollowUpResponse(e.target.value)}
//                                 placeholder="Ask a follow-up or try a hint..."
//                                 rows={3}
//                                 className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm resize-y"
//                                 onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && !cooldownEnd && handleFollowUpSubmit()}
//                                 disabled={!!cooldownEnd}
//                               />
//                               <button 
//                                 onClick={handleFollowUpSubmit}
//                                 disabled={followUpLoading || !followUpResponse || !!cooldownEnd}
//                                 className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-xl disabled:bg-gray-400 transition-colors font-bold"
//                               >
//                                 {followUpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send</>}
//                               </button>
//                               <p className="text-xs text-gray-400 text-center">Press Ctrl+Enter to send</p>
//                             </div>
//                           </div>
//                         )}
                        
//                         {/* Locked Message for Follow-up */}
//                         {cooldownEnd && (
//                           <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
//                             <div className="flex items-center justify-center gap-3 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 px-4 py-3 rounded-xl text-sm">
//                               <Clock className="w-4 h-4" />
//                               <span className="font-medium">Follow-up locked during cooldown</span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* MOBILE WARNING */}
//       <AnimatePresence>
//         {showMobileWarning && (
//           <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
//             <div className="max-w-xs">
//               <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
//                 <Zap className="w-10 h-10 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold mb-4">Desktop Recommended</h2>
//               <p className="text-gray-400 mb-8 leading-relaxed">Coding challenges are best experienced on a larger screen with a physical keyboard.</p>
//               <div className="flex flex-col gap-3">
//                 <button onClick={async () => { setSelectedQuestion(pendingQuestion); await checkCooldown(pendingQuestion!.id); setShowMobileWarning(false); setPendingQuestion(null); }} className="w-full py-4 bg-indigo-600 rounded-2xl font-bold shadow-lg shadow-indigo-500/20">
//                   Continue Anyway
//                 </button>
//                 <button onClick={() => setShowMobileWarning(false)} className="w-full py-4 bg-white/10 rounded-2xl font-bold">
//                   Go Back
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }