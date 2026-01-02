// app/api/user/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const transformedUser = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      collegeName: user.collegeName,
      state: user.state,
      experience: user.experience,
      totalPoints: user.totalPoints,
      roles: user.roles.map((r) => r.role),
      githubUrl: user.githubUrl || undefined,
      linkedinUrl: user.linkedinUrl || undefined,
      resumeUrl: user.resumeUrl || undefined,
      isSubscribed: user.isSubscribed,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}