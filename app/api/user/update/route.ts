// app/api/user/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();

    // Validate and sanitize input
    const updateData: any = {};
    
    if (body.username !== undefined) {
      // Check if username is already taken by another user
      if (body.username) {
        const existingUser = await prisma.user.findUnique({
          where: { username: body.username },
        });
        
        if (existingUser && existingUser.id !== user.id) {
          return NextResponse.json(
            { error: 'Username already taken' },
            { status: 400 }
          );
        }
      }
      updateData.username = body.username;
    }
    
    if (body.collegeName !== undefined) updateData.collegeName = body.collegeName;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.experience !== undefined) updateData.experience = body.experience;
    if (body.githubUrl !== undefined) updateData.githubUrl = body.githubUrl;
    if (body.linkedinUrl !== undefined) updateData.linkedinUrl = body.linkedinUrl;
    if (body.resumeUrl !== undefined) updateData.resumeUrl = body.resumeUrl;

    const updatedUser = await prisma.user.update({
      where: { clerkId: user.clerkId },
      data: updateData,
      include: {
        roles: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    // Handle unique constraint violation for username
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}