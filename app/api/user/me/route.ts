// // app/api/user/me/route.ts
// import { NextResponse } from 'next/server';
// import { requireUser } from '@/lib/auth';

// export async function GET() {
//   try {
//     const user = await requireUser();
    
//     return NextResponse.json({
//       totalPoints: user.totalPoints,
//       isSubscribed: user.isSubscribed,
//       collegeName: user.collegeName,
//       email: user.email,
//       fullName: user.fullName,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Unauthorized' },
//       { status: 401 }
//     );
//   }
// }


// app/api/user/me/route.ts
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireUser();
    
    return NextResponse.json({
      totalPoints: user.totalPoints || 0,
      isSubscribed: user.isSubscribed || false,
      collegeName: user.collegeName,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      id: user.id,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    
    // Check if it's an authentication error or other error
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}