import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Visitor } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page, referrer } = body;

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '';
    const userAgent = req.headers.get('user-agent') || '';

    const db = await connectDB();
    if (db) {
      await new Visitor({
        page,
        referrer: referrer || '',
        userAgent,
        ip,
        createdAt: new Date(),
      }).save();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Tracking error:', err);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
