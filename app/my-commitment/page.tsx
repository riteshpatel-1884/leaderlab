"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Calendar, Trophy, Flame, Plus, X, Save, AlertTriangle, BarChart3 } from 'lucide-react';

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
  const [totalPoints, setTotalPoints] = useState(0); 
  
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
        setTotalPoints(data.totalCommitmentPoints || 0);
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
        setCurrentStreak(data.currentStreak);
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

      <div className="max-w-6xl mx-auto pt-12">
        
        {/* ROW 1: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* COLUMN 1: Header & Stats */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 flex flex-col justify-between h-full">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
               My Today's Commitment
              </h1>
              <p className='text-gray-400 flex items-center gap-2 mb-2'>Small actions today decide who gets ahead tomorrow.</p>
              <p className="text-gray-400 flex items-center gap-2 mb-6">
                <Calendar className="w-4 h-4" />
                {todayDate}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-4 rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-blue-300 font-medium truncate">Points</p>
                    <p className="text-xl font-bold text-blue-100">{totalPoints}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 p-4 rounded-xl border border-orange-500/30">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-orange-300 font-medium truncate">Streak</p>
                    <p className="text-xl font-bold text-orange-100">{currentStreak} <span className="text-sm">days</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Today's Progress & Rules */}
          {/* Added flex flex-col and justify-between to space out progress and rules */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 h-full flex flex-col justify-between">
            <div className="flex-1 flex flex-col justify-center">
              {tasks.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      Today's Progress
                    </h2>
                    <span className="text-sm font-medium text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-600">
                      {completedTasks.size} / {tasks.length}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner mb-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-400 text-center">
                    {allTasksCompleted 
                      ? '🎉 Magnificent! All commitments completed!' 
                      : `${Math.round(completionPercentage)}% completed. Keep going!`}
                  </p>
                </>
              ) : (
                <div className="text-center py-2">
                  <div className="bg-gray-700/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-gray-300 font-medium">No Active Progress</h3>
                  <p className="text-sm text-gray-500 mt-1">Add a commitment below to start tracking your progress for today.</p>
                </div>
              )}
            </div>

            {/* Moved Rules Section Here */}
            <div className="mt-4 pt-3 border-t border-gray-700/50">
               <p className="text-xs text-gray-400 text-center leading-relaxed">
                 <span className="font-semibold text-purple-400">💡 Rule:</span> Create up to {MAX_TASKS} commitments daily. You must complete <span className="text-gray-200 font-medium">ALL commitments</span> to earn <span className="text-yellow-400 font-bold">{POINTS_FOR_ALL_COMPLETE} points</span>.
               </p>
            </div>
          </div>

        </div>

        {/* ROW 2: Tasks List (Full Width) */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 border border-gray-700 w-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-200">
              Your Tasks ({tasks.length}/{MAX_TASKS})
            </h2>
            {tasks.length < MAX_TASKS && !todayTasksData?.allCompleted && (
              <button
                onClick={() => setIsAddingTask(true)}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-1.5 px-3 text-sm rounded-lg transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Commitment
              </button>
            )}
          </div>

          {/* Add Task Input */}
          {isAddingTask && (
            <div className="mb-3 p-3 bg-gray-700/50 rounded-xl border-2 border-blue-500/30">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Enter your commitment..."
                maxLength={100}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-2"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddTask();
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskText.trim() || loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-1.5 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  Add Commitment
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskText('');
                  }}
                  className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tasks */}
          {loading && tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Loading...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-700/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-300 font-medium mb-1">No commitments yet</p>
              {!todayTasksData?.allCompleted && (
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-1.5 px-4 rounded-lg transition-all"
                >
                  Create My First Commitment
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task: Task) => {
                const isCompleted = completedTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      isCompleted
                        ? 'bg-green-900/30 border-green-500/30 shadow-sm'
                        : 'bg-gray-700/30 border-gray-600 hover:border-blue-500/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        onClick={() => !todayTasksData?.allCompleted && handleTaskToggle(task.id)}
                        className={`flex-shrink-0 ${!todayTasksData?.allCompleted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm md:text-base ${
                          isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'
                        }`}>
                          {task.taskText}
                        </p>
                      </div>
                    </div>
                    {!todayTasksData?.allCompleted && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="ml-2 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          {tasks.length > 0 && (
            <div className="mt-4">
              {todayTasksData?.allCompleted ? (
                <div className="bg-green-900/30 border-2 border-green-500/30 rounded-xl p-3 text-center">
                  <p className="text-green-300 font-semibold text-sm">
                    Today's Commitment Completed!
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCompleteAttempt}
                  disabled={loading || !allTasksCompleted}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {allTasksCompleted 
                    ? `Complete & Earn ${POINTS_FOR_ALL_COMPLETE} Points` 
                    : `Complete All to Earn`
                  }
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTaskTracker;