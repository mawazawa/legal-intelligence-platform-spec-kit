import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const MAP: Record<string, string> = {
  closing_statement: path.resolve(process.cwd(), '..', 'case-financials', 'results', 'closing-statement-extract.txt'),
  sod: path.resolve(process.cwd(), '..', 'legal-intelligence-platform', 'Judgment_copy_2_OCR.txt'),
  withholding_emails: path.resolve(process.cwd(), '..', 'case-financials', 'results', 'withholding-evidence.md'),
  schedule: path.resolve(process.cwd(), '..', 'case-financials', 'results', 'schedule.md'),
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('file') || 'closing_statement'
  const start = parseInt(searchParams.get('start') || '', 10)
  const end = parseInt(searchParams.get('end') || '', 10)
  const file = MAP[key]
  if (!file) return NextResponse.json({ error: 'unknown file' }, { status: 400 })
  try {
    const text = await fs.readFile(file, 'utf8')
    const lines = text.split(/\r?\n/)
    let snippet = text
    let range: number[] | undefined
    if (!Number.isNaN(start) && !Number.isNaN(end) && start >= 1 && end >= start) {
      snippet = lines.slice(start - 1, end).join('\n')
      range = [start, end]
    }
    return NextResponse.json({ key, file, range, text: snippet })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'read failed' }, { status: 500 })
  }
}

