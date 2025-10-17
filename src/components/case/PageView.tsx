"use client"
import React from 'react'

export function PageView({
  title,
  pages,
  pageClassName,
}: {
  title?: string
  pages: string[]
  pageClassName?: string
}) {
  return (
    <div className="page-layout-component">
      {title && (
        <div className="text-sm text-slate-600 mb-2">{title}</div>
      )}
      <div className="space-y-4">
        {pages.map((pg, i)=> (
          <div key={i} className={"relative bg-white border border-slate-200 rounded shadow-sm print:shadow-none print:border-slate-300 " + (pageClassName||'') }>
            <div className="absolute right-3 top-3 text-[10px] text-slate-400 print:hidden">Page {i+1}</div>
            <div className="min-h-[10.5in] p-8">
              <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-slate-800">{pg}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

