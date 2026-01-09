// app/api/user/details/route.ts

import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      include: {
        summaries: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          name: clerkUser.firstName || clerkUser.username || 'User',
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