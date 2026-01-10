import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Verdict, Difficulty } from "@prisma/client";

// Map difficulty strings to Prisma enum
function mapDifficulty(difficulty: string): Difficulty {
  switch (difficulty.toUpperCase()) {
    case "EASY":
      return Difficulty.EASY;
    case "MEDIUM":
      return Difficulty.MEDIUM;
    case "HARD":
      return Difficulty.HARD;
    default:
      return Difficulty.MEDIUM;
  }
}

// Extract verdict from feedback
function extractVerdict(feedback: string): Verdict {
  const lowerFeedback = feedback.toLowerCase();
  
  if (lowerFeedback.includes("correct") || lowerFeedback.includes("✓")) {
    return Verdict.PASS;
  }
  
  if (lowerFeedback.includes("wrong") || lowerFeedback.includes("incorrect") || 
      lowerFeedback.includes("✗")) {
    return Verdict.FAIL;
  }
  
  return Verdict.WEAK;
}

export async function POST(req: NextRequest) {
  try {
    const { 
      question, 
      schema, 
      userQuery, 
      followUp, 
      conversationHistory, 
      userResponse,
      questionId,
      difficulty,
      topic,
      clerkUserId,
      attemptNumber, // Track which attempt this is (1, 2, or 3)
      isCorrect, // Track if initial submission was correct
      hasAskedFollowUp // Track if AI already asked a follow-up
    } = await req.json();

    if (!question || !schema || !userQuery) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check cooldown status if this is first submission (not follow-up)
    if (!followUp && clerkUserId && questionId) {
      try {
        const user = await prisma.user.findUnique({
          where: { clerkUserId: clerkUserId },
        });

        if (user) {
          const dbQuestionId = `sql-${questionId}`;
          const attempt = await prisma.userQuestionAttempt.findUnique({
            where: {
              userId_questionId: {
                userId: user.id,
                questionId: dbQuestionId,
              },
            },
          });

          // Check if user is in cooldown period
          if (attempt && attempt.cooldownUntil && new Date() < attempt.cooldownUntil) {
            const hoursLeft = Math.ceil((attempt.cooldownUntil.getTime() - Date.now()) / (1000 * 60 * 60));
            return NextResponse.json({
              feedback: `⏳ **COOLDOWN ACTIVE**\n\nYou failed this question previously. You can retry after **${hoursLeft} hours**.\n\nUse this time to:\n- Review SQL concepts\n- Practice similar problems\n- Study the schema carefully\n\nCome back stronger! 💪`,
              cooldown: true,
              cooldownUntil: attempt.cooldownUntil.toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Cooldown check error:", err);
      }
    }

    let prompt;
    let shouldLockQuestion = false;
    let cooldownUntil = null;
    let shouldAskFollowUp = false;
    
    if (followUp && conversationHistory && userResponse) {
      // This is a follow-up conversation
      if (isCorrect) {
        // User already passed - just answer their question
        prompt = `SQL Problem: ${question}

Schema:
${schema}

User's Correct Query:
${userQuery}

The user's SQL query was CORRECT. They are now asking a follow-up question about the problem.

Previous conversation:
${conversationHistory.slice(-4).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

User: ${userResponse}

RULES:
1. Answer their question briefly (2-3 sentences max)
2. Be helpful and educational
3. DO NOT ask any more questions - just answer
4. Keep it concise`;
      } else if (hasAskedFollowUp) {
        // AI already asked a follow-up, this is the user's response to it
        prompt = `SQL Problem: ${question}

Schema:
${schema}

Previous conversation:
${conversationHistory.slice(-4).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

User: ${userResponse}

RULES:
1. Evaluate their response briefly (1-2 sentences)
2. If correct, say "Good!" or "Correct!"
3. If wrong, give a brief correction
4. DO NOT ask another follow-up question
5. End the conversation here`;
      } else {
        // User is asking for help (hint request or clarification)
        prompt = `SQL Problem: ${question}

Schema:
${schema}

User's Current Query:
${userQuery}

Previous feedback:
${conversationHistory.slice(-2).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

User: ${userResponse}

RULES:
1. Look at their current query and the feedback given
2. Give ONE specific, actionable hint (2-3 sentences max)
3. Don't reveal the full answer
4. Point them in the right direction
5. Be encouraging`;
      }
    } else {
      // Initial submission or retry attempt
      const currentAttempt = attemptNumber || 1;
      
      if (currentAttempt === 3) {
        // Third attempt - give answer and lock
        prompt = `Evaluate this SQL query (THIRD AND FINAL ATTEMPT):

Problem: ${question}

Schema:
${schema}

User's Query:
${userQuery}

RULES FOR THIRD ATTEMPT:
1. Start with "**WRONG**" if incorrect, or "**CORRECT**" if correct
2. If WRONG:
   - Show the COMPLETE CORRECT SQL query in a code block
   - Explain it in 2-3 sentences
   - Say "This question is now locked for 24 hours."
3. If CORRECT:
   - Say "Correct!" and briefly explain why (2-3 sentences)
   - Ask ONE follow-up question ONLY IF the problem requires conceptual understanding
   - For simple problems, just congratulate and don't ask follow-up

Keep it SHORT and PRECISE.`;
      } else {
        // First or second attempt
        const remainingAttempts = 3 - currentAttempt;
        prompt = `Evaluate this SQL query (Attempt ${currentAttempt} of 3):

Problem: ${question}

Schema:
${schema}

User's Query:
${userQuery}

RULES:
1. Start with "**CORRECT**" or "**WRONG**"
2. If CORRECT:
   - Say "Correct!" and briefly explain why (2-3 sentences)
   - Ask ONE follow-up question ONLY IF the problem requires conceptual understanding (e.g., for complex joins, window functions, subqueries)
   - For simple problems (basic SELECT, WHERE), just congratulate and don't ask follow-up
3. If WRONG:
   - Give ONE specific hint (don't reveal the answer)
   - Say "You have ${remainingAttempts} attempt(s) remaining. Try again!"

Keep response under 5 lines.`;
      }
    }

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json(
        { error: "Failed to evaluate query" },
        { status: 500 }
      );
    }

    const data = await response.json();
    let feedback = data.choices[0]?.message?.content || "Unable to generate feedback";
    const verdict = extractVerdict(feedback);

    let finalVerdict = verdict;
    let failureCount = 0;
    const currentAttempt = attemptNumber || 1;

    // Check if AI asked a follow-up question
    const aiAskedFollowUp = feedback.includes('?') && verdict === Verdict.PASS && !followUp;

    // Store in database
    if (clerkUserId && questionId && difficulty && topic && !followUp) {
      try {
        const user = await prisma.user.upsert({
          where: { clerkUserId: clerkUserId },
          update: {},
          create: { clerkUserId: clerkUserId, name: null },
        });

        const subject = await prisma.subject.upsert({
          where: { slug: topic.toLowerCase().replace(/\s+/g, '-') },
          update: {},
          create: {
            name: topic,
            slug: topic.toLowerCase().replace(/\s+/g, '-'),
            isActive: true,
          },
        });

        const dbQuestion = await prisma.question.upsert({
          where: { id: `sql-${questionId}` },
          update: {},
          create: {
            id: `sql-${questionId}`,
            subjectId: subject.id,
            difficulty: mapDifficulty(difficulty),
            isActive: true,
          },
        });

        // Get existing attempt
        const existingAttempt = await prisma.userQuestionAttempt.findUnique({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: dbQuestion.id,
            },
          },
        });

        failureCount = existingAttempt?.failureCount || 0;

        // Determine final verdict and locking
        if (verdict === Verdict.PASS) {
          // User passed
          finalVerdict = Verdict.PASS;
          cooldownUntil = null;
          failureCount = 0;
        } else if (currentAttempt >= 3) {
          // Failed on third attempt - lock question
          finalVerdict = Verdict.FAIL;
          failureCount = failureCount + 1;
          const cooldownHours = 24; // Always 24 hours for first failure
          cooldownUntil = new Date(Date.now() + cooldownHours * 60 * 60 * 1000);
          shouldLockQuestion = true;
          
          feedback += `\n\n⏳ **Question Locked for 24 hours**\n\nStudy the solution above and retry after the cooldown period.`;
        } else {
          // Failed but has more attempts
          finalVerdict = Verdict.WEAK;
        }

        // ALWAYS update the database for any submission (not just PASS or FAIL)
        await prisma.userQuestionAttempt.upsert({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: dbQuestion.id,
            },
          },
          update: {
            verdict: finalVerdict,
            attemptedAt: new Date(),
            cooldownUntil: cooldownUntil,
            failureCount: failureCount,
          },
          create: {
            userId: user.id,
            questionId: dbQuestion.id,
            subjectId: subject.id,
            verdict: finalVerdict,
            cooldownUntil: cooldownUntil,
            failureCount: failureCount,
          },
        });

        // Update subject summary
        const allAttempts = await prisma.userQuestionAttempt.findMany({
          where: { userId: user.id, subjectId: subject.id },
        });

        const solvedCount = allAttempts.filter(a => a.verdict === Verdict.PASS).length;
        const failedCount = allAttempts.filter(a => a.verdict === Verdict.FAIL).length;

        await prisma.userSubjectSummary.upsert({
          where: {
            userId_subjectId: {
              userId: user.id,
              subjectId: subject.id,
            },
          },
          update: {
            solvedCount,
            failedCount,
            lastActivity: new Date(),
          },
          create: {
            userId: user.id,
            subjectId: subject.id,
            solvedCount,
            failedCount,
            lastActivity: new Date(),
          },
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    }

    return NextResponse.json({ 
      feedback,
      cooldown: shouldLockQuestion,
      cooldownUntil: cooldownUntil?.toISOString(),
      isCorrect: verdict === Verdict.PASS,
      hasAskedFollowUp: aiAskedFollowUp,
      attemptNumber: followUp ? attemptNumber : currentAttempt
    });
  } catch (error) {
    console.error("Error evaluating SQL:", error);
    return NextResponse.json(
      { error: "Failed to evaluate query" },
      { status: 500 }
    );
  }
}