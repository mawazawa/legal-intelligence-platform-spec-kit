import { NextResponse } from 'next/server';
import { getEmailStats } from '@/lib/analytics/email-stats';

export async function GET() {
  try {
    const stats = await getEmailStats();
    return NextResponse.json(stats);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to compute email stats' }, { status: 500 });
  }
}

