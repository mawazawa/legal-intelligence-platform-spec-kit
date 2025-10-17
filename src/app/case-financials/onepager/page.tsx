import React from 'react'

export const dynamic = 'force-static'

export default async function Page() {
  // Simple HTML viewer for the generated PDF with a clean slug
  const pdfUrl = '/api/case-financials/onepager'
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Case Financials — One‑Pager</h1>
      <p className="text-sm text-muted-foreground">
        This is the polished one‑pager rendered at a stable slug. You can download the PDF or view it inline below.
      </p>
      <div className="flex gap-3 text-sm">
        <a className="text-blue-600 underline" href={pdfUrl} target="_blank" rel="noreferrer">Open PDF in new tab</a>
        <a className="text-blue-600 underline" href="/case-financials">Back to breakdown</a>
      </div>
      <div className="border rounded">
        <object data={pdfUrl} type="application/pdf" className="w-full" style={{height: '80vh'}}>
          <p className="p-4 text-sm">Unable to embed PDF in this browser. <a className="text-blue-600 underline" href={pdfUrl}>Click here to download</a>.</p>
        </object>
      </div>
    </div>
  )
}

