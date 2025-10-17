import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

function toCurrency(n: number | undefined) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—'
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

async function readSibling(...parts: string[]) {
  // Next.js app cwd is the app root; case-financials is a sibling of this project
  const p = path.resolve(process.cwd(), '..', ...parts)
  return p
}

async function loadScheduleMd(): Promise<string | null> {
  try {
    const p = await readSibling('case-financials', 'results', 'schedule.md')
    return await fs.readFile(p, 'utf8')
  } catch {
    return null
  }
}

interface ResultsData {
  method_add_back?: {
    total?: number;
  };
  inputs?: {
    sale?: {
      actual_net_to_trust?: number;
    };
  };
}

async function loadResultsJson(): Promise<ResultsData | null> {
  try {
    const p = await readSibling('case-financials', 'results', 'results.json')
    const raw = await fs.readFile(p, 'utf8')
    return JSON.parse(raw) as ResultsData
  } catch {
    return null
  }
}

function pickLine(md: string, startsWith: string) {
  const line = md.split('\n').find(l => l.trim().startsWith(startsWith))
  return line || ''
}

function extractAmounts(line: string) {
  // parses patterns like: Respondent: $123,456.78 · Petitioner: $111,222.33
  const m = line.match(/Respondent:\s*\$([0-9,\.]+).*Petitioner:\s*\$([0-9,\.]+)/)
  if (!m) return { respondent: undefined, petitioner: undefined }
  const r = Number(m[1].replace(/,/g, ''))
  const p = Number(m[2].replace(/,/g, ''))
  return { respondent: r, petitioner: p }
}

