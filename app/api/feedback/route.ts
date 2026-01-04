import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // 👈 Your main database client

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, category, description, email } = body;

    if (!description || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Use 'prisma' (your main client) instead of 'feedbackDb'
    const feedback = await prisma.feedback.create({
      data: {
        type,
        category,
        description,
        email,
      },
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("Feedback DB Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}