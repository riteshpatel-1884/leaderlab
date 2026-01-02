// app/api/daily-tasks/today/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get today's date at midnight (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date at midnight (end of day)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find today's daily task record
    const dailyTask = await prisma.dailyTask.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: tomorrow,
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
      allCompleted: dailyTask.pointsEarned > 0, // If points earned, tasks are completed
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