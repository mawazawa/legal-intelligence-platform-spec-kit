"use client"
import React from 'react'

export function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-1 text-xs font-mono tabular-nums tracking-tight leading-5 text-slate-700 bg-slate-50/80 border border-slate-200 rounded px-2 py-1">
      {children}
    </div>
  )
}
