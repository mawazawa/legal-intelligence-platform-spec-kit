"use client"
import React, { useEffect, useState } from 'react'

export function SourceDrawer({
  open,
  onClose,
  title,
  fileKey,
  range,
}: {
  open: boolean
  onClose: () => void
  title: string
  fileKey: string
  range?: { start: number; end: number }
}) {
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState<string>('')
  const start = range?.start
  const end = range?.end

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const url = new URL('/api/case-financials/source', window.location.origin)
    url.searchParams.set('file', fileKey)
    if (start && end) { url.searchParams.set('start', String(start)); url.searchParams.set('end', String(end)) }
    fetch(url.toString())
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => setText(data.text || ''))
      .catch(() => setText(''))
      .finally(() => setLoading(false))
  }, [open, fileKey, start, end])

  return (
    <div>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl p-4 overflow-auto">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm text-slate-600">Source</div>
                <div className="text-lg font-semibold tracking-tight">{title}</div>
              </div>
              <button className="no-print text-slate-600 hover:text-black" onClick={onClose} aria-label="Close">✕</button>
            </div>
            {loading ? (
              <div className="text-sm text-slate-500">Loading…</div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">{text}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

