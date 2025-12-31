// app/api/user/points/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();

    const { source, sourceId, points } = body;

    // Create point transaction
    const transaction = await prisma.pointTransaction.create({
      data: {
        userId: user.id,
        source,
        sourceId,
        points,
      },
    });

    // Update user's total points
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalPoints: {
          increment: points,
        },
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Error adding points:', error);
    return NextResponse.json(
      { error: 'Failed to add points' },
      { status: 500 }
    );
  }
}