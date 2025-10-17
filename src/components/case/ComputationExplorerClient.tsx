"use client"
import React, { useMemo, useState } from 'react'
import { SourceDrawer } from '@/components/case/SourceDrawer'
import { typography, tx, textColors } from '@/styles/typography'

function toCurrency(n?: number) { return typeof n==='number'? n.toLocaleString('en-US',{style:'currency',currency:'USD'}) : '—' }

interface LedgerItem {
  label: string;
  amount?: number;
  formula?: string;
  sources?: string[];
}

interface LedgerNodeValue {
  respondent?: number;
  petitioner?: number;
  total?: number;
  sale_price?: number;
  due_to_seller?: number;
  constructive_net?: number;
  r65?: number;
  p35?: number;
  arrears_total?: number;
  each?: number;
}

interface LedgerNode {
  value?: LedgerNodeValue;
  items?: LedgerItem[];
  formulas?: string[];
}

interface SourceCitation {
  citations?: Array<{
    lines?: [number, number];
  }>;
}

interface LedgerData {
  root?: {
    value?: LedgerNodeValue;
    children?: LedgerNode[];
  };
  sources?: Record<string, SourceCitation>;
}

export function ComputationExplorerClient({ ledger }: { ledger: LedgerData }) {
  const [open, setOpen] = useState(false)
  const [srcKey, setSrcKey] = useState('closing_statement')
  const [title, setTitle] = useState('')
  const [range, setRange] = useState<{start:number;end:number}|undefined>(undefined)

  const citations = useMemo(()=> ledger?.sources || {}, [ledger])

  function openSource(key: string, titleText: string) {
    setSrcKey(key)
    setTitle(titleText)
    // pick first citation if available
    const cites = citations[key]?.citations
    if (Array.isArray(cites) && cites.length>0 && Array.isArray(cites[0]?.lines)) {
      const [start,end] = cites[0].lines
      setRange({ start, end })
    } else {
      setRange(undefined)
    }
    setOpen(true)
  }

  return (
    <div>
      <div className={tx(typography.body.medium, 'mb-2')}>Final (From‑the‑Pot): <strong>{toCurrency(ledger?.root?.value?.respondent)}</strong> to Respondent · <strong>{toCurrency(ledger?.root?.value?.petitioner)}</strong> to Petitioner · Total {toCurrency(ledger?.root?.value?.total)}</div>

      {/* Closing statement */}
      <details className="mb-2" open>
        <summary className={tx(typography.label.medium, 'cursor-pointer')}>Closing Statement Build‑up</summary>
        <div className="pl-4 mt-2">
          <div className={typography.body.medium}>Sale price: {toCurrency(ledger?.root?.children?.[0]?.value?.sale_price)} · Due to Seller: {toCurrency(ledger?.root?.children?.[0]?.value?.due_to_seller)}</div>
          <ul className="list-disc ml-5">
            {ledger?.root?.children?.[0]?.items?.map((it: LedgerItem, idx: number)=>(
              <li key={idx} className={tx(typography.body.medium, 'mb-1 flex items-center gap-2')}>
                <span>{it.label}: <strong>{toCurrency(it.amount)}</strong></span>
                <button className={tx(typography.caption.small, 'px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200')} onClick={()=>openSource('closing_statement','Closing Statement')}>source</button>
              </li>
            ))}
          </ul>
        </div>
      </details>

      {/* SOD constructive net */}
      <details className="mb-2">
        <summary className={tx(typography.label.medium, 'cursor-pointer')}>SOD Constructive Net and 65/35</summary>
        <div className={tx(typography.body.medium, 'pl-4 mt-2')}>Constructive net: {toCurrency(ledger?.root?.children?.[1]?.value?.constructive_net)} · R 65%: {toCurrency(ledger?.root?.children?.[1]?.value?.r65)} · P 35%: {toCurrency(ledger?.root?.children?.[1]?.value?.p35)}</div>
        {ledger?.root?.children?.[1]?.formulas?.map((f:string, i:number)=>(<div key={i} className="pl-4"><code className={tx(typography.caption.medium, 'bg-slate-50 border border-slate-200 rounded px-2 py-0.5')}>{f}</code></div>))}
        <div className="pl-4 mt-2"><button className={tx(typography.caption.small, 'px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200')} onClick={()=>openSource('sod','Statement of Decision')}>source</button></div>
      </details>

      {/* Equal arrears */}
      <details className="mb-2">
        <summary className={tx(typography.label.medium, 'cursor-pointer')}>Equal Sharing of Arrears</summary>
        <div className={tx(typography.body.medium, 'pl-4 mt-2')}>Total arrears: {toCurrency(ledger?.root?.children?.[2]?.value?.arrears_total)} → Each: {toCurrency(ledger?.root?.children?.[2]?.value?.each)}</div>
        {ledger?.root?.children?.[2]?.formulas?.[0] && (<div className="pl-4"><code className={tx(typography.caption.medium, 'bg-slate-50 border border-slate-200 rounded px-2 py-0.5')}>{ledger.root.children[2].formulas[0]}</code></div>)}
      </details>

      {/* SOD payouts */}
      <details className="mb-2">
        <summary className={tx(typography.label.medium, 'cursor-pointer')}>SOD Payouts (to Petitioner)</summary>
        <ul className="list-disc ml-9 mt-2">
          {ledger?.root?.children?.[3]?.items?.map((it: LedgerItem, idx: number)=>(
            <li key={idx} className={tx(typography.body.medium, 'mb-1')}>
              <div>{it.label}: <strong>{toCurrency(it.amount)}</strong></div>
              {it.formula && <div className={tx(typography.caption.medium, textColors.secondary, 'font-mono')}>{it.formula}</div>}
              <div className="mt-1"><button className={tx(typography.caption.small, 'px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200')} onClick={()=>openSource('sod','Statement of Decision')}>source</button></div>
            </li>
          ))}
        </ul>
      </details>

      {/* Symmetry & possession */}
      <details className="mb-2">
        <summary className={tx(typography.label.medium, 'cursor-pointer')}>Symmetry & Possession Adjustments</summary>
        <ul className="list-disc ml-9 mt-2">
          {ledger?.root?.children?.[4]?.items?.map((it: LedgerItem, idx: number)=>(
            <li key={idx} className={tx(typography.body.medium, 'mb-1')}>
              <div>{it.label}: <strong>{toCurrency(it.amount)}</strong></div>
              {it.formula && <div className={tx(typography.caption.medium, textColors.secondary, 'font-mono')}>{it.formula}</div>}
              <div className="mt-1"><button className={tx(typography.caption.small, 'px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200')} onClick={()=>openSource('sod','Statement of Decision')}>source</button></div>
            </li>
          ))}
        </ul>
      </details>

      {/* From the pot */}
      <details>
        <summary className={tx(typography.label.medium, 'cursor-pointer')}>Remove Respondent Form 593 from Pot</summary>
        <ul className="list-disc ml-9 mt-2">
          {ledger?.root?.children?.[5]?.items?.map((it: LedgerItem, idx: number)=>(
            <li key={idx} className={tx(typography.body.medium, 'mb-1')}>
              <div>{it.label}{it.amount?<>: <strong>{toCurrency(it.amount)}</strong></>:null}</div>
              {it.formula && <div className={tx(typography.caption.medium, textColors.secondary, 'font-mono')}>{it.formula}</div>}
              <div className="mt-1"><button className={tx(typography.caption.small, 'px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200')} onClick={()=>openSource(it.sources?.[0] || 'closing_statement','Form 593 / FTB Evidence')}>source</button></div>
            </li>
          ))}
        </ul>
      </details>

      <SourceDrawer open={open} onClose={()=>setOpen(false)} title={title} fileKey={srcKey} range={range} />
    </div>
  )
}

