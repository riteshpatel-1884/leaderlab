// app/api/daily-tasks/today/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getISTDate, getNextDayIST } from '@/lib/date-utils'; 

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Use IST Date logic
    const todayIST = getISTDate();
    const tomorrowIST = getNextDayIST(todayIST);

    // Find today's daily task record
    const dailyTask = await prisma.dailyTask.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: todayIST,
          lt: tomorrowIST,
        },
      },
    });

    if (!dailyTask) {
      return NextResponse.json({
        tasks: [],
        allCompleted: false,
        pointsEarned: 0,
      });
    }

    // Parse tasks from JSON field
    const tasks = Array.isArray(dailyTask.tasks) ? dailyTask.tasks : [];

    return NextResponse.json({
      tasks: tasks,
      allCompleted: dailyTask.pointsEarned > 0, 
      pointsEarned: dailyTask.pointsEarned,
      date: dailyTask.date,
    });
  } catch (error) {
    console.error('Error fetching daily tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}