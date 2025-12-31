// app/[username]/page.tsx - Public Profile Page
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { 
  FaGraduationCap, 
  FaLocationDot, 
  FaBriefcase, 
  FaCode, 
  FaGithub, 
  FaLinkedin,
  FaTrophy,
  FaStar,
  FaLink
} from 'react-icons/fa6';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getUserByUsername(username: string) {
  try {
    // Decode URL parameter and handle special characters
    const decodedUsername = decodeURIComponent(username).trim();
    
    console.log('Looking for username:', decodedUsername); // Debug log
    
    const user = await prisma.user.findFirst({
      where: { 
        username: {
          equals: decodedUsername,
          mode: 'insensitive' // Case-insensitive search
        },
        isActive: true 
      },
      include: {
        roles: true,
      },
    });

    console.log('Found user:', user ? 'Yes' : 'No'); // Debug log
    
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const user = await getUserByUsername(resolvedParams.username);
  
  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `${user.fullName || user.username} - LeaderLab`,
    description: `View ${user.fullName || user.username}'s profile on LeaderLab`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const user = await getUserByUsername(resolvedParams.username);

  if (!user) {
    notFound();
  }

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getExperienceLabel = (exp: string | null) => {
    const levels: Record<string, string> = {
      'FRESHER': 'Fresher',
      'JUNIOR': 'Junior',
      'MID': 'Mid Level',
      'SENIOR': 'Senior',
    };
    return exp ? levels[exp] || exp : 'Not specified';
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

      <div className="relative container mx-auto max-w-5xl px-6 py-16">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold">
            {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {user.fullName || user.username}
          </h1>
          
          {user.username && (
            <p className="text-gray-400 text-lg mb-4">@{user.username}</p>
          )}

          {user.collegeName && (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <FaGraduationCap size={18} />
              <span>{user.collegeName}</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                <FaTrophy className="text-blue-400" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Points</p>
                <p className="text-3xl font-bold text-white">{user.totalPoints}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                <FaStar className="text-purple-400" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Membership</p>
                <p className="text-2xl font-bold text-white">
                  {user.isSubscribed ? 'Premium' : 'Free'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            Profile Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {user.state && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                    <FaLocationDot className="text-blue-400" size={18} />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Location</p>
                </div>
                <p className="text-base font-semibold text-white ml-13">{user.state}</p>
              </div>
            )}

            {user.experience && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                    <FaBriefcase className="text-blue-400" size={18} />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Experience</p>
                </div>
                <p className="text-base font-semibold text-white ml-13">{getExperienceLabel(user.experience)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Target Roles */}
        {user.roles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Target Roles
            </h2>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                  <FaCode className="text-blue-400" size={20} />
                </div>
                <p className="text-sm text-gray-400">{user.roles.length} role(s)</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.roles.map((userRole) => (
                  <div
                    key={userRole.id}
                    className="px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg"
                  >
                    <span className="text-white text-sm">{formatRoleName(userRole.role)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        {(user.githubUrl || user.linkedinUrl || user.resumeUrl) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Links
            </h2>

            <div className="flex flex-wrap gap-4">
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all">
                    <FaGithub className="text-white group-hover:text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">GitHub</p>
                    <p className="text-white font-medium">View Profile</p>
                  </div>
                </a>
              )}

              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-600 transition-all">
                    <FaLinkedin className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">LinkedIn</p>
                    <p className="text-white font-medium">Connect</p>
                  </div>
                </a>
              )}

              {user.resumeUrl && (
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center group-hover:from-purple-500 group-hover:to-purple-600 transition-all">
                    <FaLink className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Resume</p>
                    <p className="text-white font-medium">View Resume</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Powered by <span className="text-blue-400 font-semibold">LeaderLab</span>
          </p>
        </div>
      </div>
    </div>
  );
}
