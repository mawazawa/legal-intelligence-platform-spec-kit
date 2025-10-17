import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const MAP: Record<string, string> = {
  closing_statement: path.resolve(process.cwd(), '..', 'case-financials', 'results', 'closing-statement-extract.txt'),
  sod: path.resolve(process.cwd(), '..', 'legal-intelligence-platform', 'Judgment_copy_2_OCR.txt'),
  withholding_emails: path.resolve(process.cwd(), '..', 'case-financials', 'results', 'withholding-evidence.md'),
  schedule: path.resolve(process.cwd(), '..', 'case-financials', 'results', 'schedule.md'),
}

async function readLatestIngested(kind: string): Promise<{ text: string, meta?: any } | null> {
  // kind e.g. 'petitioner/rfo' or 'respondent/fl320'
  try {
    const idxPath = path.resolve(process.cwd(), '..', 'case-financials', 'sources', 'index.json')
    const raw = await fs.readFile(idxPath, 'utf8')
    const idx = JSON.parse(raw)
    const docs = (idx?.docs || []).filter((d: any) => d?.type === kind)
    if (!docs.length) return null
    docs.sort((a: any, b: any) => String(b.date).localeCompare(String(a.date)))
    const latest = docs[0]
    const base = path.resolve(process.cwd(), '..', 'case-financials', 'sources', latest.path)
    const pagesDir = path.join(base, 'pages')
    const files = (await fs.readdir(pagesDir)).filter(f => f.endsWith('.txt')).sort()
    const parts: string[] = []
    for (let i=0; i<files.length; i++) {
      const p = path.join(pagesDir, files[i])
      const t = await fs.readFile(p, 'utf8')
      parts.push(`\n--- Page ${i+1} ---\n`)
      parts.push(t)
    }
    return { text: parts.join('\n'), meta: latest }
  } catch (e) {
    return null
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('file') || 'closing_statement'
  const start = parseInt(searchParams.get('start') || '', 10)
  const end = parseInt(searchParams.get('end') || '', 10)
  const file = MAP[key]
  let text: string | null = null
  let meta: any = undefined
  if (key === 'petitioner_rfo') {
    const latest = await readLatestIngested('petitioner/rfo')
    if (!latest) return NextResponse.json({ error: 'no ingested petitioner/rfo found' }, { status: 404 })
    text = latest.text
    meta = latest.meta
  } else if (key === 'respondent_fl320') {
    const latest = await readLatestIngested('respondent/fl320')
    if (!latest) return NextResponse.json({ error: 'no ingested respondent/fl320 found' }, { status: 404 })
    text = latest.text
    meta = latest.meta
  } else if (key === 'petitioner_declaration') {
    const latest = await readLatestIngested('petitioner/declaration')
    if (!latest) return NextResponse.json({ error: 'no ingested petitioner/declaration found' }, { status: 404 })
    text = latest.text
    meta = latest.meta
  } else if (key === 'petitioner_memo') {
    const latest = await readLatestIngested('petitioner/memo')
    if (!latest) return NextResponse.json({ error: 'no ingested petitioner/memo found' }, { status: 404 })
    text = latest.text
    meta = latest.meta
  } else if (!file) {
    return NextResponse.json({ error: 'unknown file' }, { status: 400 })
  }
  try {
    if (text == null) {
      text = await fs.readFile(file, 'utf8')
    }
    const lines = text.split(/\r?\n/)
    let snippet = text
    let range: number[] | undefined
    if (!Number.isNaN(start) && !Number.isNaN(end) && start >= 1 && end >= start) {
      snippet = lines.slice(start - 1, end).join('\n')
      range = [start, end]
    }
    return NextResponse.json({ key, file: file || meta?.path, meta, range, text: snippet })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'read failed' }, { status: 500 })
  }
}
