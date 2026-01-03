'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle, Trophy, Book, Award, X, TrendingUp, Briefcase, Calendar, BarChart3 } from 'lucide-react';
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
  totalPoints: number;
  subjectPoints: number;
  dsaPoints: number;
  osPoints: number;
  cnPoints: number;
  dbmsPoints: number;
  hrPoints: number;
  oopsPoints: number;
}

interface Question {
  id: string;
  category: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  description: string;
  frequency: number;
  companies: string[];
  answer: string;
}

// Points calculation helper
const getPointsForDifficulty = (difficulty: string): number => {
  const pointsMap: Record<string, number> = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  };
  return pointsMap[difficulty] || 0;
};

export default function QuestionsPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
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
        setSelectedQuestion(null);
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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 pt-20 bg-gradient-to-b from-[#0f0f1a] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Practice Arena
              </h1>
              <p className="text-gray-400 text-base">Master core subjects and earn points</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl px-6 py-3">
              <div className="flex items-center gap-3">
                <Award className="w-7 h-7 text-purple-400" />
                <div>
                  <p className="text-gray-400 text-xs">Subject Points</p>
                  <p className="text-2xl font-semibold text-purple-400">{userPoints?.subjectPoints || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Grid */}
          {!selectedSubject && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {subjects.map((subject) => {
                const progress = getSubjectProgress(subject.id);
                const points = getSubjectPoints(subject.id);
                
                return (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className="group relative bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-5 text-left overflow-hidden hover:border-gray-700/50 transition-all"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">{subject.icon}</div>
                        <div className="text-right">
                          <p className="text-xl font-semibold text-white">{points}</p>
                          <p className="text-xs text-gray-500">points</p>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium text-white mb-2">{subject.name}</h3>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <Book className="w-4 h-4" />
                        <span>{progress.solved} / {progress.total} completed</span>
                      </div>
                      
                      <div className="w-full bg-gray-800/50 rounded-full h-1.5 mb-1">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 text-right">{progress.percentage}%</p>
                    </div>
                  </button>
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
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
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
                  <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{subject.icon}</div>
                        <div>
                          <h2 className="text-2xl font-semibold text-white mb-1">{subject.name}</h2>
                          <p className="text-gray-400 text-sm">
                            {progress.solved} of {progress.total} completed · {progress.percentage}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {getSubjectPoints(subject.id)}
                        </p>
                        <p className="text-gray-400 text-sm">points</p>
                      </div>
                    </div>

                    <div className="mt-4 w-full bg-gray-800/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Questions by Category */}
                  {Object.entries(questionsByCategory).map(([category, questions]) => (
                    <div key={category} className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <div className={`w-1 h-6 bg-gradient-to-b ${subject.color} rounded-full`} />
                        {category}
                      </h3>

                      <div className="space-y-3">
                        {questions.map((question) => {
                          const isSolved = isQuestionSolved(question.id, subject.id);

                          return (
                            <div
                              key={question.id}
                              onClick={() => setSelectedQuestion(question)}
                              className={`group cursor-pointer bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border rounded-lg p-4 transition-all ${
                                isSolved
                                  ? 'border-green-500/20 bg-green-500/5'
                                  : 'border-gray-800/50 hover:border-gray-700/50'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-4 mb-1">
                                    <h4 className={`text-base font-medium leading-snug ${isSolved ? 'text-green-400' : 'text-white'}`}>
                                      {question.title}
                                    </h4>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-medium border ${getDifficultyColor(
                                          question.difficulty
                                        )}`}
                                      >
                                        {question.difficulty}
                                      </span>
                                      <span className="text-yellow-400 font-medium text-sm">
                                        +{question.points}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-gray-400 text-sm leading-relaxed">{question.description}</p>
                                </div>
                              </div>
                            </div>
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

      {/* Question Detail Modal */}
      <AnimatePresence>
        {selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedQuestion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between p-6 border-b border-gray-800/50">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-semibold text-white mb-2 leading-tight">
                    {selectedQuestion.title}
                  </h2>
                  <p className="text-gray-400 text-sm">{selectedQuestion.description}</p>
                </div>
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
                {/* Question Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#0f0f1a]/50 rounded-lg p-3 border border-gray-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-400">Difficulty</span>
                    </div>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded border inline-block ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                      {selectedQuestion.difficulty}
                    </span>
                  </div>

                  <div className="bg-[#0f0f1a]/50 rounded-lg p-3 border border-gray-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-gray-400">Ask Frequency</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{selectedQuestion.frequency}%</p>
                  </div>

                  <div className="bg-[#0f0f1a]/50 rounded-lg p-3 border border-gray-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-gray-400">Points</span>
                    </div>
                    <p className="text-lg font-semibold text-yellow-400">+{selectedQuestion.points}</p>
                  </div>
                </div>

                {/* Companies */}
                {selectedQuestion.companies && selectedQuestion.companies.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-medium text-gray-300">Asked by Companies</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuestion.companies.map((company, index) => (
                        <span
                          key={`${company}-${index}`}
                          className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium border border-purple-500/20"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Answer Section */}
                <div>
                  <h3 className="text-base font-medium text-gray-300 mb-3">Answer</h3>
                  <div className="bg-[#0f0f1a]/50 rounded-lg p-5 border border-gray-800/30">
                    <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
{selectedQuestion.answer || 'Answer not available for this question.'}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-800/50">
                <button
                  onClick={() => {
                    if (!isQuestionSolved(selectedQuestion.id, selectedSubject!) && !solvingQuestion) {
                      handleSolveQuestion(selectedQuestion.id, selectedSubject!, selectedQuestion.difficulty);
                    }
                  }}
                  disabled={isQuestionSolved(selectedQuestion.id, selectedSubject!) || solvingQuestion === selectedQuestion.id}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    isQuestionSolved(selectedQuestion.id, selectedSubject!)
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                      : solvingQuestion === selectedQuestion.id
                      ? 'bg-gray-700 text-gray-400 cursor-wait'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  {isQuestionSolved(selectedQuestion.id, selectedSubject!)
                    ? '✓ Completed'
                    : solvingQuestion === selectedQuestion.id
                    ? 'Marking...'
                    : 'Mark as Completed'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}