import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Groq from 'groq-sdk';
import { prisma } from '@/lib/prisma';

// ⚠️ SECURITY WARNING: Do not commit this file to GitHub with your real API key!
// It is hardcoded here for testing, but should be in .env for production.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 Starting Chat Request...");

    // 1. Auth Check
    console.log("Step 1: Checking auth...");
    const { userId } = await auth();
    console.log("✅ Auth result:", { userId });
    
    if (!userId) {
      console.log("❌ No User ID found");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Body
    console.log("Step 2: Parsing request body...");
    const body = await req.json();
    const { message } = body;
    console.log("✅ Message received:", message);

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 3. Database Queries
    console.log("Step 3: Querying database...");
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        roles: true,
        pointTxns: {
          orderBy: { createdAt: 'desc' },
          take: 10 
        }
      }
    });
    console.log("✅ Current user found:", currentUser?.fullName);

    if (!currentUser) {
      console.error("❌ User not found in database");
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log("Step 4: Getting leaderboard data...");
    const topUsers = await prisma.user.findMany({
      where: { isActive: true },
      orderBy: { totalPoints: 'desc' },
      take: 20, 
      include: { roles: true }
    });
    console.log("✅ Top users count:", topUsers.length);

    const totalUsers = await prisma.user.count({ where: { isActive: true } });
    console.log("✅ Total users:", totalUsers);

    const allUsersRanked = await prisma.user.findMany({
      select: { id: true },
      orderBy: { totalPoints: 'desc' }
    });
    
    const userRank = allUsersRanked.findIndex((u: any) => u.id === currentUser.id) + 1;
    console.log("✅ User rank calculated:", userRank);

    // 5. Build System Prompt
    console.log("Step 5: Building system prompt...");
    const systemPrompt = `You are an AI assistant for LeaderLab.
    
**User Profile:**
- Name: ${currentUser.fullName || 'User'}
- Rank: #${userRank} / ${totalUsers}
- Points: ${currentUser.totalPoints}
- Roles: ${currentUser.roles.map((r: any) => r.role).join(', ') || 'None'}

**Recent History:**
${currentUser.pointTxns.map((t: any) => `- ${t.source}: +${t.points}`).join('\n')}

**Leaderboard Context (Top 5):**
${topUsers.slice(0, 5).map((u: any, i: number) => `${i + 1}. ${u.fullName || 'Anonymous'} (${u.totalPoints} pts)`).join('\n')}

**Task:**
Analyze the user's standing. Give 1 specific tip to move up the rank. Answer the user's question directly. Be concise and motivating.`;

    console.log("Step 6: Calling Groq API...");
    console.log("API Key present:", !!groq.apiKey);
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile', 
      temperature: 0.7,
      max_tokens: 1024,
    });

    console.log("✅ Groq response received");
    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("Empty response from Groq AI");
    }

    console.log("✅ Success! Sending response to client");

    return NextResponse.json({
      response: responseContent,
      userContext: {
        rank: userRank,
        totalPoints: currentUser.totalPoints,
        totalUsers
      }
    });

  } catch (error: any) {
    console.error('🔥 CRITICAL ERROR:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Error status:', error?.status);
    
    if (error?.status === 401) {
      return NextResponse.json({ error: 'Invalid Groq API Key' }, { status: 500 });
    }

    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
      step: 'Check server logs for details'
    }, { status: 500 });
  }
}