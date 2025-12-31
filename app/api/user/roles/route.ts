
// ============================================
// app/api/user/roles/route.ts - Add/Remove Roles API
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Add a new role
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = [
      'SDE',
      'FRONTEND',
      'BACKEND',
      'FULLSTACK',
      'DATA_ANALYST',
      'DATA_SCIENTIST',
      'ML_ENGINEER',
    ];

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if role already exists
    const existingRole = await prisma.userRole.findUnique({
      where: {
        userId_role: {
          userId: user.id,
          role: role,
        },
      },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role already added' },
        { status: 400 }
      );
    }

    // Add the role
    await prisma.userRole.create({
      data: {
        userId: user.id,
        role: role,
      },
    });

    // Get updated user with roles
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: true,
        dailyTasks: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error adding role:', error);
    return NextResponse.json(
      { error: 'Failed to add role' },
      { status: 500 }
    );
  }
}

// Remove a role
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { roleId } = body;

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }

    // Verify the role belongs to the user
    const role = await prisma.userRole.findUnique({
      where: { id: roleId },
    });

    if (!role || role.userId !== user.id) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Delete the role
    await prisma.userRole.delete({
      where: { id: roleId },
    });

    // Get updated user with roles
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: true,
        dailyTasks: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error removing role:', error);
    return NextResponse.json(
      { error: 'Failed to remove role' },
      { status: 500 }
    );
  }
}
