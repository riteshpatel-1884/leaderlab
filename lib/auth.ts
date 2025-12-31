// lib/auth.ts
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return null;
  }

  // Try to find existing user in database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      roles: true,
      dailyTasks: {
        orderBy: { date: 'desc' },
        take: 1,
      },
    },
  });

  // If user doesn't exist, create them
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
        username: clerkUser.username,
      },
      include: {
        roles: true,
        dailyTasks: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });
  }

  return dbUser;
}

// Helper function to get user or throw error
export async function requireUser() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}