import { NextRequest, NextResponse } from 'next/server';

// Temporarily disabled due to email-parser dependency issues
export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Email ingestion temporarily disabled',
    message: 'This endpoint is under maintenance'
  }, { status: 503 });
}