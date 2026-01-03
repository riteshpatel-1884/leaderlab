// app/api/user/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getISTDate } from '@/lib/date-utils';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { roles: { select: { role: true } } },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 1. CALCULATE COMMITMENT POINTS ONLY
    // We sum up points specifically where source is 'DAILY_TASK'
    const commitmentStats = await prisma.pointTransaction.aggregate({
      where: {
        userId: user.id,
        source: 'DAILY_TASK',
      },
      _sum: {
        points: true,
      },
    });
    
    // This variable now holds ONLY points from commitments
    const totalCommitmentPoints = commitmentStats._sum.points || 0;

    // 2. STREAK LOGIC
    const todayIST = getISTDate();
    const yesterdayIST = new Date(todayIST);
    yesterdayIST.setDate(yesterdayIST.getDate() - 1);

    let displayStreak = user.currentStreak;

    if (user.lastStreakDate) {
        const lastStreakTime = new Date(user.lastStreakDate).getTime();
        const yesterdayTime = yesterdayIST.getTime();
        const todayTime = todayIST.getTime();

        if (lastStreakTime < yesterdayTime) {
            displayStreak = 0;
        }
    } else {
        displayStreak = 0;
    }

    return NextResponse.json({
      ...user,
      currentStreak: displayStreak,
      totalCommitmentPoints, // <--- We send this new specific value to the frontend
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}