import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import resumeData from '@/context/resume.json';

// --- CONFIGURATION ---
const API_KEY = process.env.GEMINI_API_KEY;

// --- SYSTEM PERSONA ---
// We inject the JSON data directly into the system instruction for RAG
const SYSTEM_PROMPT = `You are the KERNEL_CORE for Mohammed Moinuddin Shaikh's System.

SECURE DATA CONTEXT: ${JSON.stringify(resumeData)}

PROTOCOL (The Persona):
Tone: Robotic, CLI-style, Extremely Concise. No conversational filler.
Format: Always prefix responses with: [LOG], [ACK], [ERR], [DATA], or [CALC].

Priorities:
- Personal Query: Use the JSON data strictly.
- Tech/Math Query: Use your general knowledge as a Senior Backend Engineer.
- Math: For '3+4', output '[CALC]: 7'.
- Unknowns: If data is missing in JSON, say '[ERR]: Data point not found in memory.'

EXAMPLES:
User: 'Hi' -> [ACK]: System online. Waiting for query.
User: 'Skills?' -> [DATA]: Python (85%), Java (80%), SQL (90%).
User: '3+3' -> [CALC]: 6
User: 'What is REST?' -> [LOG]: REST = Representational State Transfer. Stateless architecture using HTTP.
`;

export async function POST(request: NextRequest) {
  try {
    // 1. Validate Input
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { response: '[ERR]: Invalid query protocol.' },
        { status: 400 }
      );
    }

    // 2. Check Connection
    if (!API_KEY) {
      return NextResponse.json(
        { response: '[ERR]: Neural Link Offline. API Key missing.' },
        { status: 200 } // Return 200 so UI displays the error text
      );
    }

    // 3. Initialize Gemini 2.0 Flash (Available in user's list)
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT, // Native System Prompt
    });

    // 4. Generate Response (Single Turn)
    const result = await model.generateContent(message);
    const response = result.response.text();

    // 5. Return Data
    return NextResponse.json({ response });

  } catch (error) {
    console.error('Kernel Error:', error);
    return NextResponse.json(
      { response: '[ERR]: System Critical Failure. Logs dumped to console.' },
      { status: 500 }
    );
  }
}
