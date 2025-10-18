import { NextResponse } from 'next/server';
import { getEmailStats } from '@/lib/analytics/email-stats';

export async function GET() {
  try {
    const stats = await getEmailStats();
    return NextResponse.json(stats);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to compute email stats';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

