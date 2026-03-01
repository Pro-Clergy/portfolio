import { NextResponse } from 'next/server';
import { connectDB, Project } from '@/lib/db';
import { fallbackProjects } from '@/lib/projects-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();

    if (db) {
      const projects = await Project.find({ featured: true }).sort({ order: 1 }).lean();

      /* Seed default projects if collection is empty */
      if (projects.length === 0) {
        const docs = fallbackProjects.map(({ _id, ...p }) => p);
        await Project.insertMany(docs);
        const seeded = await Project.find({ featured: true }).sort({ order: 1 }).lean();
        return NextResponse.json(seeded);
      }

      return NextResponse.json(projects);
    }

    /* In-memory fallback */
    const sorted = [...fallbackProjects]
      .filter((p) => p.featured)
      .sort((a, b) => a.order - b.order);

    return NextResponse.json(sorted);
  } catch (err) {
    console.error('Error fetching projects:', err);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 },
    );
  }
}
