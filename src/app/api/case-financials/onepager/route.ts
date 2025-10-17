import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function GET() {
  try {
    const p = path.resolve(process.cwd(), '..', 'case-financials', 'results', 'onepager.pdf')
    const buf = await fs.readFile(p)
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="onepager.pdf"'
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'not found' }, { status: 404 })
  }
}

