// app/api/user/update/route.ts - OPTIMIZED
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();

    const updateData: any = {};
    
    // Username validation - only check if username is being changed
    if (body.username !== undefined && body.username !== user.username) {
      if (body.username) {
        const existingUser = await prisma.user.findUnique({
          where: { username: body.username },
          select: { id: true }, // Only select what we need
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
    
    // Only add fields that are actually being updated
    if (body.fullName !== undefined) updateData.fullName = body.fullName;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.collegeName !== undefined) updateData.collegeName = body.collegeName;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.experience !== undefined) updateData.experience = body.experience;
    if (body.githubUrl !== undefined) updateData.githubUrl = body.githubUrl;
    if (body.linkedinUrl !== undefined) updateData.linkedinUrl = body.linkedinUrl;
    if (body.resumeUrl !== undefined) updateData.resumeUrl = body.resumeUrl;

    // Single optimized update - no include unless necessary
    const updatedUser = await prisma.user.update({
      where: { id: user.id }, // Use id instead of clerkId (faster)
      data: updateData,
      include: {
    roles: true, // ✅ REQUIRED
  },
      // Remove include if frontend doesn't need roles immediately
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user:', error);
    
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