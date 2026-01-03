// app/api/daily-tasks/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getISTDate, getNextDayIST } from '@/lib/date-utils';

const POINTS_FOR_ALL_COMPLETE = 3;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const { tasks } = body;

    // 1. Timezone Logic
    const todayIST = getISTDate();
    const tomorrowIST = getNextDayIST(todayIST);

    // 2. Prevent Double Points
    const existingDailyTask = await prisma.dailyTask.findFirst({
      where: { 
        userId: user.id, 
        date: { gte: todayIST, lt: tomorrowIST } 
      },
    });

    if (existingDailyTask && existingDailyTask.pointsEarned > 0) {
      return NextResponse.json({ error: 'Already earned points for today' }, { status: 400 });
    }

    // 3. Database Transaction
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Save the Daily Task (Record that they earned 3 points for THIS specific day)
      const dailyTask = await tx.dailyTask.upsert({
        where: { userId_date: { userId: user.id, date: todayIST } },
        update: { tasks: tasks, pointsEarned: POINTS_FOR_ALL_COMPLETE },
        create: { userId: user.id, date: todayIST, tasks: tasks, pointsEarned: POINTS_FOR_ALL_COMPLETE },
      });

      // B. Create a History Log (Transaction)
      await tx.pointTransaction.create({
        data: { userId: user.id, source: 'DAILY_TASK', sourceId: dailyTask.id, points: POINTS_FOR_ALL_COMPLETE },
      });

      // C. Update User's OVERALL Stats (Total Points + Streak)
      const yesterdayIST = new Date(todayIST);
      yesterdayIST.setDate(yesterdayIST.getDate() - 1);
      
      let newStreak = 1; // Default to 1 (New Streak)

      if (user.lastStreakDate) {
        const lastStreakTime = new Date(user.lastStreakDate).getTime();
        const yesterdayTime = yesterdayIST.getTime();
        const todayTime = todayIST.getTime();

        // If last streak was yesterday, increment (e.g., 5 -> 6)
        if (lastStreakTime === yesterdayTime) {
            newStreak = user.currentStreak + 1;
        } 
        // If last streak was today (rare case of re-running), keep it
        else if (lastStreakTime === todayTime) {
            newStreak = user.currentStreak;
        }
        // If last streak was older, it stays 1 (Reset)
      }

      // Add to TOTAL OVERALL points
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          totalPoints: { increment: POINTS_FOR_ALL_COMPLETE }, // Adds 3 to existing total
          currentStreak: newStreak,
          lastStreakDate: todayIST,
        },
        select: { totalPoints: true, currentStreak: true },
      });

      return updatedUser;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}