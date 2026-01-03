//questions/solve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, subject, difficulty } = body;

    // Validate input
    if (!questionId || !subject || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if question already solved
    const existingSolved = await prisma.solvedQuestion.findUnique({
      where: {
        userId_subject_questionId: {
          userId: user.id,
          subject,
          questionId,
        },
      },
    });

    if (existingSolved) {
      return NextResponse.json(
        { error: 'Question already solved' },
        { status: 400 }
      );
    }

    // Calculate points based on difficulty
    const pointsMap = {
      EASY: 1,
      MEDIUM: 1.5,
      HARD: 2,
    };
    const pointsEarned = pointsMap[difficulty as keyof typeof pointsMap] || 0;

    // Subject field mapping
    const subjectPointsField: Record<string, string> = {
      DSA: 'dsaPoints',
      OS: 'osPoints',
      CN: 'cnPoints',
      DBMS: 'dbmsPoints',
      HR: 'hrPoints',
      OOPS: 'oopsPoints',
      SYSTEM_DESIGN: 'systemDesignPoints',
    };

    const fieldName = subjectPointsField[subject];
    if (!fieldName) {
      return NextResponse.json(
        { error: 'Invalid subject' },
        { status: 400 }
      );
    }

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create solved question record
      const solvedQuestion = await tx.solvedQuestion.create({
        data: {
          userId: user.id,
          subject,
          questionId,
          difficulty,
          pointsEarned,
        },
      });

      // 2. Update user's points - INCREMENT ALL THREE:
      // - totalPoints (overall across all activities)
      // - subjectPoints (just from subject questions)
      // - individual subject points (dsaPoints, osPoints, etc.)
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          totalPoints: { increment: pointsEarned },    // ← ADDED: Add to overall total
          subjectPoints: { increment: pointsEarned },  // Subject questions total
          [fieldName]: { increment: pointsEarned },    // Individual subject
        },
      });

      // 3. Create point transaction
      await tx.pointTransaction.create({
        data: {
          userId: user.id,
          source: 'SUBJECT_QUESTION',
          sourceId: `${subject}-${questionId}`,
          points: pointsEarned,
          metadata: {
            subject,
            questionId,
            difficulty,
          },
        },
      });

      // 4. Update or create subject progress
      const existingProgress = await tx.subjectProgress.findUnique({
        where: {
          userId_subject: {
            userId: user.id,
            subject,
          },
        },
      });

      if (existingProgress) {
        await tx.subjectProgress.update({
          where: {
            userId_subject: {
              userId: user.id,
              subject,
            },
          },
          data: {
            solvedQuestions: { increment: 1 },
            totalPoints: { increment: pointsEarned },
            [`${difficulty.toLowerCase()}Count`]: { increment: 1 },
          },
        });
      } else {
        await tx.subjectProgress.create({
          data: {
            userId: user.id,
            subject,
            solvedQuestions: 1,
            totalPoints: pointsEarned,
            easyCount: difficulty === 'EASY' ? 1 : 0,
            mediumCount: difficulty === 'MEDIUM' ? 1 : 0,
            hardCount: difficulty === 'HARD' ? 1 : 0,
          },
        });
      }

      return { solvedQuestion, updatedUser };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `+${pointsEarned} points earned!`,
    });
  } catch (error) {
    console.error('Error marking question as solved:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}