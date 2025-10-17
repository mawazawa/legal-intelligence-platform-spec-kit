import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file') || 'unknown';

  // Placeholder implementation to avoid client errors.
  // Wire this to your actual data source as needed.
  const text = `Source text for '${file}' is not yet connected.`;

  return NextResponse.json({ text });
}

