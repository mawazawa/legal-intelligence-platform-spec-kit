import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { PrintButton } from '@/components/case/PrintButton'
import { Formula } from '@/components/case/Formula'

async function readSibling(...parts: string[]) {
  const p = path.resolve(process.cwd(), '..', ...parts)
  return p
}

export default async function ReportPage() {
  let ledger: any = null
  try {
    const p = await readSibling('case-financials','results','ledger.json')
    const raw = await fs.readFile(p,'utf8')
    ledger = JSON.parse(raw)
  } catch {}

  const r = (n: number | undefined) => typeof n === 'number' ? n.toLocaleString('en-US',{style:'currency',currency:'USD'}) : '—'

  return (
    <div className="p-6">
      <div className="paper">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Distribution Schedule — Court Report</h1>
            <div className="text-sm text-slate-600">From‑the‑Pot Variant (Latest Logic)</div>
          </div>
          <PrintButton />
        </div>

        <div className="rounded border border-slate-200 p-4 mb-6 no-break">
          <div className="text-sm text-slate-600">Final Totals</div>
          <div className="text-xl font-semibold tracking-tight">Respondent {r(ledger?.root?.value?.respondent)} · Petitioner {r(ledger?.root?.value?.petitioner)}</div>
          <div className="text-sm text-slate-600">Total after Form 593 removal: <span className="font-medium tracking-tight">{r(ledger?.root?.value?.total)}</span></div>
        </div>

        {/* Closing statement build-up */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Closing Statement Build‑up</h2>
          <div className="text-sm">Sale price: {r(ledger?.root?.children?.[0]?.value?.sale_price)} · Due to Seller: {r(ledger?.root?.children?.[0]?.value?.due_to_seller)}</div>
          <ul className="list-disc ml-6 mt-2 text-sm">
            {ledger?.root?.children?.[0]?.items?.map((it:any, idx:number)=>(
              <li key={idx} className="mb-0.5">{it.label}: <strong>{r(it.amount)}</strong></li>
            ))}
          </ul>
        </section>

        {/* SOD constructive net */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">SOD Constructive Net and 65/35</h2>
          <div className="text-sm">Constructive net: {r(ledger?.root?.children?.[1]?.value?.constructive_net)} · R 65%: {r(ledger?.root?.children?.[1]?.value?.r65)} · P 35%: {r(ledger?.root?.children?.[1]?.value?.p35)}</div>
          {ledger?.root?.children?.[1]?.formulas?.map((f:string, i:number)=>(<Formula key={i}>{f}</Formula>))}
        </section>

        {/* Equal arrears */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Equal Sharing of Arrears</h2>
          <div className="text-sm">Total arrears: {r(ledger?.root?.children?.[2]?.value?.arrears_total)} → Each: {r(ledger?.root?.children?.[2]?.value?.each)}</div>
          {ledger?.root?.children?.[2]?.formulas?.[0] && (<Formula>{ledger.root.children[2].formulas[0]}</Formula>)}
        </section>

        {/* SOD payouts */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">SOD Payouts to Petitioner (as ordered)</h2>
          <ul className="list-disc ml-6 mt-2 text-sm">
            {ledger?.root?.children?.[3]?.items?.map((it:any, idx:number)=>(
              <li key={idx} className="mb-1">
                <div>{it.label}: <strong>{r(it.amount)}</strong></div>
                {it.formula && <Formula>{it.formula}</Formula>}
              </li>
            ))}
          </ul>
        </section>

        {/* Symmetry & possession */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Symmetry & Possession Adjustments</h2>
          <ul className="list-disc ml-6 mt-2 text-sm">
            {ledger?.root?.children?.[4]?.items?.map((it:any, idx:number)=>(
              <li key={idx} className="mb-1">
                <div>{it.label}: <strong>{r(it.amount)}</strong></div>
                {it.formula && <Formula>{it.formula}</Formula>}
              </li>
            ))}
          </ul>
        </section>

        {/* From the pot */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Remove Respondent Form 593 from Pot (mirror Petitioner)</h2>
          <ul className="list-disc ml-6 mt-2 text-sm">
            {ledger?.root?.children?.[5]?.items?.map((it:any, idx:number)=>(
              <li key={idx} className="mb-1">
                <div>{it.label}{it.amount?<>: <strong>{r(it.amount)}</strong></>:null}</div>
                {it.formula && <Formula>{it.formula}</Formula>}
              </li>
            ))}
          </ul>
        </section>

        {/* Sources footer */}
        <div className="text-xs text-slate-600">
          Sources: schedule.md · closing statement extract · SOD OCR · withholding evidence (emails)
        </div>
      </div>
    </div>
  )
}

