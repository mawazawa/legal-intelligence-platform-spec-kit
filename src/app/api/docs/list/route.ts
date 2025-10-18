import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function GET() {
  try {
    const p = path.resolve(process.cwd(), '..', 'case-financials', 'sources', 'index.json')
    const raw = await fs.readFile(p, 'utf8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ docs: [] })
  }
}

