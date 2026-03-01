import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTransporter } from '@/lib/email';
import { validateEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  validateEnv();

  const db = await connectDB();

  return NextResponse.json({
    status: 'ok',
    database: db ? 'connected' : 'in-memory',
    email: getTransporter() ? 'configured' : 'disabled',
  });
}
