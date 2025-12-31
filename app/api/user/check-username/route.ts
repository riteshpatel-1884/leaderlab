// // app/api/user/check-username/route.ts - Check Username Availability
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { username } = body;

//     if (!username) {
//       return NextResponse.json(
//         { available: false, error: 'Username is required' },
//         { status: 400 }
//       );
//     }

//     // Validate username format (alphanumeric, underscore, hyphen only)
//     const usernameRegex = /^[a-zA-Z0-9_-]+$/;
//     if (!usernameRegex.test(username)) {
//       return NextResponse.json({
//         available: false,
//         error: 'Username can only contain letters, numbers, underscores, and hyphens'
//       });
//     }

//     // Check if username exists
//     const existingUser = await prisma.user.findUnique({
//       where: { username: username.toLowerCase() },
//     });

//     return NextResponse.json({
//       available: !existingUser,
//       message: existingUser ? 'Username already taken' : 'Username available'
//     });
//   } catch (error) {
//     console.error('Error checking username:', error);
//     return NextResponse.json(
//       { available: false, error: 'Failed to check username' },
//       { status: 500 }
//     );
//   }
// }



// app/api/user/check-username/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { available: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format (alphanumeric, underscore, hyphen only)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({
        available: false,
        message: 'Only letters, numbers, underscores, and hyphens allowed'
      });
    }

    // Check length constraints
    if (username.length < 3) {
      return NextResponse.json({
        available: false,
        message: 'Username must be at least 3 characters'
      });
    }

    if (username.length > 20) {
      return NextResponse.json({
        available: false,
        message: 'Username must be 20 characters or less'
      });
    }

    // Check if username exists (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: { 
        username: {
          equals: username,
          mode: 'insensitive'
        }
      },
    });

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? 'Username already taken' : 'Username available!'
    });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      { available: false, error: 'Failed to check username' },
      { status: 500 }
    );
  }
}