//questions/solved/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');

    // Get user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build query based on subject filter
    const whereClause: any = {
      userId: user.id,
    };

    if (subject) {
      whereClause.subject = subject;
    }

    // Get all solved questions for the user
    const solvedQuestions = await prisma.solvedQuestion.findMany({
      where: whereClause,
      orderBy: {
        solvedAt: 'desc',
      },
    });

    // Get subject progress
    const subjectProgress = await prisma.subjectProgress.findMany({
      where: {
        userId: user.id,
      },
    });

    // Get user points - CHANGED: Return subjectPoints instead of totalPoints
    const userPoints = {
      subjectPoints: user.subjectPoints,  // ← FIXED: Now returning subjectPoints
      dsaPoints: user.dsaPoints,
      osPoints: user.osPoints,
      cnPoints: user.cnPoints,
      dbmsPoints: user.dbmsPoints,
      hrPoints: user.hrPoints,
      oopsPoints: user.oopsPoints,
      systemDesignPoints: user.systemDesignPoints,
    };

    return NextResponse.json({
      success: true,
      data: {
        solvedQuestions,
        subjectProgress,
        userPoints,
      },
    });
  } catch (error) {
    console.error('Error fetching solved questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}