import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'

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

async function loadResultsJson(): Promise<any | null> {
  try {
    const p = await readSibling('case-financials', 'results', 'results.json')
    const raw = await fs.readFile(p, 'utf8')
    return JSON.parse(raw)
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

  // Defaults
  let petitionerA = { respondent: undefined as number | undefined, petitioner: undefined as number | undefined }
  let equalC1 = { respondent: undefined as number | undefined, petitioner: undefined as number | undefined }
  let possAdj = { respondent: undefined as number | undefined, petitioner: undefined as number | undefined }

  if (md) {
    const aLine = pickLine(md, '## Final Distribution — Scenario A')
    const aNext = md.split('\n')[md.split('\n').indexOf(aLine) + 1] || ''
    petitionerA = extractAmounts(aNext)

    const c1Block = pickLine(md, '  C1+SOD')
    equalC1 = extractAmounts(c1Block)

    const possTitle = pickLine(md, '## Equal-Arrears — Possession Adjusted')
    const possNext = md.split('\n')[md.split('\n').indexOf(possTitle) + 1] || ''
    const possAmounts = md.split('\n')[md.split('\n').indexOf(possTitle) + 2] || ''
    possAdj = extractAmounts(possAmounts)
  }

  const total = results?.method_add_back?.total ?? results?.inputs?.sale?.actual_net_to_trust

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Case Financials — Calculator Breakdown</h1>
        <Badge variant="secondary">Auto‑loaded from case‑financials/results</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 text-sm">
            <li><a className="text-blue-600 underline" href="/api/case-financials/onepager" target="_blank" rel="noreferrer">One‑pager PDF</a></li>
            <li><a className="text-blue-600 underline" href="/api/case-financials/raw/schedule" target="_blank" rel="noreferrer">schedule.md (raw)</a></li>
            <li><a className="text-blue-600 underline" href="/api/case-financials/raw/results" target="_blank" rel="noreferrer">results.json</a></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

