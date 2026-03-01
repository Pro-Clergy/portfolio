import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTransporter } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await connectDB();

  return NextResponse.json({
    status: 'ok',
    database: db ? 'connected' : 'in-memory',
    email: getTransporter() ? 'configured' : 'disabled',
  });
}
