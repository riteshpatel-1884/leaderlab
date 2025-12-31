// app/api/user/me/route.ts
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireUser();
    
    return NextResponse.json({
      totalPoints: user.totalPoints,
      isSubscribed: user.isSubscribed,
      collegeName: user.collegeName,
      email: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}