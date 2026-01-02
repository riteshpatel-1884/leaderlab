// app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { userId } =await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const role = searchParams.get('role');
    const experience = searchParams.get('experience');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = { isActive: true };
    
    if (role) {
      where.roles = {
        some: { role }
      };
    }
    
    if (experience) {
      where.experience = experience;
    }
    
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        roles: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all users matching filter (for ranking)
    const allUsers = await prisma.user.findMany({
      where,
      orderBy: { totalPoints: 'desc' },
      select: {
        id: true,
        totalPoints: true 
      }
    });

    // Calculate current user's rank
    const currentUserRank = allUsers.findIndex(u => u.id === currentUser.id) + 1;
    const totalUsers = allUsers.length;

    // Get paginated users
    const users = await prisma.user.findMany({
      where,
      orderBy: { totalPoints: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        roles: true
      }
    });

    // Add rank to each user
    const usersWithRank = users.map((user, index) => ({
      ...user,
      rank: (page - 1) * limit + index + 1,
      email: maskEmail(user.email)
    }));

    // Get current user with rank if not in current page
    let pinnedUser = null;
    if (!usersWithRank.find(u => u.id === currentUser.id)) {
      pinnedUser = {
        ...currentUser,
        rank: currentUserRank,
        email: maskEmail(currentUser.email)
      };
    }

    // Statistics
    const usersAhead = currentUserRank - 1;
    const usersBehind = totalUsers - currentUserRank;
    const averagePoints = Math.round(
      allUsers.reduce((sum, u) => sum + u.totalPoints, 0) / totalUsers
    );
    const topPercentile = ((totalUsers - currentUserRank + 1) / totalUsers * 100).toFixed(1);

    return NextResponse.json({
      users: usersWithRank,
      pinnedUser,
      currentUser: {
        id: currentUser.id,
        rank: currentUserRank,
        totalPoints: currentUser.totalPoints
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasMore: page * limit < totalUsers
      },
      statistics: {
        usersAhead,
        usersBehind,
        averagePoints,
        topPercentile,
        pointsToNextRank: currentUserRank > 1 ? allUsers[currentUserRank - 2].totalPoints - currentUser.totalPoints : 0
      }
    });
  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const [local, domain] = email.split('@');
  if (local.length <= 3) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.slice(0, 2)}${'*'.repeat(local.length - 3)}${local.slice(-1)}@${domain}`;
}

