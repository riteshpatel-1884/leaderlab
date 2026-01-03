'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle, Trophy, TrendingUp, Book, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dsaQuestions } from '../data/dsaQuestions';
import { dbmsQuestions } from '../data/dbmsQuestions';
import { hrQuestions } from '../data/hrQuestions';
import { oopsQuestions } from '../data/oopsQuestions';
import { osQuestions } from '../data/osQuestions';
import { cnQuestions } from '../data/cnQuestions';

const subjects = [
  { id: 'DSA', name: 'Data Structures & Algorithms', icon: '💻', color: 'from-blue-500 to-cyan-500', questions: dsaQuestions },
  { id: 'OS', name: 'Operating Systems', icon: '⚙️', color: 'from-purple-500 to-pink-500', questions: osQuestions },
  { id: 'CN', name: 'Computer Networks', icon: '🌐', color: 'from-green-500 to-emerald-500', questions: cnQuestions },
  { id: 'DBMS', name: 'Database Management', icon: '🗄️', color: 'from-orange-500 to-red-500', questions: dbmsQuestions },
  { id: 'HR', name: 'HR Questions', icon: '👥', color: 'from-pink-500 to-rose-500', questions: hrQuestions },
  { id: 'OOPS', name: 'Object Oriented Programming', icon: '🎯', color: 'from-indigo-500 to-purple-500', questions: oopsQuestions },
];

interface SolvedQuestion {
  questionId: string;
  subject: string;
  difficulty: string;
  pointsEarned: number;
}

interface UserPoints {
  totalPoints: number;        // ← Overall points from all activities
  subjectPoints: number;      // ← Points from subject questions only
  dsaPoints: number;
  osPoints: number;
  cnPoints: number;
  dbmsPoints: number;
  hrPoints: number;
  oopsPoints: number;
}

export default function QuestionsPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [solvedQuestions, setSolvedQuestions] = useState<SolvedQuestion[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [solvingQuestion, setSolvingQuestion] = useState<string | null>(null);

  useEffect(() => {
    fetchSolvedQuestions();
  }, []);

  const fetchSolvedQuestions = async () => {
    try {
      const response = await fetch('/api/questions/solved');
      const result = await response.json();
      
      if (result.success) {
        setSolvedQuestions(result.data.solvedQuestions);
        setUserPoints(result.data.userPoints);
      }
    } catch (error) {
      console.error('Error fetching solved questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSolveQuestion = async (questionId: string, subject: string, difficulty: string) => {
    setSolvingQuestion(questionId);
    
    try {
      const response = await fetch('/api/questions/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          subject,
          difficulty,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchSolvedQuestions();
        alert(result.message);
      } else {
        alert(result.error || 'Failed to mark question as solved');
      }
    } catch (error) {
      console.error('Error solving question:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSolvingQuestion(null);
    }
  };

  const isQuestionSolved = (questionId: string, subject: string) => {
    return solvedQuestions.some(
      (q) => q.questionId === questionId && q.subject === subject
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'HARD':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getSubjectPoints = (subjectId: string) => {
    if (!userPoints) return 0;
    const pointsMap: Record<string, keyof UserPoints> = {
      DSA: 'dsaPoints',
      OS: 'osPoints',
      CN: 'cnPoints',
      DBMS: 'dbmsPoints',
      HR: 'hrPoints',
      OOPS: 'oopsPoints',
    };
    return userPoints[pointsMap[subjectId]] || 0;
  };

  const getSubjectProgress = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return { solved: 0, total: 0, percentage: 0 };
    
    const solved = solvedQuestions.filter((q) => q.subject === subjectId).length;
    const total = subject.questions.length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
    
    return { solved, total, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 pt-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Practice Arena
              </h1>
              <p className="text-gray-400 text-lg">Master core subjects and earn points</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Total Points from all activities */}
              {/* <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Total Points</p>
                    <p className="text-3xl font-bold text-yellow-400">{userPoints?.totalPoints || 0}</p>
                  </div>
                </div>
              </div> */}

              {/* Subject Points only */}
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Subject Points</p>
                    <p className="text-3xl font-bold text-purple-400">{userPoints?.subjectPoints || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Grid */}
          {!selectedSubject && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {subjects.map((subject) => {
                const progress = getSubjectProgress(subject.id);
                const points = getSubjectPoints(subject.id);
                
                return (
                  <motion.button
                    key={subject.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSubject(subject.id)}
                    className="group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 text-left overflow-hidden hover:border-gray-600 transition-all"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{subject.icon}</div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{points}</p>
                          <p className="text-xs text-gray-400">points</p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{subject.name}</h3>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <Book className="w-4 h-4" />
                        <span>{progress.solved} / {progress.total} questions</span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 text-right">{progress.percentage}% complete</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      {selectedSubject && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to subjects
          </button>

          {subjects
            .filter((s) => s.id === selectedSubject)
            .map((subject) => {
              const progress = getSubjectProgress(subject.id);
              
              const questionsByCategory: Record<string, any[]> = {};
              subject.questions.forEach((q) => {
                if (!questionsByCategory[q.category]) {
                  questionsByCategory[q.category] = [];
                }
                questionsByCategory[q.category].push(q);
              });

              return (
                <div key={subject.id}>
                  {/* Subject Header */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{subject.icon}</div>
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-1">{subject.name}</h2>
                          <p className="text-gray-400">
                            {progress.solved} of {progress.total} questions solved ({progress.percentage}%)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {getSubjectPoints(subject.id)}
                        </p>
                        <p className="text-gray-400">points earned</p>
                      </div>
                    </div>

                    <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Questions by Category */}
                  {Object.entries(questionsByCategory).map(([category, questions]) => (
                    <div key={category} className="mb-8">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <div className={`w-1 h-8 bg-gradient-to-b ${subject.color} rounded-full`} />
                        {category}
                      </h3>

                      <div className="space-y-3">
                        {questions.map((question) => {
                          const isSolved = isQuestionSolved(question.id, subject.id);
                          const isProcessing = solvingQuestion === question.id;

                          return (
                            <motion.div
                              key={question.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`group bg-gradient-to-br from-gray-900 to-gray-800 border rounded-xl p-5 transition-all ${
                                isSolved
                                  ? 'border-green-500/30 bg-green-500/5'
                                  : 'border-gray-700 hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <button
                                  onClick={() => {
                                    if (!isSolved && !isProcessing) {
                                      handleSolveQuestion(question.id, subject.id, question.difficulty);
                                    }
                                  }}
                                  disabled={isSolved || isProcessing}
                                  className={`mt-1 transition-all ${
                                    isSolved
                                      ? 'text-green-400 cursor-default'
                                      : isProcessing
                                      ? 'text-gray-500 cursor-wait'
                                      : 'text-gray-500 hover:text-blue-400 cursor-pointer'
                                  }`}
                                >
                                  {isSolved ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                  ) : (
                                    <Circle className="w-6 h-6" />
                                  )}
                                </button>

                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <h4 className={`text-lg font-semibold ${isSolved ? 'text-green-400' : 'text-white'}`}>
                                      {question.title}
                                    </h4>
                                    <div className="flex items-center gap-3">
                                      <span
                                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getDifficultyColor(
                                          question.difficulty
                                        )}`}
                                      >
                                        {question.difficulty}
                                      </span>
                                      <span className="text-yellow-400 font-bold text-sm">
                                        +{question.points} pts
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-gray-400 text-sm">{question.description}</p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}