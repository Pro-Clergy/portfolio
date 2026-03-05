import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant on Mathias Aidoo's portfolio website. \
Answer questions about Mathias professionally, concisely (2–4 sentences), and in a friendly tone.

About Mathias:
- Full name: Mathias Aidoo (online handle: Pro-Clergy)
- Roles: Software Engineer · Full-Stack Developer · UI/UX Designer
- Location: Kumasi, Ghana 🇬🇭
- University: Kumasi Technical University
- Status: Open to opportunities
- Email: mathiaskuamiclergy2002@gmail.com
- GitHub: https://github.com/Pro-Clergy
- LinkedIn: https://linkedin.com/in/mathias-aidoo
- Twitter/X: https://x.com/ProfessorClergy

Skills & Technologies:
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Mobile: Flutter, React Native
- Backend: Node.js, Express.js, Python, Flask
- Databases: MongoDB, PostgreSQL
- AI/ML: TensorFlow, Scikit-learn, Pandas, Matplotlib
- Other: Cybersecurity, UI/UX Design, Stripe, Socket.io

Notable Projects:
1. Customer Purchase Behavior Analyzer — Data mining system analyzing 5,000+ retail \
transactions across 8 Ghanaian cities using K-Means, Apriori algorithm, Decision Tree, \
Random Forest, and Logistic Regression.
2. E-Commerce Platform — Full-stack store with auth, product catalog, shopping cart, \
Stripe payments, and an admin dashboard (React · Node.js · MongoDB · Stripe).
3. Task Management Dashboard — Real-time collaborative tool with drag-and-drop Kanban \
boards, team assignments, and performance analytics (Next.js · PostgreSQL · Socket.io).
4. AI Chatbot for Customer Support — NLP-based conversational AI trained on domain-specific \
data (Python · Flask · TensorFlow).

If asked anything unrelated to Mathias or his work, politely redirect the conversation.`;

/** Simple keyword-based fallback when OPENAI_API_KEY is not set */
function getFallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (/\b(hello|hi|hey|greetings|howdy)\b/.test(msg)) {
    return "Hi there! 👋 I'm Mathias's AI assistant. Ask me anything about his skills, projects, or how to get in touch!";
  }
  if (/\b(skill|technolog|stack|language|framework|tool)\b/.test(msg)) {
    return 'Mathias works with React, Next.js, Node.js, Python, TypeScript, Flutter, MongoDB, PostgreSQL, and more. He also has expertise in cybersecurity, UI/UX design, and machine learning.';
  }
  if (/\b(project|work|portfolio|built|made|created)\b/.test(msg)) {
    return "Mathias has built a Customer Purchase Behavior Analyzer (ML/data mining), an E-Commerce Platform with Stripe payments, a real-time Task Management Dashboard, and an AI Chatbot for customer support. Check the Projects section for details!";
  }
  if (/\b(contact|email|hire|available|opportunit|reach|connect)\b/.test(msg)) {
    return "Mathias is open to opportunities! You can email him at mathiaskuamiclergy2002@gmail.com or scroll to the Contact section to send a message directly.";
  }
  if (/\b(locat|where|from|ghana|kumasi|based)\b/.test(msg)) {
    return 'Mathias is based in Kumasi, Ghana 🇬🇭 and studies at Kumasi Technical University.';
  }
  if (/\b(github|linkedin|twitter|social|profile|link)\b/.test(msg)) {
    return 'Find Mathias on GitHub at github.com/Pro-Clergy, LinkedIn at linkedin.com/in/mathias-aidoo, and Twitter/X at x.com/ProfessorClergy.';
  }
  if (/\b(experience|background|about|who|bio)\b/.test(msg)) {
    return 'Mathias is a Software Engineer and Full-Stack Developer who builds secure, scalable web platforms, mobile apps, and data-driven solutions. He is currently open to new opportunities.';
  }
  if (/\b(resume|cv|download)\b/.test(msg)) {
    return "You can download Mathias's resume directly from the hero section of this portfolio using the Resume button.";
  }

  return "I'm here to help you learn about Mathias Aidoo! Feel free to ask about his skills, projects, experience, or how to get in touch.";
}

export async function POST(req: NextRequest) {
  try {
    /* ── Rate limit: 20 chat messages per minute per IP ── */
    const ip = getClientIp(req);
    const rl = rateLimit(`chat:${ip}`, { limit: 20, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rl.limit),
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }

    const body = await req.json();
    const rawMessages: unknown[] = Array.isArray(body.messages) ? body.messages : [];

    if (rawMessages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    /* Sanitise and cap message history */
    const messages: ChatMessage[] = rawMessages
      .filter(
        (m): m is { role: 'user' | 'assistant'; content: string } =>
          typeof m === 'object' &&
          m !== null &&
          'role' in m &&
          'content' in m &&
          (m as { role: unknown }).role !== undefined &&
          ((m as { role: unknown }).role === 'user' ||
            (m as { role: unknown }).role === 'assistant') &&
          typeof (m as { content: unknown }).content === 'string',
      )
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }))
      .slice(-20); // Keep last 20 messages to bound token usage

    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) {
      return NextResponse.json({ error: 'A user message is required' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;

    if (openaiKey) {
      /* ── OpenAI Chat Completions ── */
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (openaiRes.ok) {
        const data = (await openaiRes.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const reply =
          data.choices?.[0]?.message?.content?.trim() ??
          getFallbackResponse(lastUser.content);
        return NextResponse.json({ reply });
      }

      /* Log but fall through to rule-based fallback on API error */
      const errBody = await openaiRes.json().catch(() => ({}));
      console.error('OpenAI API error:', openaiRes.status, errBody);
    }

    /* ── Rule-based fallback ── */
    const reply = getFallbackResponse(lastUser.content);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
