"use client"
import React, { useState } from 'react'
import { SourceDrawer } from '@/components/case/SourceDrawer'

type Issue = {
  title: string
  claim: string
  response: string
  formula?: string
  sources?: { key: string; label: string; range?: { start: number; end: number } }[]
}

export function SideBySide({ issues }: { issues: Issue[] }) {
  const [drawer, setDrawer] = useState<{open:boolean; key:string; title:string; range?:{start:number;end:number}}|null>(null)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Petitioner column */}
      <div className="rounded border border-slate-200 p-4 soft-shadow bg-white">
        <div className="text-sm text-slate-600">Petitioner — RFO (FL‑300)</div>
        <h2 className="text-lg font-semibold tracking-tight mb-2">Requested Orders & Calculations</h2>
        {issues.map((it, idx)=> (
          <div key={idx} className="mb-4 no-break">
            <div className="text-sm font-medium mb-1">{it.title}</div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{it.claim}</div>
            {it.sources?.length ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {it.sources.map((s, i) => (
                  <button key={i} className="text-[10px] leading-none px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200" onClick={()=>setDrawer({open:true, key:s.key, title:s.label, range:s.range})}>{s.label}</button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Respondent column */}
      <div className="rounded border border-slate-200 p-4 soft-shadow bg-white">
        <div className="text-sm text-slate-600">Respondent — Responsive Declaration (FL‑320)</div>
        <h2 className="text-lg font-semibold tracking-tight mb-2">Point‑by‑Point Response & Evidence</h2>
        {issues.map((it, idx)=> (
          <div key={idx} className="mb-4 no-break">
            <div className="text-sm font-medium mb-1">{it.title}</div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{it.response}</div>
            {it.formula && (<div className="mt-1"><code className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-0.5 tabular-nums">{it.formula}</code></div>)}
            {it.sources?.length ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {it.sources.map((s, i) => (
                  <button key={i} className="text-[10px] leading-none px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200" onClick={()=>setDrawer({open:true, key:s.key, title:s.label, range:s.range})}>source</button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <SourceDrawer open={!!drawer?.open} onClose={()=>setDrawer(null)} title={drawer?.title || ''} fileKey={drawer?.key || 'closing_statement'} range={drawer?.range} />
    </div>
  )
}

