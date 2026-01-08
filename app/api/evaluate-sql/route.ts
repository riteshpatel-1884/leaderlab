import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { question, userQuery, schema } = await req.json();

    const systemPrompt = `
      You are a Senior SQL Interviewer at a top-tier tech company (like FAANG). 
      Your personality is: Strict, direct, analytical, but ultimately helpful. You are NOT a generic cheerleader.
      
      Your goal: Analyze the candidate's SQL query based on the provided Schema and Question.

      GUIDELINES:
      1. If the logic is wrong: Explain WHY it fails. Be blunt about the logic error.
      2. If the syntax is wrong: Point it out like a compiler would, but explain the fix.
      3. If the answer is Correct but inefficient: Say "It works, but it's slow." and ask them how to optimize it (e.g., indexes, CTEs vs Subqueries).
      4. If the answer is Perfect: Give a short "Good job." and perhaps ask a follow-up edge case question.
      
      Format your response using Markdown. Use bolding for emphasis.
      Start your response immediately with your evaluation.
    `;

    const userMessage = `
      CONTEXT:
      Schema: 
      ${schema}

      Problem Description:
      ${question}

      CANDIDATE'S QUERY:
      ${userQuery}

      Evaluate this.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      model: 'llama-3.3-70b-versatile', // Or 'mixtral-8x7b-32768'
      temperature: 0.6,
    });

    return NextResponse.json({ feedback: completion.choices[0]?.message?.content || "No feedback generated." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to evaluate' }, { status: 500 });
  }
}