"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ListChecks, X, Calendar, Link as LinkIcon } from 'lucide-react'

type Task = {
  id: string
  label: string
  hint?: string
  link?: string
  done?: boolean
}

const STORAGE_KEY = 'fl320-todo-v1'

export function ChecklistFab() {
  const [open, setOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'fl320_form', label: 'Draft FL‑320 Responsive Declaration', link: '/fl320-checklist' },
    { id: 'mpa', label: 'Memo of Points and Authorities', hint: 'Attach legal argument brief', link: '/rfo-comparison' },
    { id: 'decl_counsel', label: 'Declaration by Counsel', hint: 'Signed attorney declaration' },
    { id: 'decl_party', label: 'Declaration by Respondent', hint: 'Signed personal declaration', link: '/final-distribution' },
    { id: 'signature', label: 'Signatures Collected', hint: 'E‑signature or wet signature on all declarations', link: '/final-distribution' },
    { id: 'exhibit_index', label: 'Exhibit Index Generated', hint: 'Auto‑numbered list', link: '/exhibits/packet' },
    { id: 'exhibits_ready', label: 'Exhibits Attached', hint: 'All exhibits linked to claims' },
    { id: 'proof_service', label: 'Proof of Service Prepared', hint: 'Serve opposing party' },
    { id: 'deadline_set', label: 'Deadline Set', hint: 'Track hearing/filing dates' },
    { id: 'final_packet', label: 'Assemble Filing Packet (PDF)', hint: 'Binder with exhibit tabs (optional next step)' },
  ])
  const [deadline, setDeadline] = useState<string>('')

  // Load saved
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const s = JSON.parse(raw)
        if (Array.isArray(s.tasks)) setTasks(prev => prev.map(t => ({...t, done: !!s.tasks.find((x: any)=>x.id===t.id)?.done})))
        if (s.deadline) setDeadline(s.deadline)
      }
    } catch {}
  }, [])

  // Auto-detect some items
  useEffect(() => {
    async function hydrate() {
      try {
        const ex = await fetch('/api/exhibits/list')
        if (ex.ok) {
          const j = await ex.json()
          if ((j?.exhibits?.length || 0) > 0) mark('exhibit_index', true)
        }
      } catch {}
      try {
        const lr = await fetch('/api/case-financials/ledger', { cache: 'no-store' })
        if (lr.ok) mark('fl320_form', true)
      } catch {}
    }
    hydrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function mark(id: string, done: boolean) {
    setTasks(prev => prev.map(t => t.id===id ? { ...t, done } : t))
  }

  function save() {
    try {
      const out = { tasks: tasks.map(t=>({ id: t.id, done: !!t.done })), deadline }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(out))
    } catch {}
  }

  useEffect(save, [tasks, deadline])

  const progress = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t=>t.done).length
    const pct = Math.round((done/total)*100)
    return { total, done, pct }
  }, [tasks])

  const daysLeft = useMemo(() => {
    if (!deadline) return null
    const d = new Date(deadline)
    const now = new Date()
    return Math.ceil((d.getTime() - now.getTime()) / (1000*60*60*24))
  }, [deadline])

  return (
    <>
      {/* FAB */}
      <button
        aria-label="Open FL‑320 To‑Do"
        onClick={()=>setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors p-3 no-print"
      >
        <ListChecks className="h-6 w-6" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
          <div className="absolute right-4 bottom-4 w-[380px] max-w-[92vw] bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="font-semibold text-slate-800 text-sm">FL‑320 Filing Checklist</div>
              <button aria-label="Close" onClick={()=>setOpen(false)} className="text-slate-500 hover:text-black"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-3">
              {/* Progress */}
              <div className="mb-3">
                <div className="text-xs text-slate-600 mb-1">Progress: {progress.done}/{progress.total} ({progress.pct}%)</div>
                <div className="h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${progress.pct}%` }} />
                </div>
              </div>

              {/* Deadline */}
              <div className="mb-3 p-2 rounded border bg-slate-50">
                <div className="flex items-center gap-2 text-xs text-slate-700 mb-1"><Calendar className="h-3.5 w-3.5"/> Filing/ Hearing Deadline</div>
                <div className="flex items-center gap-2">
                  <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                  <div className="text-xs text-slate-600 min-w-[70px] text-right">{daysLeft!=null? `${daysLeft} d` : '—'}</div>
                </div>
              </div>

              {/* Tasks */}
              <div className="max-h-[50vh] overflow-auto pr-1 space-y-2">
                {tasks.map(t => (
                  <label key={t.id} className="flex items-start gap-2 border rounded p-2 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" className="mt-1" checked={!!t.done} onChange={e=>mark(t.id, e.target.checked)} />
                    <div className="text-sm">
                      <div className="font-medium text-slate-800 flex items-center gap-2">
                        {t.label}
                        {t.link && (
                          <a href={t.link} className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                            <LinkIcon className="h-3 w-3"/> open
                          </a>
                        )}
                      </div>
                      {t.hint && <div className="text-xs text-slate-600">{t.hint}</div>}
                    </div>
                  </label>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <button className="px-2 py-1 border rounded" onClick={()=>setTasks(ts=>ts.map(t=>({...t, done:true})))}>Mark all</button>
                <div className="text-slate-500">Saved locally · court‑ready</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