export default async function Page() {
  const md = await loadScheduleMd()
  const results = await loadResultsJson()
  const ledgerRes = await fetch('http://localhost:3000/api/case-financials/ledger', { cache: 'no-store' }).catch(() => null)
  const ledger = ledgerRes && ledgerRes.ok ? await ledgerRes.json() : null

  // Defaults
  let petitionerA = { respondent: undefined as number | undefined, petitioner: undefined as number | undefined }
  let equalC1 = { respondent: undefined as number | undefined, petitioner: undefined as number | undefined }
  let possAdj = { respondent: undefined as number | undefined, petitioner: undefined as number | undefined }
  let fromPot = { respondent: undefined as number | undefined, petitioner: undefined as number | undefined, total: undefined as number | undefined }

  if (md) {
    const aLine = pickLine(md, '## Final Distribution — Scenario A')
    const aNext = md.split('\n')[md.split('\n').indexOf(aLine) + 1] || ''
    petitionerA = extractAmounts(aNext)

    const c1Block = pickLine(md, '  C1+SOD')
    equalC1 = extractAmounts(c1Block)

    const possTitle = pickLine(md, '## Equal-Arrears — Possession Adjusted')
    const possAmounts = md.split('\n')[md.split('\n').indexOf(possTitle) + 2] || ''
    possAdj = extractAmounts(possAmounts)

    const potTitle = pickLine(md, '## From-the-Pot Variant')
    const potAmounts = md.split('\n')[md.split('\n').indexOf(potTitle) + 2] || ''
    const potParsed = extractAmounts(potAmounts)
    if (potParsed.respondent && potParsed.petitioner) {
      const totalLine = potAmounts.match(/Total:\s*\$([0-9,\.]+)/)
      const tot = totalLine ? Number(totalLine[1].replace(/,/g, '')) : undefined
      fromPot = { respondent: potParsed.respondent, petitioner: potParsed.petitioner, total: tot }
    }
  }

  const total = results?.method_add_back?.total ?? results?.inputs?.sale?.actual_net_to_trust

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Case Financials — Calculator Breakdown</h1>
        <Badge variant="secondary">Auto‑loaded from case‑financials/results</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Petitioner Method (A)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">All arrears to Respondent</div>
            <div>Respondent: <strong>{toCurrency(petitionerA.respondent)}</strong></div>
            <div>Petitioner: <strong>{toCurrency(petitionerA.petitioner)}</strong></div>
            <div className="text-xs mt-2">Total: {toCurrency(total)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equal‑Arrears + SOD (C1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">Arrears 50/50; default fees Respondent</div>
            <div>Respondent: <strong>{toCurrency(equalC1.respondent)}</strong></div>
            <div>Petitioner: <strong>{toCurrency(equalC1.petitioner)}</strong></div>
            <div className="text-xs mt-2">Total: {toCurrency(total)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Possession‑Adjusted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">Stop $122 on 2024‑11‑09 · Watts symmetry · Household flip</div>
            <div>Respondent: <strong>{toCurrency(possAdj.respondent)}</strong></div>
            <div>Petitioner: <strong>{toCurrency(possAdj.petitioner)}</strong></div>
            <div className="text-xs mt-2">Total: {toCurrency(total)}</div>
          </CardContent>
        </Card>
      </div>

      {fromPot.respondent && (
        <Card>
          <CardHeader>
            <CardTitle>From‑the‑Pot Variant (Latest)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">Remove Respondent’s Form 593 from pot pre‑split (mirror Petitioner)</div>
            <div>Respondent: <strong>{toCurrency(fromPot.respondent)}</strong></div>
            <div>Petitioner: <strong>{toCurrency(fromPot.petitioner)}</strong></div>
            <div className="text-xs mt-2">Total: {toCurrency(fromPot.total)}</div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown (from schedule.md)</CardTitle>
        </CardHeader>
        <CardContent>
          {md ? (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{md}</pre>
          ) : (
            <div className="text-sm text-muted-foreground">schedule.md not found. Run the calculator to generate results.</div>
          )}
        </CardContent>
      </Card>

      {ledger && (
        <Card>
          <CardHeader>
            <CardTitle>Computation Explorer (with sources)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm mb-2">Final (From‑the‑Pot): <strong>{toCurrency(ledger.root?.value?.respondent)}</strong> to Respondent · <strong>{toCurrency(ledger.root?.value?.petitioner)}</strong> to Petitioner · Total {toCurrency(ledger.root?.value?.total)}</div>
            <details className="mb-2" open>
              <summary className="cursor-pointer font-medium">Closing Statement Build‑up</summary>
              <div className="pl-4 mt-2">
                <div>Sale price: {toCurrency(ledger.root.children[0].value.sale_price)} · Due to Seller: {toCurrency(ledger.root.children[0].value.due_to_seller)}</div>
                <ul className="list-disc ml-5">
                  {ledger.root.children[0].items.map((it: any, idx: number) => (
                    <li key={idx}>{it.label}: {toCurrency(it.amount)}</li>
                  ))}
                </ul>
              </div>
            </details>
            <details className="mb-2">
              <summary className="cursor-pointer font-medium">SOD Constructive Net and 65/35</summary>
              <div className="pl-4 mt-2">Constructive net: {toCurrency(ledger.root.children[1].value.constructive_net)} · R 65%: {toCurrency(ledger.root.children[1].value.r65)} · P 35%: {toCurrency(ledger.root.children[1].value.p35)}</div>
              {ledger.root.children[1].formulas && (
                <div className="pl-4 mt-1 text-xs font-mono text-slate-600">
                  {ledger.root.children[1].formulas.map((f:string, i:number) => (<div key={i}>{f}</div>))}
                </div>
              )}
            </details>
            <details className="mb-2">
              <summary className="cursor-pointer font-medium">Equal Sharing of Arrears</summary>
              <div className="pl-4 mt-2">Total arrears: {toCurrency(ledger.root.children[2].value.arrears_total)} → Each: {toCurrency(ledger.root.children[2].value.each)}</div>
              {ledger.root.children[2].formulas && <div className="pl-4 mt-1 text-xs font-mono text-slate-600">{ledger.root.children[2].formulas[0]}</div>}
            </details>
            <details className="mb-2">
              <summary className="cursor-pointer font-medium">SOD Payouts (to Petitioner)</summary>
              <ul className="list-disc ml-9 mt-2">
                {ledger.root.children[3].items.map((it: any, idx: number) => (
                  <li key={idx} className="mb-1">
                    <div>{it.label}: <strong>{toCurrency(it.amount)}</strong></div>
                    {it.formula && <div className="text-xs font-mono text-slate-600">{it.formula}</div>}
                  </li>
                ))}
              </ul>
            </details>
            <details className="mb-2">
              <summary className="cursor-pointer font-medium">Symmetry & Possession Adjustments</summary>
              <ul className="list-disc ml-9 mt-2">
                {ledger.root.children[4].items.map((it: any, idx: number) => (
                  <li key={idx} className="mb-1">
                    <div>{it.label}: <strong>{toCurrency(it.amount)}</strong></div>
                    {it.formula && <div className="text-xs font-mono text-slate-600">{it.formula}</div>}
                  </li>
                ))}
              </ul>
            </details>
            <details>
              <summary className="cursor-pointer font-medium">Remove Respondent Form 593 from Pot</summary>
              <ul className="list-disc ml-9 mt-2">
                {ledger.root.children[5].items.map((it: any, idx: number) => (
                  <li key={idx} className="mb-1">
                    <div>{it.label}{it.amount ? `: ${toCurrency(it.amount)}` : ''}</div>
                    {it.formula && <div className="text-xs font-mono text-slate-600">{it.formula}</div>}
                  </li>
                ))}
              </ul>
            </details>
            <div className="mt-3 text-xs text-muted-foreground">Sources: <Link className="underline" href="/api/case-financials/raw/schedule" target="_blank">schedule.md</Link> · <Link className="underline" href="/api/case-financials/raw/withholding" target="_blank">withholding-evidence.md</Link> · <Link className="underline" href="/api/case-financials/raw/schedule" target="_blank">SOD (see references in schedule)</Link> · <Link className="underline" href="/api/case-financials/raw/schedule" target="_blank">Closing extract</Link></div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 text-sm">
            <li><a className="text-blue-600 underline" href="/api/case-financials/onepager" target="_blank" rel="noreferrer">One‑pager PDF</a></li>
            <li><a className="text-blue-600 underline" href="/api/case-financials/raw/schedule" target="_blank" rel="noreferrer">schedule.md (raw)</a></li>
            <li><a className="text-blue-600 underline" href="/api/case-financials/raw/results" target="_blank" rel="noreferrer">results.json</a></li>
            <li><a className="text-blue-600 underline" href="/api/case-financials/raw/withholding" target="_blank" rel="noreferrer">withholding-evidence.md</a></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
