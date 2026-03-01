import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Visitor } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    /* ── Rate limit: 30 track events per minute per IP ── */
    const ip = getClientIp(req);
    const rl = rateLimit(ip, { limit: 30, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json({ success: true }); // silent drop
    }

    const body = await req.json();
    const page = typeof body.page === 'string' ? body.page.slice(0, 500) : '/';
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 1000) : '';
    const userAgent = (req.headers.get('user-agent') || '').slice(0, 500);

    const db = await connectDB();
    if (db) {
      await new Visitor({
        page,
        referrer,
        userAgent,
        ip,
        createdAt: new Date(),
      }).save();
    }

    return NextResponse.json({ success: true });
  } catch {
    // Tracking is non-critical — never fail the client
    return NextResponse.json({ success: true });
  }
}
