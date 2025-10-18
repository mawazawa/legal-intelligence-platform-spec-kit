import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { logger } from '@/lib/logging/logger'

export async function GET(request: Request) {
  // PERFORMANCE DEBUG: Log who is calling this endpoint
  const referer = request.headers.get('referer') || 'unknown';
  logger.debug('Exhibits list API called', { referer });

  try {
    const p = path.resolve(process.cwd(), '..', 'case-financials', 'exhibits', 'exhibits.json')
    const raw = await fs.readFile(p, 'utf8')
    return new NextResponse(raw, { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } })
  } catch {
    return NextResponse.json({ exhibits: [] })
  }
}

