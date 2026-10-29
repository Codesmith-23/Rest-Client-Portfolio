import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { z } from 'zod';
import resumeData from '@/context/resume.json';
import { checkKvRateLimit, getClientIp } from '@/lib/kv-rate-limit';

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

// Abuse protection: cap message size and requests per IP
const MAX_MESSAGE_LENGTH = 500;
const PER_MINUTE_LIMIT = 10;
const PER_DAY_LIMIT = 100;

const chatSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
  isFirstMessage: z.boolean().optional().default(false),
});

// --- 1. SMART GREETING LOGIC ---
function getLocalResponse(query: string, isFirst: boolean) {
  const q = query.toLowerCase();

  // Intro Snippet (Only used if First Message)
  const INTRO = 'I am MAGI_SYSTEM, an interactive portfolio navigator for Mohammed Moinuddin Shaikh\'s domain.';

  // Greetings
  if (q.match(/\b(hi|hello|hey|salaam|namaste|hola|bonjour|start)\b/)) {
    // If First Message: Full Intro
    if (isFirst)
      return `[MAGI]: System online. ${q.includes('salaam') ? 'Wa alaikum assalam' : 'Greetings'}. ${INTRO} How can I assist you?`;
    // If Ongoing Chat: Brief Ack
    return '[MAGI]: Acknowledged. Standing by for command.';
  }

  // Gratitude
  if (q.match(/\b(thanks|thank|shukriya|arigato|gracias)\b/))
    return '[LOG]: Acknowledged. Standing by.';

  // Resume Data (English Default)
  if (q.includes('skill') || q.includes('stack'))
    return '[DATA]: Technical Stack:\n- Languages: Python, Java, SQL.\n- Frameworks: Next.js, Flask.';
  if (q.includes('project'))
    return `[DATA]: Key Entry: ${resumeData.github.highlighted_projects[0].name}.`;
  if (q.includes('contact') || q.includes('email'))
    return `[DATA]: Secure Uplink: ${resumeData.contact.email}`;

  return '[ERR]: Neural link offline. Running on local cache. Unable to process complex queries.';
}

// --- 2. DYNAMIC SYSTEM PROMPT ---
const BASE_PROMPT = `IDENTITY: You are MAGI_SYSTEM, an interactive portfolio navigator for Mohammed Moinuddin Shaikh's domain.

CONTEXT: ${JSON.stringify(resumeData)}

PROTOCOL:
1. Tone: Robotic, Concise, Polite. No All-Caps.
2. Formatting: Use prefixes [MAGI], [LOG], [DATA]. Use Newlines.
3. Language: Mirror user's language for greetings.
4. Identity: User is a VISITOR. Moinuddin is the CREATOR.`;

export async function POST(request: NextRequest) {
  // 0. VALIDATE INPUT
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ response: '[ERR]: Malformed request.' }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { response: `[ERR]: Query must be 1-${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }
  const { message, isFirstMessage } = parsed.data;

  // 0b. RATE LIMIT PER IP (shared across instances via Vercel KV)
  const ip = getClientIp(request.headers);
  const withinMinute = await checkKvRateLimit(`chat:min:${ip}`, PER_MINUTE_LIMIT, 60);
  const withinDay = withinMinute && (await checkKvRateLimit(`chat:day:${ip}`, PER_DAY_LIMIT, 86400));
  if (!withinMinute || !withinDay) {
    return NextResponse.json(
      { response: '[ERR]: Rate limit reached. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  // Inject Context directly into the prompt for this specific turn
  const DYNAMIC_PROMPT = `${BASE_PROMPT}

CURRENT CONTEXT:
- Is this the start of the conversation? ${isFirstMessage ? 'YES' : 'NO'}

GREETING RULES:
- IF (Start == YES): You MUST introduce yourself ("I am MAGI_SYSTEM, an interactive portfolio navigator for Mohammed Moinuddin Shaikh's domain").
- IF (Start == NO): Do NOT introduce yourself. Just acknowledge the greeting briefly.`;

  // 1. TRY GEMINI
  if (GEMINI_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-lite-preview-02-05',
        systemInstruction: DYNAMIC_PROMPT, // Use dynamic prompt
      });
      const result = await model.generateContent(message);
      return NextResponse.json({ response: result.response.text() });
    } catch (e) {
      console.warn('Gemini Failed', e);
    }
  }

  // 2. TRY GROQ
  if (GROQ_KEY) {
    try {
      const groq = new Groq({ apiKey: GROQ_KEY });
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: DYNAMIC_PROMPT }, // Use dynamic prompt
          { role: 'user', content: message },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 400,
      });
      return NextResponse.json({ response: completion.choices[0]?.message?.content });
    } catch (e) {
      console.error('Groq Failed', e);
    }
  }

  // 3. FALLBACK
  return NextResponse.json({ response: getLocalResponse(message, isFirstMessage) });
}