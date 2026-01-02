// app/api/daily-tasks/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const POINTS_FOR_ALL_COMPLETE = 3;

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
    const { tasks, allCompleted } = body;

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Invalid tasks data' },
        { status: 400 }
      );
    }

    if (!allCompleted) {
      return NextResponse.json(
        { error: 'All tasks must be completed to earn points' },
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

    // Check if already completed
    if (existingDailyTask && existingDailyTask.pointsEarned > 0) {
      return NextResponse.json(
        { error: 'You have already completed today\'s tasks' },
        { status: 400 }
      );
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create or update daily task record
      const dailyTask = await tx.dailyTask.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
        update: {
          tasks: tasks,
          pointsEarned: POINTS_FOR_ALL_COMPLETE,
        },
        create: {
          userId: user.id,
          date: today,
          tasks: tasks,
          pointsEarned: POINTS_FOR_ALL_COMPLETE,
        },
      });

      // Create point transaction
      await tx.pointTransaction.create({
        data: {
          userId: user.id,
          source: 'DAILY_TASK',
          sourceId: dailyTask.id,
          points: POINTS_FOR_ALL_COMPLETE,
        },
      });

      // Update user's total points
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          totalPoints: {
            increment: POINTS_FOR_ALL_COMPLETE,
          },
        },
        select: {
          totalPoints: true,
        },
      });

      return updatedUser;
    });

    return NextResponse.json({
      success: true,
      pointsEarned: POINTS_FOR_ALL_COMPLETE,
      totalPoints: result.totalPoints,
    });
  } catch (error) {
    console.error('Error completing tasks:', error);
    return NextResponse.json(
      { error: 'Failed to complete tasks' },
      { status: 500 }
    );
  }
}