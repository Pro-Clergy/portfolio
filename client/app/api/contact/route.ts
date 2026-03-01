import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Message } from '@/lib/db';
import { sendContactEmail } from '@/lib/email';

/* Simple server-side validation */
function validate(body: Record<string, unknown>) {
  const errors: { field: string; msg: string }[] = [];

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name) errors.push({ field: 'name', msg: 'Name is required' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push({ field: 'email', msg: 'Valid email is required' });
  if (!message) errors.push({ field: 'message', msg: 'Message is required' });
  if (message.length > 5000)
    errors.push({ field: 'message', msg: 'Message must be under 5000 characters' });

  return { name, email, subject, message, errors };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, errors } = validate(body);

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    /* Save to database if available */
    const db = await connectDB();
    if (db) {
      await new Message({ name, email, subject, message }).save();
    }

    /* Send email notification */
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
