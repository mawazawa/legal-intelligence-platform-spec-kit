import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function GET() {
  try {
    const p = path.resolve(process.cwd(), '..', 'case-financials', 'results', 'onepager.pdf')
    const buf = await fs.readFile(p)
    return new NextResponse(buf as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="onepager.pdf"'
      }
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'not found'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}

