import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { SideBySide } from '@/components/case/SideBySide'

interface LedgerValue {
  [key: string]: number | undefined
}

interface LedgerNode {
  value?: LedgerValue
}

interface Ledger {
  root?: LedgerNode
}

async function readSibling(...parts: string[]) {
  const p = path.resolve(process.cwd(), '..', ...parts)
  return p
}

export default async function SideBySidePage() {
  let ledger: Ledger | null = null
  try {
    const p = await readSibling('case-financials','results','ledger.json')
    const raw = await fs.readFile(p,'utf8')
    ledger = JSON.parse(raw) as Ledger
  } catch { /* ignore read errors */ }

  const r = (n?: number) => typeof n==='number'? n.toLocaleString('en-US',{style:'currency',currency:'USD'}) : '—'

  // Attempt to read the latest ingested RFO claims
  async function readLatestRFOClaims(): Promise<Array<Record<string, unknown>> | null> {
    try {
      const idxPath = await readSibling('case-financials','sources','index.json')
      const idxRaw = await fs.readFile(idxPath, 'utf8')
      const idx = JSON.parse(idxRaw) as { docs?: Array<{ type?: string; date?: string; path?: string }> }
      const docs = (idx?.docs || []).filter((d) => d?.type === 'petitioner/rfo')
      if (!docs.length) return null
      docs.sort((a, b) => String(b.date).localeCompare(String(a.date)))
      const latest = docs[0]
      const claimsPath = await readSibling('case-financials','sources', latest.path!, 'claims.json')
      const claimsRaw = await fs.readFile(claimsPath, 'utf8')
      const claims = JSON.parse(claimsRaw) as { claims?: Array<Record<string, unknown>> }
      return claims?.claims || null
    } catch {
      return null
    }
  }

  const claims = await readLatestRFOClaims()

  function buildResponseForClaim(title: string): { response: string, formula?: string, sources?: Array<Record<string, unknown>> } {
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
  interface Issue {
    title: string
    claim: string
    response: string
    formula?: string
    sources?: { key: string; label: string; range?: { start: number; end: number } }[]
  }

  const issues: Issue[] = claims && claims.length ? (
    claims.slice(0, 12).map((c: Record<string, unknown>) => {
      const title = String(c.title || c.claim || '');
      const enrich = buildResponseForClaim(title);
      return {
        title: String(c.title || 'Claim'),
        claim: String(c.claim || ''),
        response: enrich.response,
        formula: enrich.formula,
        sources: [ { key: 'petitioner_rfo', label: 'RFO (ingested)' }, ...(enrich.sources||[]) ],
      } as Issue;
    })
  ) : [
    {
      title: 'Division of Net Proceeds',
      claim: 'Petitioner applies 65/35 to an inflated base by adding arrears, then deducts arrears entirely from Respondent — converting 35% into a greater share.',
      response: `Apply SOD 65/35 to constructive net, then share arrears equally before payouts; final from‑the‑pot result is Respondent ${r(ledger?.root?.value?.respondent)} · Petitioner ${r(ledger?.root?.value?.petitioner)} (Total ${r(ledger?.root?.value?.total)}).`,
      sources: [ { key: 'sod', label: 'SOD 65/35', range: { start: 1284, end: 1366 } }, { key: 'closing_statement', label: 'Closing Due to Seller' } ],
    } as Issue,
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
