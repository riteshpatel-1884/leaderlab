'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Target, TrendingUp, Clock, CheckCircle2, Zap, ArrowRight, Plus, Edit2, Trash2, Check, X, Trophy, Sparkles } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
  progress?: number;
  isCarryOver?: boolean;
  completed?: boolean;
  completedDate?: string;
}

// --- SUB-COMPONENTS MOVED OUTSIDE TO FIX FOCUS ISSUE ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const CompletionModal = ({ isOpen, title, onClose }: { isOpen: boolean; title: string; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl transform animate-scaleIn relative">
        <div className="mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="absolute top-12 left-1/4">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-ping" />
          </div>
          <div className="absolute top-16 right-1/4">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-ping" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">🎉 Congratulations! 🎉</h2>
        <p className="text-blue-100 text-lg mb-2">You've completed:</p>
        <p className="text-white text-xl font-semibold mb-6">"{title}"</p>
        <p className="text-blue-50 text-sm">Keep crushing your goals! You're doing amazing! 💪✨</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const WarningModal = ({ 
  isOpen, 
  currentProgress, 
  onClose 
}: { 
  isOpen: boolean; 
  currentProgress: number; 
  onClose: () => void 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl transform animate-scaleIn">
        <div className="mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">⚠️ Not Ready Yet!</h2>
        <p className="text-orange-100 text-lg mb-4">
          Please complete 100% progress first before marking this goal as done.
        </p>
        
        <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">Current Progress:</span>
            <span className="text-white text-2xl font-bold">{currentProgress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 mb-3">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-orange-100 text-sm">
            <span>Remaining:</span>
            <span className="font-semibold">{100 - currentProgress}%</span>
          </div>
        </div>

        <p className="text-white text-sm mb-6">
          💡 Tip: Click the <span className="font-bold">Edit</span> button to update your progress!
        </p>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ 
  isOpen, 
  goalTitle,
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean; 
  goalTitle: string;
  onConfirm: () => void; 
  onCancel: () => void 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl transform animate-scaleIn">
        <div className="mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Delete Goal?</h2>
        <p className="text-red-100 text-lg mb-2">
          Are you sure you want to delete:
        </p>
        <p className="text-white text-xl font-semibold mb-6 bg-white/10 p-3 rounded-lg">
          "{goalTitle}"
        </p>
        <p className="text-red-100 text-sm mb-6">
          ⚠️ This action cannot be undone!
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const UndoConfirmModal = ({ 
  isOpen, 
  goalTitle,
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean; 
  goalTitle: string;
  onConfirm: () => void; 
  onCancel: () => void 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl transform animate-scaleIn">
        <div className="mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-10 h-10 text-white transform rotate-180" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Move Back to Active?</h2>
        <p className="text-yellow-100 text-lg mb-2">
          Move this goal back to active goals:
        </p>
        <p className="text-white text-xl font-semibold mb-6 bg-white/10 p-3 rounded-lg">
          "{goalTitle}"
        </p>
        <p className="text-yellow-100 text-sm mb-6">
          💡 You can complete it again later!
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-white text-yellow-600 rounded-lg font-semibold hover:bg-yellow-50 transition-colors"
          >
            Move Back
          </button>
        </div>
      </div>
    </div>
  );
};

const GoalForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  isEdit = false 
}: { 
  formData: Goal; 
  setFormData: React.Dispatch<React.SetStateAction<Goal>>;
  onSubmit: (e: React.FormEvent) => void; 
  onCancel: () => void;
  isEdit?: boolean;
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Goal Title *</label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
        placeholder="Enter your goal title"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
        placeholder="Describe your goal in detail"
        rows={4}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="Learning">📚 Learning</option>
          <option value="Project">💻 Project</option>
          <option value="Personal">🎯 Personal</option>
          <option value="Development">⚡ Development</option>
          <option value="Career">🚀 Career</option>
          <option value="Entrepreneurship">💼 Entrepreneurship</option>
          <option value="Health">💪 Health</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Progress (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={formData.progress}
          onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="0-100"
        />
      </div>
    </div>

    <div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isCarryOver}
          onChange={(e) => setFormData({ ...formData, isCarryOver: e.target.checked })}
          className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
        />
        <span className="text-sm text-gray-300">This is a carryover goal from 2025</span>
      </label>
    </div>

    <div className="flex gap-3 pt-4">
      <button
        type="submit"
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Check className="w-5 h-5" />
        {isEdit ? 'Update Goal' : 'Add Goal'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Cancel
      </button>
    </div>
  </form>
);

// --- MAIN COMPONENT ---

const GoalsTracker2026 = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'carryover' | 'new' | 'completed'>('all');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUndoModal, setShowUndoModal] = useState(false);
  const [warningProgress, setWarningProgress] = useState(0);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [undoingGoal, setUndoingGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [completedGoalTitle, setCompletedGoalTitle] = useState('');

  const [formData, setFormData] = useState<Goal>({
    id: '', title: '', description: '', category: 'Learning', priority: 'medium', deadline: '', progress: 0, isCarryOver: false, completed: false
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals2026');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    if (goals.length > 0) localStorage.setItem('goals2026', JSON.stringify(goals));
  }, [goals]);

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const carryOverGoals = activeGoals.filter(g => g.isCarryOver);
  const newGoals2026 = activeGoals.filter(g => !g.isCarryOver);

  const filteredGoals = 
    activeTab === 'all' ? activeGoals :
    activeTab === 'carryover' ? carryOverGoals :
    activeTab === 'new' ? newGoals2026 :
    completedGoals;

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setGoals([...goals, { ...formData, id: Date.now().toString(), completed: false }]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !editingGoal) return;
    setGoals(goals.map(g => g.id === editingGoal.id ? { ...formData, id: editingGoal.id } : g));
    setShowEditModal(false);
    setEditingGoal(null);
    resetForm();
  };

  const handleDeleteGoal = (goal: Goal) => {
    setDeletingGoal(goal);
    setShowDeleteModal(true);
  };

  const confirmDeleteGoal = () => {
    if (deletingGoal) {
      setGoals(goals.filter(g => g.id !== deletingGoal.id));
      setShowDeleteModal(false);
      setDeletingGoal(null);
    }
  };

  const handleMarkComplete = (goal: Goal) => {
    // Check if progress is 100%
    if (goal.progress !== undefined && goal.progress < 100) {
      setWarningProgress(goal.progress);
      setShowWarningModal(true);
      return;
    }

    setGoals(goals.map(g => g.id === goal.id ? { ...g, completed: true, completedDate: new Date().toISOString(), progress: 100 } : g));
    setCompletedGoalTitle(goal.title);
    setShowCompletionModal(true);
    setTimeout(() => setShowCompletionModal(false), 5000);
  };

  const handleMarkIncomplete = (goal: Goal) => {
    setUndoingGoal(goal);
    setShowUndoModal(true);
  };

  const confirmUndoGoal = () => {
    if (undoingGoal) {
      setGoals(goals.map(g => g.id === undoingGoal.id ? { ...g, completed: false, completedDate: undefined } : g));
      setShowUndoModal(false);
      setUndoingGoal(null);
    }
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({ ...goal });
    setShowEditModal(true);
  };

  const resetForm = () => setFormData({
    id: '', title: '', description: '', category: 'Learning', priority: 'medium', deadline: '', progress: 0, isCarryOver: false, completed: false
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'learning': return '📚';
      case 'project': return '💻';
      case 'personal': return '🎯';
      case 'development': return '⚡';
      case 'career': return '🚀';
      case 'entrepreneurship': return '💼';
      case 'health': return '💪';
      default: return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 scrollbar-hide overflow-x-hidden">
        {/* Global Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
      `}</style>

      <div className="max-w-7xl pt-24 mx-auto">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">2026 <span className="text-blue-500">Goals Tracker</span></h1>
                <p className="text-gray-400 mt-2">Track your journey from 2025 to 2026 and beyond</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 w-fit"
            >
              <Plus className="w-5 h-5" /> Add New Goal
            </button>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <TrendingUp className="w-5 h-5 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-blue-500">{activeGoals.length}</div>
              <p className="text-gray-400 text-sm">Active Goals</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <Clock className="w-5 h-5 text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-yellow-500">{carryOverGoals.length}</div>
              <p className="text-gray-400 text-sm">From 2025</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <Zap className="w-5 h-5 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-green-500">{newGoals2026.length}</div>
              <p className="text-gray-400 text-sm">New for 2026</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <CheckCircle2 className="w-5 h-5 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-purple-400">{completedGoals.length}</div>
              <p className="text-gray-400 text-sm">Completed</p>
            </div>
          </div>

         
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {['all', 'carryover', 'new', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all capitalize ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800'
              }`}
            >
              {tab === 'carryover' ? '2025 Carryover' : tab === 'new' ? 'New 2026' : tab} 
              {tab !== 'all' && ` (${
                tab === 'carryover' ? carryOverGoals.length :
                tab === 'new' ? newGoals2026.length :
                completedGoals.length
              })`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <div key={goal.id} className={`bg-gradient-to-br from-gray-900 to-gray-800 border rounded-xl p-6 group transition-all ${
              goal.progress === 100 && !goal.completed 
                ? 'border-green-500/50 shadow-lg shadow-green-500/10' 
                : 'border-gray-800'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">{goal.title}</h3>
                    <p className="text-sm text-gray-500">{goal.category}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {goal.isCarryOver && !goal.completed && (
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      2025
                    </span>
                  )}
                  {goal.completed && (
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/30 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Done
                    </span>
                  )}
                  {goal.progress === 100 && !goal.completed && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/50 flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      Ready!
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">{goal.description}</p>
              
              {/* Progress Bar */}
              {goal.progress !== undefined && goal.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-blue-400">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Completed Date */}
              {goal.completed && goal.completedDate && (
                <div className="mb-4 flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed on {new Date(goal.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(goal.priority)}`}>
                    {goal.priority.toUpperCase()}
                  </span>
                  {goal.deadline && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Calendar className="w-4 h-4" />
                      {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {!goal.completed ? (
                    <>
                      <button 
                        onClick={() => handleMarkComplete(goal)} 
                        className={`p-2 rounded-lg transition-all ${
                          goal.progress !== undefined && goal.progress < 100
                            ? 'text-gray-500 bg-gray-800/50 cursor-not-allowed opacity-50'
                            : 'text-green-400 hover:bg-green-500/10 hover:scale-110'
                        }`}
                        title={
                          goal.progress !== undefined && goal.progress < 100
                            ? `Cannot complete yet! Progress: ${goal.progress}% - Need 100%`
                            : 'Mark as complete ✓'
                        }
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openEditModal(goal)} 
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit goal"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleMarkIncomplete(goal)} 
                      className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center gap-2"
                      title="Move back to active goals"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      Undo
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteGoal(goal)} 
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGoals.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No goals found</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'completed' 
                ? "You haven't completed any goals yet. Keep pushing!" 
                : "Start by adding your first goal for 2026"}
            </p>
            {activeTab !== 'completed' && (
              <button
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Goal
              </button>
            )}
          </div>
        )}

        {/* Motivational Footer */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            🎯 New Year, New Achievements!
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            "The secret of getting ahead is getting started. Let's make 2026 the year we turn our goals into achievements!"
          </p>
        </div>
      </div>

      {/* Modals are now calling the external components */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Goal">
        <GoalForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleAddGoal} 
            onCancel={() => setShowAddModal(false)} 
        />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Goal">
        <GoalForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleEditGoal} 
            onCancel={() => setShowEditModal(false)} 
            isEdit 
        />
      </Modal>

      <CompletionModal 
        isOpen={showCompletionModal} 
        title={completedGoalTitle} 
        onClose={() => setShowCompletionModal(false)} 
      />

      <WarningModal 
        isOpen={showWarningModal} 
        currentProgress={warningProgress} 
        onClose={() => setShowWarningModal(false)} 
      />

      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        goalTitle={deletingGoal?.title || ''} 
        onConfirm={confirmDeleteGoal} 
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletingGoal(null);
        }} 
      />

      <UndoConfirmModal 
        isOpen={showUndoModal} 
        goalTitle={undoingGoal?.title || ''} 
        onConfirm={confirmUndoGoal} 
        onCancel={() => {
          setShowUndoModal(false);
          setUndoingGoal(null);
        }} 
      />
    </div>
  );
};

export default GoalsTracker2026;