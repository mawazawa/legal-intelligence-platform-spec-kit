import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const files = data.getAll('files') as File[]
    if (!files?.length) {
      return NextResponse.json({ error: 'no files' }, { status: 400 })
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const inboxRel = path.join('intake', 'inbox', stamp)
    const inboxAbs = path.resolve(process.cwd(), '..', inboxRel)
    await fs.mkdir(inboxAbs, { recursive: true })

    for (const f of files) {
      const arrayBuf = await f.arrayBuffer()
      const buf = Buffer.from(arrayBuf)
      const safe = f.name.replace(/[^A-Za-z0-9._-]+/g, '_') || 'upload.pdf'
      await fs.writeFile(path.join(inboxAbs, safe), buf)
    }

    // Run organizer synchronously for now (YAGNI); capture output
    const script = path.resolve(process.cwd(), '..', 'tools', 'intake', 'organize.py')
    const proc = spawnSync('python3', [script, '--inbox', inboxRel], {
      cwd: path.resolve(process.cwd(), '..'),
      encoding: 'utf-8',
      env: process.env,
      timeout: 1000 * 60 * 5,
    })
    if (proc.error) {
      return NextResponse.json({ error: String(proc.error), stderr: proc.stderr }, { status: 500 })
    }
    if (proc.status !== 0) {
      return NextResponse.json({ error: 'organizer failed', code: proc.status, stderr: proc.stderr }, { status: 500 })
    }
    let out: Record<string, unknown> = {}
    try { out = JSON.parse(proc.stdout || '{}') as Record<string, unknown> } catch { /* ignore parse errors */ }
    return NextResponse.json({ ok: true, inbox: inboxRel, organizer: out })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'upload failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

