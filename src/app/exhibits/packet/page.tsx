import React from 'react'
import fs from 'node:fs/promises'
import path from 'node:path'
import { SourceDrawer } from '@/components/case/SourceDrawer'

async function readSibling(...parts: string[]) {
  const p = path.resolve(process.cwd(), '..', ...parts)
  return p
}

export default async function ExhibitPacketPage() {
  let exhibits: any[] = []
  try {
    const p = await readSibling('case-financials','exhibits','exhibits.json')
    const raw = await fs.readFile(p, 'utf8')
    const data = JSON.parse(raw)
    exhibits = data?.exhibits || []
  } catch {}

  return (
    <div className="p-6 mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Exhibit Packet</h1>
      <div className="text-sm text-slate-600 mb-4">Auto-numbered exhibits assembled from the sources registry. Print this page for a cover sheet and table of contents.</div>
      <div className="rounded border bg-white">
        <div className="p-4 border-b font-medium">Table of Contents</div>
        <div>
          {exhibits.map((ex) => (
            <div key={ex.no} className="px-4 py-2 flex items-center justify-between border-t">
              <div className="text-sm">Exhibit {ex.no}: {ex.title}</div>
              <div className="text-xs text-slate-600">{ex.type} · {ex.pages || '—'} pages</div>
            </div>
          ))}
          {!exhibits.length && (
            <div className="px-4 py-6 text-sm text-slate-600">No exhibits yet. Add files via <a className="underline" href="/intake">Intake</a>.</div>
          )}
        </div>
      </div>
    </div>
  )
}

