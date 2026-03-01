import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Message } from '@/lib/db';
import { sendContactEmail } from '@/lib/email';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

/* Server-side validation */
function validate(body: Record<string, unknown>) {
  const errors: { field: string; msg: string }[] = [];

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || name.length < 2)
    errors.push({ field: 'name', msg: 'Name must be at least 2 characters' });
  if (name.length > 100)
    errors.push({ field: 'name', msg: 'Name must be under 100 characters' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push({ field: 'email', msg: 'Valid email is required' });
  if (subject.length > 200)
    errors.push({ field: 'subject', msg: 'Subject must be under 200 characters' });
  if (!message || message.length < 10)
    errors.push({ field: 'message', msg: 'Message must be at least 10 characters' });
  if (message.length > 5000)
    errors.push({ field: 'message', msg: 'Message must be under 5,000 characters' });

  return { name, email, subject, message, errors };
}

export async function POST(req: NextRequest) {
  try {
    /* ── Rate limit: 3 contact submissions per minute per IP ── */
    const ip = getClientIp(req);
    const rl = rateLimit(ip, { limit: 3, windowSeconds: 60 });
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

    /* ── Honeypot: reject if hidden field is filled (bot trap) ── */
    if (body.website) {
      // Bots fill this hidden field; real users don't see it
      return NextResponse.json(
        { success: true, message: 'Message sent successfully!' },
        { status: 201 },
      );
    }

    const { name, email, subject, message, errors } = validate(body);

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    /* ── Save to database ── */
    const db = await connectDB();
    if (db) {
      await new Message({ name, email, subject, message }).save();
    }

    /* ── Send email notification ── */
    try {
      await sendContactEmail({ name, email, subject, message });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
      /* Don't fail the request if email fails — the message is saved */
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 201 },
    );
  } catch (err) {
    console.error('Contact error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 },
    );
  }
}
