// app/dashboard/DashboardClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaPencil, 
  FaCheck, 
  FaXmark, 
  FaGraduationCap, 
  FaLocationDot, 
  FaBriefcase, 
  FaCode, 
  FaGithub, 
  FaLinkedin, 
  FaLink, 
  FaUser,
  FaTrophy,
  FaStar,
  FaChartLine,
  FaCopy,
  FaCircleCheck,
  FaCircleXmark,
  FaSpinner,
  FaEnvelope,
  FaIdCard
} from 'react-icons/fa6';

interface UserRole {
  id: string;
  userId: string;
  role: string;
}

interface User {
  id: string;
  clerkId: string;
  username: string | null;
  fullName: string | null;
  email: string | null;
  collegeName: string | null;
  state: string | null;
  experience: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  totalPoints: number;
  isSubscribed: boolean;
  roles: UserRole[];
}

interface EditableFieldProps {
  label: string;
  value: string | null;
  field: string;
  icon: React.ElementType;
  onSave: (field: string, value: string) => Promise<void>;
}

function EditableField({ label, value, field, icon: Icon, onSave }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(field, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all">
            <Icon className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
            {!isEditing && (
              <p className="text-base font-semibold text-white mt-0.5">
                {value || <span className="text-gray-600 italic">Not set</span>}
              </p>
            )}
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <FaPencil className="text-gray-400 hover:text-blue-400" size={14} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <FaCheck className="text-white" size={14} />
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaXmark className="text-gray-400" size={14} />
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder={`Enter ${label.toLowerCase()}`}
          autoFocus
        />
      )}
    </div>
  );
}

interface UsernameFieldProps {
  value: string | null;
  currentUsername: string | null;
  onSave: (field: string, value: string) => Promise<void>;
}

