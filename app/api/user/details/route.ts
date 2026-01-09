// app/api/user/details/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        summaries: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!user) {
      // If user doesn't exist, create with minimal data
      // The name will be updated on first proper access
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          name: 'User',
        },
        include: {
          summaries: {
            include: {
              subject: true
            }
          }
        }
      });
    }

    // Calculate total stats
    const totalSolved = user.summaries.reduce((acc, s) => acc + s.solvedCount, 0);
    const totalFailed = user.summaries.reduce((acc, s) => acc + s.failedCount, 0);

    // Format subject progress
    const subjectProgress = user.summaries.map(summary => ({
      name: summary.subject.name,
      solved: summary.solvedCount,
      failed: summary.failedCount,
      lastActivity: summary.lastActivity
    }));

    return NextResponse.json({
      id: user.id,
      clerkUserId: user.clerkUserId,
      name: user.name,
      createdAt: user.createdAt,
      totalSolved,
      totalFailed,
      subjectProgress
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
  
}