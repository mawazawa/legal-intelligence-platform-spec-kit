import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { PrintButton } from '@/components/case/PrintButton'
import { Formula } from '@/components/case/Formula'

interface LedgerItem {
  label: string
  amount?: number
  formula?: string
}

interface LedgerValue {
  [key: string]: number | undefined
}

interface LedgerNode {
  value?: LedgerValue
  items?: LedgerItem[]
  formulas?: string[]
  children?: LedgerNode[]
}

interface Ledger {
  root?: LedgerNode
}

// Currency formatter (DRY - shared with side-by-side page)
const formatCurrency = (n?: number) =>
  typeof n === 'number' ? n.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '—'

export default async function ReportPage() {
  let ledger: Ledger | null = null
  try {
    const ledgerPath = path.resolve(process.cwd(), '..', 'case-financials', 'results', 'ledger.json')
    const raw = await fs.readFile(ledgerPath, 'utf8')
    ledger = JSON.parse(raw) as Ledger
  } catch { /* ignore read errors */ }

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

        {/* Final distribution summary first (single source of truth) */}
        <section className="rounded border border-slate-200 p-4 mb-6 no-break">
          <div className="text-sm text-slate-600">Final Distribution</div>
          <div className="text-xl font-semibold tracking-tight">Respondent {formatCurrency(ledger?.root?.value?.respondent)} · Petitioner {formatCurrency(ledger?.root?.value?.petitioner)}</div>
          <div className="text-sm text-slate-600">Total after Form 593 removal: <span className="font-medium tracking-tight">{formatCurrency(ledger?.root?.value?.total)}</span></div>
          <div className="mt-2 text-xs text-slate-600">This page is the single source of truth for the court filing. All amounts below reconcile to these totals and cite their sources.</div>
        </section>

        <div className="rounded border border-slate-200 p-4 mb-6 no-break">
          <div className="text-sm text-slate-600">Final Totals</div>
          <div className="text-xl font-semibold tracking-tight">Respondent {formatCurrency(ledger?.root?.value?.respondent)} · Petitioner {formatCurrency(ledger?.root?.value?.petitioner)}</div>
          <div className="text-sm text-slate-600">Total after Form 593 removal: <span className="font-medium tracking-tight">{formatCurrency(ledger?.root?.value?.total)}</span></div>
        </div>

        {/* Assumptions & Inputs */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Assumptions & Inputs</h2>
          <ul className="list-disc ml-6 text-sm">
            <li>Close of escrow (COE): May 30, 2025 (per closing statement).</li>
            <li>Ownership distribution (SOD): 65% Respondent · 35% Petitioner (tenants in common).</li>
            <li>Arrears period: Dec 2023–Nov 2024 total $77,799.88 (mortgage + escrow advances for taxes/insurance).</li>
            <li>FMV rent (Don Mowery): $4,500/mo; Petitioner exclusive possession used: 6.7 months (Nov 9, 2024 → May 30, 2025).</li>
            <li>Form 593 rate: 3.33% of sale proceeds share; Petitioner withholding $13,694.62 paid at close; Respondent ≈$25,432.88 mirrored from pot pre‑split.</li>
          </ul>
        </section>

        {/* Computation Ladder (quick outline) */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Computation Ladder (outline)</h2>
          <ol className="list-decimal ml-6 text-sm space-y-1">
            <li>Start from the Final Closing Statement: build the net “Due to Seller” pot.</li>
            <li>Reconstruct constructive net by adding arrears; apply the SOD’s 65/35 award.</li>
            <li>Share arrears equally to reconcile back to the actual deposit before payouts.</li>
            <li>Apply SOD‑ordered payouts to Petitioner (Watts, net‑rental, $122/mo to exclusive date, Ural).</li>
            <li>Apply symmetry adjustments: Watts credit to Respondent for Petitioner’s exclusive possession; flip household items.</li>
            <li>Remove Respondent’s Form 593 from the pot (mirror Petitioner’s withholding already removed at close) and allocate 65/35 impact.</li>
          </ol>
        </section>

        {/* Closing statement build-up */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Closing Statement Build‑up</h2>
          <div className="text-sm">Sale price: {formatCurrency(ledger?.root?.children?.[0]?.value?.sale_price)} · Due to Seller: {formatCurrency(ledger?.root?.children?.[0]?.value?.due_to_seller)}</div>
          <ul className="list-disc ml-6 mt-2 text-sm">
            {ledger?.root?.children?.[0]?.items?.map((it:any, idx:number)=>(
              <li key={idx} className="mb-0.5">{it.label}: <strong>{formatCurrency(it.amount)}</strong></li>
            ))}
          </ul>
        </section>

        {/* SOD constructive net */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">SOD Constructive Net and 65/35</h2>
          <div className="text-sm">Constructive net: {formatCurrency(ledger?.root?.children?.[1]?.value?.constructive_net)} · R 65%: {formatCurrency(ledger?.root?.children?.[1]?.value?.r65)} · P 35%: {formatCurrency(ledger?.root?.children?.[1]?.value?.p35)}</div>
          {ledger?.root?.children?.[1]?.formulas?.map((f:string, i:number)=>(<Formula key={i}>{f}</Formula>))}
        </section>

        {/* Equal arrears */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Equal Sharing of Arrears</h2>
          <div className="text-sm">Total arrears: {formatCurrency(ledger?.root?.children?.[2]?.value?.arrears_total)} → Each: {formatCurrency(ledger?.root?.children?.[2]?.value?.each)}</div>
          {ledger?.root?.children?.[2]?.formulas?.[0] && (<Formula>{ledger.root.children[2].formulas[0]}</Formula>)}
        </section>

        {/* SOD payouts */}
        <section className="mb-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">SOD Payouts to Petitioner (as ordered)</h2>
          <ul className="list-disc ml-6 mt-2 text-sm">
            {ledger?.root?.children?.[3]?.items?.map((it:any, idx:number)=>(
              <li key={idx} className="mb-1">
                <div>{it.label}: <strong>{formatCurrency(it.amount)}</strong></div>
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
                <div>{it.label}: <strong>{formatCurrency(it.amount)}</strong></div>
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
                <div>{it.label}{it.amount?<>: <strong>{formatCurrency(it.amount)}</strong></>:null}</div>
                {it.formula && <Formula>{it.formula}</Formula>}
              </li>
            ))}
          </ul>
        </section>

        {/* Sources footer */}
        <div className="text-xs text-slate-600 mt-6">
          Sources: schedule.md · closing statement extract · SOD OCR · withholding evidence (emails)
        </div>

        {/* Anticipated Questions */}
        <section className="mt-6 no-break">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Anticipated Questions</h2>
          <div className="text-sm">
            <p className="font-medium">Q: Why is the 65/35 applied on a larger “constructive net” first?</p>
            <p>A: The SOD awards 65/35 of the proceeds. Arrears depressed the cash delivered to escrow but do not change the award base; adding arrears back preserves the ordered ratio before deductions.</p>
            <p className="font-medium mt-2">Q: Why share arrears equally?</p>
            <p>A: Mortgage P&I and tax/insurance advances are ordinary obligations of the estate/owners — not “fees and costs.” Equal sharing reconciles the constructive net back to the actual deposit in a manner that doesn’t penalize either side.</p>
            <p className="font-medium mt-2">Q: Why stop the $122/mo on Nov 9, 2024?</p>
            <p>A: Petitioner had exclusive possession from Nov 9, 2024. Charging Respondent $122 through COE double‑counts possession; stopping at the exclusive date aligns with the SOD’s equity rationale.</p>
            <p className="font-medium mt-2">Q: Why add a Watts symmetry credit to Respondent?</p>
            <p>A: The SOD grants Petitioner a Watts recovery when Respondent had exclusive use pre‑trial. The symmetry credit mirrors that principle for Petitioner’s exclusive use pre‑close.</p>
            <p className="font-medium mt-2">Q: Why remove Respondent’s Form 593 from the pot?</p>
            <p>A: Petitioner’s Form 593 withholding ($13,694.62) was removed at close. To avoid biasing the post‑close split, Respondent’s computed Form 593 (~$25,432.88) is mirrored from the pot first, with 65/35 impact allocated.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
