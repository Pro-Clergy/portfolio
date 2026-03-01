import { NextResponse } from 'next/server';
import { connectDB, Visitor, Message, Project } from '@/lib/db';
import { fallbackProjects } from '@/lib/projects-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();

    if (db) {
      const [visitors, messages, projects] = await Promise.all([
        Visitor.countDocuments(),
        Message.countDocuments(),
        Project.countDocuments({ featured: true }),
      ]);
      return NextResponse.json({ visitors, messages, projects });
    }

    return NextResponse.json({
      visitors: 0,
      messages: 0,
      projects: fallbackProjects.filter((p) => p.featured).length,
    });
  } catch (err) {
    console.error('Stats error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 },
    );
  }
}
