"use client"
import React from 'react'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded bg-slate-900 text-white text-sm px-3 py-1.5 hover:bg-slate-800 active:bg-slate-900"
      aria-label="Print this report"
    >
      Print
    </button>
  )
}

