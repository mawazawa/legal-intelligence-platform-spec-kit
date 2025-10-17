import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function GET() {
  try {
    const p = path.resolve(process.cwd(), '..', 'case-financials', 'results', 'schedule.md')
    const text = await fs.readFile(p, 'utf8')
    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8'
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'not found' }, { status: 404 })
  }
}

