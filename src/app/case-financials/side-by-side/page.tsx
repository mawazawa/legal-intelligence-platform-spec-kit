import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { SideBySide } from '@/components/case/SideBySide'

async function readSibling(...parts: string[]) {
  const p = path.resolve(process.cwd(), '..', ...parts)
  return p
}

export default async function SideBySidePage() {
  let ledger: any = null
  try {
    const p = await readSibling('case-financials','results','ledger.json')
    const raw = await fs.readFile(p,'utf8')
    ledger = JSON.parse(raw)
  } catch {}

  const r = (n?: number) => typeof n==='number'? n.toLocaleString('en-US',{style:'currency',currency:'USD'}) : '—'

  // Attempt to read the latest ingested RFO claims
  async function readLatestRFOClaims(): Promise<any[] | null> {
    try {
      const idxPath = await readSibling('case-financials','sources','index.json')
      const idxRaw = await fs.readFile(idxPath, 'utf8')
      const idx = JSON.parse(idxRaw)
      const docs = (idx?.docs || []).filter((d: any) => d?.type === 'petitioner/rfo')
      if (!docs.length) return null
      docs.sort((a: any, b: any) => String(b.date).localeCompare(String(a.date)))
      const latest = docs[0]
      const claimsPath = await readSibling('case-financials','sources', latest.path, 'claims.json')
      const claimsRaw = await fs.readFile(claimsPath, 'utf8')
      const claims = JSON.parse(claimsRaw)
      return claims?.claims || null
    } catch {
      return null
    }
  }

  const claims = await readLatestRFOClaims()

  function buildResponseForClaim(title: string): { response: string, formula?: string, sources?: any[] } {
    const L = ledger?.root
    const fmt = (n?: number) => typeof n==='number'? n.toLocaleString('en-US',{style:'currency',currency:'USD'}) : '—'
    const base = `From‑the‑Pot result: Respondent ${fmt(L?.value?.respondent)} · Petitioner ${fmt(L?.value?.petitioner)} (Total ${fmt(L?.value?.total)}).`
    const t = title.toLowerCase()
    if (t.includes('equal') || t.includes('50%')) {
      return {
        response: `Court‑ordered 65/35 applies to the constructive net, not an equal 50/50. ${base}`,
        sources: [ { key: 'sod', label: 'SOD 65/35', range: { start: 1284, end: 1366 } } ],
      }
    }
    if (t.includes('watts') || t.includes('$122')) {
      return {
        response: 'Stop $122 on 2024‑11‑09 (exclusive possession) and add symmetry Watts credit to Respondent.',
        formula: '4,500 × 6.7 × 65% = 19,597.50',
        sources: [ { key: 'sod', label: 'SOD Watts & $122', range: { start: 1875, end: 1931 } } ],
      }
    }
    if (t.includes('furniture') || t.includes('household')) {
      return {
        response: 'Flip household items: remove −$7,500 to Respondent and add +$7,500 credit → +$15,000 swing to Respondent.',
        sources: [ { key: 'sod', label: 'SOD Household Items', range: { start: 2250, end: 2266 } } ],
      }
    }
    if (t.includes('593') || t.includes('withholding')) {
      return {
        response: 'Mirror Petitioner: remove Respondent’s Form 593 from the pot pre‑split and allocate 65/35 impact.',
        formula: '1,175,000 × 65% × 3.33% ≈ 25,432.88',
        sources: [ { key: 'withholding_emails', label: 'Emails: 593 handling' } ],
      }
    }
    if (t.includes('arrears')) {
      return {
        response: 'Share arrears equally to reconcile constructive net back to actual deposit before payouts.',
        formula: '77,799.88 ÷ 2 = 38,899.94',
        sources: [ { key: 'closing_statement', label: 'Closing: context' } ],
      }
    }
    // default
    return { response: base }
  }

  // Build issues from claims or fall back
  const issues = claims && claims.length ? (
    claims.slice(0, 12).map((c: any) => {
      const enrich = buildResponseForClaim(String(c.title||c.claim||''))
      return {
        title: c.title || 'Claim',
        claim: c.claim,
        response: enrich.response,
        formula: enrich.formula,
        sources: [ { key: 'petitioner_rfo', label: 'RFO (ingested)' }, ...(enrich.sources||[]) ],
      }
    })
  ) : [
    // Fallback placeholders (pre-existing examples)
    {
      title: 'Division of Net Proceeds',
      claim: 'Petitioner applies 65/35 to an inflated base by adding arrears, then deducts arrears entirely from Respondent — converting 35% into a greater share.',
      response: `Apply SOD 65/35 to constructive net, then share arrears equally before payouts; final from‑the‑pot result is Respondent ${r(ledger?.root?.value?.respondent)} · Petitioner ${r(ledger?.root?.value?.petitioner)} (Total ${r(ledger?.root?.value?.total)}).`,
      sources: [ { key: 'sod', label: 'SOD 65/35', range: { start: 1284, end: 1366 } }, { key: 'closing_statement', label: 'Closing Due to Seller' } ],
    }
  ]

  return (
    <div className="p-6 mx-auto max-w-6xl">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Side‑by‑Side — RFO (FL‑300) vs FL‑320</h1>
        <div className="text-sm text-slate-600">Tit‑for‑tat comparison, annotated and sourced; court‑ready layout.</div>
      </div>
      <SideBySide issues={issues} />
    </div>
  )
}
