"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Calendar, Trophy, Flame, Plus, X, Save, AlertTriangle } from 'lucide-react';

// Type definitions
interface Task {
  id: string;
  taskText: string;
  isCompleted: boolean;
}

interface TodayTasksData {
  tasks: Task[];
  allCompleted: boolean;
  pointsEarned: number;
  date?: string;
}

const DailyTaskTracker = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  
  // State for points and streak
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0); // This now holds ONLY Commitment Points
  
  const [loading, setLoading] = useState(false);
  const [todayTasksData, setTodayTasksData] = useState<TodayTasksData | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const MAX_TASKS = 3;
  const POINTS_FOR_ALL_COMPLETE = 3;

  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    fetchUserData();
    fetchTodayTasks();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (response.ok) {
        const data = await response.json();
        
        // --- UPDATED LOGIC HERE ---
        // We use 'totalCommitmentPoints' to show ONLY points from Daily Tasks.
        // If the backend hasn't calculated it yet, default to 0.
        setTotalPoints(data.totalCommitmentPoints || 0);
        
        // Set the streak from the DB
        setCurrentStreak(data.currentStreak || 0);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTodayTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/daily-tasks/today');
      if (response.ok) {
        const data: TodayTasksData = await response.json();
        setTodayTasksData(data);
        
        if (data.tasks && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
          const completed = new Set<string>(
            data.tasks.filter((t: Task) => t.isCompleted).map((t: Task) => t.id)
          );
          setCompletedTasks(completed);
        }
      }
    } catch (error) {
      console.error('Error fetching commitment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskText.trim() || tasks.length >= MAX_TASKS) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      taskText: newTaskText.trim(),
      isCompleted: false
    };

    setLoading(true);
    try {
      const response = await fetch('/api/daily-tasks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: [...tasks, newTask],
        }),
      });

      if (response.ok) {
        setTasks([...tasks, newTask]);
        setNewTaskText('');
        setIsAddingTask(false);
      } else {
        alert('Failed to save commitment');
      }
    } catch (error) {
      console.error('Error saving commitment:', error);
      alert('Failed to save commitment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (todayTasksData?.allCompleted) return;
    
    const updatedTasks = tasks.filter((t: Task) => t.id !== taskId);
    
    setLoading(true);
    try {
      const response = await fetch('/api/daily-tasks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: updatedTasks,
        }),
      });

      if (response.ok) {
        setTasks(updatedTasks);
        const newCompleted = new Set(completedTasks);
        newCompleted.delete(taskId);
        setCompletedTasks(newCompleted);
      }
    } catch (error) {
      console.error('Error deleting commitment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = (taskId: string) => {
    if (todayTasksData?.allCompleted) return;
    
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const handleCompleteAttempt = () => {
    if (tasks.length === 0) {
      alert('Please create at least one commitment first!');
      return;
    }

    const allTasksCompleted = tasks.length > 0 && tasks.every((task: Task) => completedTasks.has(task.id));

    if (!allTasksCompleted) {
      alert(`Complete all ${tasks.length} commitment to earn ${POINTS_FOR_ALL_COMPLETE} points!`);
      return;
    }

    if (tasks.length < MAX_TASKS) {
      setShowWarningModal(true);
    } else {
      handleSaveProgress();
    }
  };

  const handleSaveProgress = async () => {
    setShowWarningModal(false);
    setLoading(true);
    
    try {
      const updatedTasks = tasks.map((task: Task) => ({
        ...task,
        isCompleted: completedTasks.has(task.id)
      }));

      const response = await fetch('/api/daily-tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: updatedTasks,
          allCompleted: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`🎉 Congratulations! You earned ${POINTS_FOR_ALL_COMPLETE} points!`);
        
        // --- UPDATED LOGIC HERE ---
        // 1. Update Streak from the server response (it calculates it accurately)
        setCurrentStreak(data.currentStreak);

        // 2. Update Points Locally:
        // We simply add 3 to the current number. We do NOT use data.totalPoints here 
        // because that contains the Global Profile Points, but this specific UI box
        // is supposed to show only Commitment Points.
        setTotalPoints(prev => prev + POINTS_FOR_ALL_COMPLETE);
        
        fetchTodayTasks();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Failed to save progress');
    } finally {
      setLoading(false);
    }
  };

  const completionPercentage = tasks.length > 0 ? (completedTasks.size / tasks.length) * 100 : 0;
  const allTasksCompleted = tasks.length > 0 && tasks.every((task: Task) => completedTasks.has(task.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-yellow-400">Warning!</h3>
            </div>
            <p className="text-gray-300 mb-2">
              You have only created <span className="font-bold text-yellow-400">{tasks.length} commitment{tasks.length !== 1 ? 's' : ''}</span> out of {MAX_TASKS} possible commitment.
            </p>
            <p className="text-gray-400 mb-6">
              Once you complete, you <span className="font-bold text-red-400">won't be able to add more commitment</span> until tomorrow. Would you like to continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSaveProgress}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                Yes, Complete Now
              </button>
              <button
                onClick={() => setShowWarningModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Cancel & Add More
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-20">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
               My Today's Commitment
              </h1>
              <p className='text-gray-400 flex items-center gap-2 mb-2'>Small actions today decide who gets ahead tomorrow.</p>
              <p className="text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {todayDate}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-4 rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-300 font-medium">Commitment Points</p>
                  <p className="text-2xl font-bold text-blue-100">{totalPoints}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 p-4 rounded-xl border border-orange-500/30">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-300 font-medium">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-100">{currentStreak} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-6 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-200">Today's Progress</h2>
              <span className="text-sm font-medium text-gray-400">
                {completedTasks.size} / {tasks.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {allTasksCompleted ? '🎉 All commitment completed!' : `${Math.round(completionPercentage)}% complete`}
            </p>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">
              Your Tasks ({tasks.length}/{MAX_TASKS})
            </h2>
            {tasks.length < MAX_TASKS && !todayTasksData?.allCompleted && (
              <button
                onClick={() => setIsAddingTask(true)}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add commitment
              </button>
            )}
          </div>

          {/* Add Task Input */}
          {isAddingTask && (
            <div className="mb-4 p-4 bg-gray-700/50 rounded-xl border-2 border-blue-500/30">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Enter your commitment (e.g., Solve 2 DSA problems)"
                maxLength={100}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddTask();
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskText.trim() || loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add commitment
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskText('');
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tasks */}
          {loading && tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Loading commitments...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-300 font-medium mb-2">No commitments yet</p>
              <p className="text-gray-500 text-sm mb-4">
                Create up to {MAX_TASKS} commitments for today
              </p>
              {!todayTasksData?.allCompleted && (
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
                >
                  Create Your First commitment
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task: Task) => {
                const isCompleted = completedTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      isCompleted
                        ? 'bg-green-900/30 border-green-500/30 shadow-sm'
                        : 'bg-gray-700/30 border-gray-600 hover:border-blue-500/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        onClick={() => !todayTasksData?.allCompleted && handleTaskToggle(task.id)}
                        className={`flex-shrink-0 ${!todayTasksData?.allCompleted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-7 h-7 text-green-400" />
                        ) : (
                          <Circle className="w-7 h-7 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'
                        }`}>
                          {task.taskText}
                        </p>
                      </div>
                    </div>
                    {!todayTasksData?.allCompleted && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="ml-2 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          {tasks.length > 0 && (
            <div className="mt-6">
              {todayTasksData?.allCompleted ? (
                <div className="bg-green-900/30 border-2 border-green-500/30 rounded-xl p-4 text-center">
                  <p className="text-green-300 font-semibold">
                    You've already completed today's Commitment and earned {POINTS_FOR_ALL_COMPLETE} points!
                  </p>
                  <p className="text-green-400 text-sm mt-1">
                    Come back tomorrow for new Commitment!!
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCompleteAttempt}
                  disabled={loading || !allTasksCompleted}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {allTasksCompleted 
                    ? `Complete & Earn ${POINTS_FOR_ALL_COMPLETE} Points` 
                    : `Complete All commitments to Earn ${POINTS_FOR_ALL_COMPLETE} Points`
                  }
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-4 border border-blue-500/30">
          <p className="text-sm text-blue-200">
            <span className="font-semibold">💡 Rules:</span> Create up to {MAX_TASKS} commitments daily. 
            You must complete <span className="font-bold">ALL commitments</span> to earn {POINTS_FOR_ALL_COMPLETE} points. 
            Partial completion earns no points!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyTaskTracker;