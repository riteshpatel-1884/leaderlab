// app/api/daily-tasks/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { tasks } = body;

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Invalid tasks data' },
        { status: 400 }
      );
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if daily task already exists for today
    const existingDailyTask = await prisma.dailyTask.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Don't allow saving if already completed
    if (existingDailyTask && existingDailyTask.pointsEarned > 0) {
      return NextResponse.json(
        { error: 'Tasks already completed for today' },
        { status: 400 }
      );
    }

    // Create or update daily task record with new tasks (without earning points)
    const dailyTask = await prisma.dailyTask.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {
        tasks: tasks,
      },
      create: {
        userId: user.id,
        date: today,
        tasks: tasks,
        pointsEarned: 0, // No points earned yet
      },
    });

    return NextResponse.json({
      success: true,
      tasks: dailyTask.tasks,
    });
  } catch (error) {
    console.error('Error saving tasks:', error);
    return NextResponse.json(
      { error: 'Failed to save tasks' },
      { status: 500 }
    );
  }
}