function UsernameField({ value, currentUsername, onSave }: UsernameFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setAvailability(null);
      return;
    }

    // Don't check if empty or same as current
    if (!editValue || editValue === currentUsername) {
      setAvailability(null);
      return;
    }

    // Validate format first
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(editValue)) {
      setAvailability({
        available: false,
        message: 'Only letters, numbers, underscores, and hyphens allowed'
      });
      return;
    }

    // Check length
    if (editValue.length < 3) {
      setAvailability({
        available: false,
        message: 'Username must be at least 3 characters'
      });
      return;
    }

    if (editValue.length > 20) {
      setAvailability({
        available: false,
        message: 'Username must be 20 characters or less'
      });
      return;
    }

    // Debounce the API call
    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      try {
        const response = await fetch('/api/user/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: editValue }),
        });

        const data = await response.json();
        setAvailability({
          available: data.available,
          message: data.message || (data.available ? 'Username available!' : 'Username already taken')
        });
      } catch (error) {
        console.error('Error checking username:', error);
        setAvailability({
          available: false,
          message: 'Error checking availability'
        });
      } finally {
        setIsChecking(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [editValue, isEditing, currentUsername]);

  const handleSave = async () => {
    if (!availability?.available) return;
    
    setIsSaving(true);
    try {
      await onSave('username', editValue);
      setIsEditing(false);
      setAvailability(null);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
    setAvailability(null);
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all">
            <FaUser className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Username</p>
            {!isEditing && (
              <p className="text-base font-semibold text-white mt-0.5">
                {value ? (
                  <span>@{value}</span>
                ) : (
                  <span className="text-gray-600 italic">Not set</span>
                )}
              </p>
            )}
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <FaPencil className="text-gray-400 hover:text-blue-400" size={14} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || !availability?.available || isChecking}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCheck className="text-white" size={14} />
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaXmark className="text-gray-400" size={14} />
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <div>
          <div className="relative">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value.toLowerCase())}
              className="w-full px-3 py-2 pr-10 bg-gray-950 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter username (e.g., john_doe)"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isChecking && (
                <FaSpinner className="text-gray-400 animate-spin" size={14} />
              )}
              {!isChecking && availability && (
                availability.available ? (
                  <FaCircleCheck className="text-green-400" size={14} />
                ) : (
                  <FaCircleXmark className="text-red-400" size={14} />
                )
              )}
            </div>
          </div>
          
          {availability && (
            <div className={`mt-2 flex items-center gap-2 text-xs ${
              availability.available ? 'text-green-400' : 'text-red-400'
            }`}>
              {availability.available ? (
                <FaCircleCheck size={12} />
              ) : (
                <FaCircleXmark size={12} />
              )}
              <span>{availability.message}</span>
            </div>
          )}
          
          {isEditing && !editValue && (
            <p className="mt-2 text-xs text-gray-500">
              Choose a unique username for your profile URL
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface ExperienceFieldProps {
  value: string | null;
  onSave: (field: string, value: string) => Promise<void>;
}

function ExperienceField({ value, onSave }: ExperienceFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);

  const experienceLevels = [
    { value: 'FRESHER', label: 'Fresher', color: 'from-green-500/20 to-green-600/20' },
    { value: 'JUNIOR', label: 'Junior', color: 'from-blue-500/20 to-blue-600/20' },
    { value: 'MID', label: 'Mid Level', color: 'from-purple-500/20 to-purple-600/20' },
    { value: 'SENIOR', label: 'Senior', color: 'from-orange-500/20 to-orange-600/20' },
  ];

  const getDisplayValue = (val: string | null) => {
    if (!val) return 'Not set';
    const level = experienceLevels.find(l => l.value === val);
    return level ? level.label : val;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave('experience', editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all">
            <FaBriefcase className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Experience Level</p>
            {!isEditing && (
              <p className="text-base font-semibold text-white mt-0.5">
                {value ? (
                  <span>{getDisplayValue(value)}</span>
                ) : (
                  <span className="text-gray-600 italic">Not set</span>
                )}
              </p>
            )}
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <FaPencil className="text-gray-400 hover:text-blue-400" size={14} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <FaCheck className="text-white" size={14} />
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaXmark className="text-gray-400" size={14} />
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          autoFocus
        >
          <option value="">Select experience level</option>
          {experienceLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

interface RoleManagerProps {
  roles: UserRole[];
  onAddRole: (role: string) => Promise<void>;
  onRemoveRole: (roleId: string) => Promise<void>;
}

function RoleManager({ roles, onAddRole, onRemoveRole }: RoleManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const availableRoles = [
    'SDE',
    'FRONTEND',
    'BACKEND',
    'FULLSTACK',
    'DATA_ANALYST',
    'DATA_SCIENTIST',
    'ML_ENGINEER',
  ];

  const currentRoles = roles.map(r => r.role);
  const availableToAdd = availableRoles.filter(r => !currentRoles.includes(r));

  const handleAddRole = async () => {
    if (!selectedRole) return;
    
    setIsProcessing(true);
    try {
      await onAddRole(selectedRole);
      setSelectedRole('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add role:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    setIsProcessing(true);
    try {
      await onRemoveRole(roleId);
    } catch (error) {
      console.error('Failed to remove role:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all">
            <FaCode className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Target Roles</p>
            <p className="text-base font-semibold text-white mt-0.5">
              {roles.length > 0 ? `${roles.length} role(s) selected` : <span className="text-gray-600 italic">No roles set</span>}
            </p>
          </div>
        </div>
        
        {availableToAdd.length > 0 && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {isAdding ? 'Cancel' : '+ Add Role'}
          </button>
        )}
      </div>

      {roles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {roles.map((userRole) => (
            <div
              key={userRole.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-950 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-all"
            >
              <span className="text-white text-sm">{formatRoleName(userRole.role)}</span>
              <button
                onClick={() => handleRemoveRole(userRole.id)}
                disabled={isProcessing}
                className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
              >
                <FaXmark size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding && (
        <div className="flex gap-2 mt-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={isProcessing}
          >
            <option value="">Select a role</option>
            {availableToAdd.map((role) => (
              <option key={role} value={role}>
                {formatRoleName(role)}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddRole}
            disabled={!selectedRole || isProcessing}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileLinkCard({ username }: { username: string | null }) {
  const [copied, setCopied] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      setProfileUrl(`${window.location.origin}/${username}`);
    }
  }, [username]);

  const copyToClipboard = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-gray-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Your Public Profile</h3>
          <p className="text-sm text-gray-400">Share your personalized profile link</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <FaLink className="text-blue-400" size={18} />
        </div>
      </div>

      {profileUrl ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
            <p className="text-sm text-blue-400 font-mono truncate break-all">{profileUrl}</p>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center sm:w-auto"
            title="Copy to clipboard"
          >
            {copied ? (
              <FaCircleCheck className="text-white" size={18} />
            ) : (
              <FaCopy className="text-white" size={18} />
            )}
          </button>
        </div>
      ) : (
        <div className="px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 italic">Set a username to get your profile link</p>
        </div>
      )}
    </div>
  );
}

export default function DashboardClient({ user }: { user: User }) {
  const [userData, setUserData] = useState(user);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleSave = async (field: string, value: string) => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update');
      }

      setUserData(data.user);
      setUpdateError(null);
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update. Please try again.');
      throw error;
    }
  };

  const handleAddRole = async (role: string) => {
    try {
      const response = await fetch('/api/user/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to add role');
      }

      const { user: updatedUser } = await response.json();
      setUserData(updatedUser);
      setUpdateError(null);
    } catch (error) {
      setUpdateError('Failed to add role. Please try again.');
      throw error;
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      const response = await fetch('/api/user/roles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove role');
      }

      const { user: updatedUser } = await response.json();
      setUserData(updatedUser);
      setUpdateError(null);
    } catch (error) {
      setUpdateError('Failed to remove role. Please try again.');
      throw error;
    }
  };

  const profileCompletion = () => {
    const fields = [
      userData.username,
      userData.collegeName,
      userData.state,
      userData.experience,
      userData.roles.length > 0,
      userData.githubUrl,
      userData.linkedinUrl,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative container mx-auto max-w-7xl pt-24 px-6 py-8">
        {/* Hero Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{userData.fullName || userData.username || 'User'}</span>
              </h1>
              <p className="text-gray-400 text-base md:text-lg">
                Manage your profile and track your placement journey
              </p>
            </div>
            <div className="w-full md:w-auto px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Profile Completion</p>
              <p className="text-2xl font-bold text-blue-400">{profileCompletion()}%</p>
            </div>
          </div>

          {updateError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
              <FaCircleXmark className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="text-red-400 font-semibold text-sm">Update Failed</p>
                <p className="text-red-400/80 text-sm mt-0.5">{updateError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid - Mobile: 2x2, Desktop: 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-gray-800 rounded-xl p-4 md:p-6 hover:border-blue-500/50 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <FaTrophy className="text-blue-400" size={20} />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Points</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{userData.totalPoints}</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-gray-800 rounded-xl p-4 md:p-6 hover:border-purple-500/50 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <FaStar className="text-purple-400" size={20} />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Membership</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                {userData.isSubscribed ? 'Premium' : 'Free'}
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-gray-800 rounded-xl p-4 md:p-6 hover:border-green-500/50 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <FaChartLine className="text-green-400" size={20} />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Profile Status</p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {profileCompletion()}%
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border border-gray-800 rounded-xl p-4 md:p-6 hover:border-orange-500/50 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <FaCode className="text-orange-400" size={20} />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Target Roles</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{userData.roles.length}</p>
            </div>
          </div>
        </div>

        {/* Profile Link Section */}
        <div className="mb-10">
          <ProfileLinkCard username={userData.username} />
        </div>

        {/* Profile Information Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">
              Profile Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <UsernameField
              value={userData.username}
              currentUsername={userData.username}
              onSave={handleSave}
            />

            <EditableField
              label="Full Name"
              value={userData.fullName}
              field="fullName"
              icon={FaIdCard}
              onSave={handleSave}
            />

            <EditableField
              label="Email"
              value={userData.email}
              field="email"
              icon={FaEnvelope}
              onSave={handleSave}
            />

            <EditableField
              label="College Name"
              value={userData.collegeName}
              field="collegeName"
              icon={FaGraduationCap}
              onSave={handleSave}
            />

            <EditableField
              label="State"
              value={userData.state}
              field="state"
              icon={FaLocationDot}
              onSave={handleSave}
            />

            <ExperienceField
              value={userData.experience}
              onSave={handleSave}
            />

            <div className="md:col-span-2">
              <RoleManager
                roles={userData.roles}
                onAddRole={handleAddRole}
                onRemoveRole={handleRemoveRole}
              />
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">
              Social & Links
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <EditableField
              label="GitHub URL"
              value={userData.githubUrl}
              field="githubUrl"
              icon={FaGithub}
              onSave={handleSave}
            />

            <EditableField
              label="LinkedIn URL"
              value={userData.linkedinUrl}
              field="linkedinUrl"
              icon={FaLinkedin}
              onSave={handleSave}
            />

            <EditableField
              label="Resume URL"
              value={userData.resumeUrl}
              field="resumeUrl"
              icon={FaLink}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}