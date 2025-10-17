"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Printer,
  Scale as ScaleIcon,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ScrollText,
  GitCompare
} from 'lucide-react';
import { PageView } from '@/components/case/PageView'

interface RFOContent {
  text: string;
  meta: Record<string, unknown>;
  pages: number;
}

interface ComparisonPoint {
  id: string;
  title: string;
  petitionerClaim: string;
  respondentRebuttal: string;
  evidence: string[];
  status: 'disputed' | 'conceded' | 'neutral';
  pageRefs: {
    petitioner: string;
    respondent: string;
  };
}

type TabType = 'petitioner' | 'respondent' | 'comparison';

const RFOComparisonPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [petitionerRFO, setPetitionerRFO] = useState<RFOContent | null>(null);
  const [respondentFL320, setRespondentFL320] = useState<RFOContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [activeTab, setActiveTab] = useState<TabType>('petitioner');
  const [pageIndex, setPageIndex] = useState(0);
  const [ledger, setLedger] = useState<any>(null);

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const rfoResponse = await fetch('/api/case-financials/source?file=petitioner_rfo');
        if (rfoResponse.ok) {
          const rfoData = await rfoResponse.json();
          setPetitionerRFO({
            text: rfoData.text,
            meta: rfoData.meta,
            pages: rfoData.meta?.pages || 101
          });
        }

        const fl320Response = await fetch('/api/case-financials/source?file=respondent_fl320');
        if (fl320Response.ok) {
          const fl320Data = await fl320Response.json();
          setRespondentFL320({
            text: fl320Data.text,
            meta: fl320Data.meta,
            pages: fl320Data.meta?.pages || 0
          });
        }

        const lr = await fetch('/api/case-financials/ledger', { cache: 'no-store' })
        if (lr.ok) setLedger(await lr.json())
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const splitPages = (t?: string): string[] => {
    if (!t) return []
    const parts = t.split(/\n--- Page \d+ ---\n/g).map(s=>s.trim()).filter(Boolean)
    if (parts.length) return parts
    const sz = 1800
    const out: string[] = []
    for (let i=0; i<t.length; i+=sz) out.push(t.slice(i, i+sz))
    return out
  }

  const rfoPages = splitPages(petitionerRFO?.text)

  const fmt = (n?: number) => typeof n==='number' ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '—'

  const buildRespondentPages = (): string[] => {
    const d2s = ledger?.root?.children?.[0]?.value?.due_to_seller
    const r65 = ledger?.root?.children?.[1]?.value?.r65
    const p35 = ledger?.root?.children?.[1]?.value?.p35
    const fr = ledger?.root?.value?.respondent
    const fp = ledger?.root?.value?.petitioner
    const cn = ledger?.root?.children?.[1]?.value?.constructive_net
    return [
      [
        'RESPONSIVE DECLARATION (FL-320) — Computation Outline',
        '',
        'From‑the‑Pot Final Distribution (ledger-based):',
        `  Respondent: ${fmt(fr)}`,
        `  Petitioner: ${fmt(fp)}`,
        '  Split: 65% / 35% per Statement of Decision',
        '',
        'Key Corrections:',
        '  • Do not add arrears back to net proceeds; they were already paid at close.',
        '  • Apply 65/35 to constructive net, then share arrears equally.',
        '  • Mirror Form 593 treatment for both parties for symmetry.',
        '',
        'Citations: Statement of Decision (65/35, Watts, items), Closing Statement (Due to Seller).',
      ].join('\n'),
      [
        'CALCULATION SNAPSHOT',
        '',
        `Net proceeds (Due to Seller): ${fmt(d2s)}`,
        `Constructive net: ${fmt(cn)}`,
        `SOD 65% (Respondent): ${fmt(r65)}`,
        `SOD 35% (Petitioner): ${fmt(p35)}`,
        '',
        'Adjustments (selected):',
        '  • Watts fixed; $122/mo cutoff; symmetry credit.',
        '  • Household items flip (+$15,000 to Respondent).',
      ].join('\n')
    ]
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.has(sectionId) ? newSet.delete(sectionId) : newSet.add(sectionId);
      return newSet;
    });
  };

  const comparisonPoints: ComparisonPoint[] = [
    {
      id: 'net_proceeds_calculation',
      title: 'Net Proceeds Calculation',
      petitionerClaim: 'Add back $77,779.88 mortgage arrears to net proceeds ($280,355.83 + $77,779.88 = $358,155.71) before dividing 65/35',
      respondentRebuttal: 'Mortgage arrears were already paid from sale proceeds; cannot double-count by adding back to net proceeds',
      evidence: [
        'Final Sellers Closing Statement showing $280,355.83 net proceeds',
        'Statement of Decision property division orders',
        'Mortgage payoff documentation showing $759,364.32 paid to lender',
        'November 2024 mortgage statement showing arrears'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 11',
        respondent: 'FL-320 Financial Computation'
      }
    },
    {
      id: 'petitioner_distribution',
      title: 'Petitioner&apos;s Distribution Calculation',
      petitionerClaim: 'Petitioner receives $116,453.00 (35% of $358,155.71 = $125,354.50 minus $8,910.50 tax credit)',
      respondentRebuttal: 'Calculation based on incorrect net proceeds figure; should be based on actual $280,355.83 net proceeds',
      evidence: [
        'Petitioner&apos;s calculation: 35% × $358,155.71 = $125,354.50',
        'Tax withholding credit: $8,910.50 (65% of $13,694.62)',
        'Final amount: $125,354.50 - $8,910.50 = $116,453.00',
        'Statement of Decision 35% allocation'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Distribution Analysis'
      }
    },
    {
      id: 'respondent_distribution',
      title: 'Respondent&apos;s Distribution Calculation',
      petitionerClaim: 'Respondent receives $163,902.83 (65% of $358,155.71 = $232,801.21 minus $77,779.88 arrears = $155,001.33 plus $8,901.50 tax credit)',
      respondentRebuttal: 'Double-counting mortgage arrears; respondent already paid arrears through sale proceeds',
      evidence: [
        'Petitioner&apos;s calculation: 65% × $358,155.71 = $232,801.21',
        'Subtract arrears: $232,801.21 - $77,779.88 = $155,001.33',
        'Add tax credit: $155,001.33 + $8,901.50 = $163,902.83',
        'Statement of Decision 65% allocation'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Distribution Analysis'
      }
    },
    {
      id: 'watts_charges_additional',
      title: 'Additional Watts Charges',
      petitionerClaim: 'Respondent owes additional Watts charges: $50,395.94 (Jan 2021-Sep 2023), $266.16 (Oct-Nov 2023), $19,648.20 (Dec 2023-Nov 2024)',
      respondentRebuttal: 'Watts charges already calculated and offset in Statement of Decision; petitioner received credit for exclusive possession',
      evidence: [
        'Statement of Decision Watts calculation ($46,200 + interest)',
        'Exclusive possession timeline documentation',
        'Rental income offset calculations',
        'Petitioner&apos;s exclusive possession credit'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Watts Analysis'
      }
    },
    {
      id: 'tax_withholding_credit',
      title: 'Tax Withholding Credit',
      petitionerClaim: 'Respondent gets $8,901.50 credit (65% of $13,694.62 tax withholding)',
      respondentRebuttal: 'Tax withholding was petitioner&apos;s obligation; respondent has separate $25,432.88 tax obligation',
      evidence: [
        'Form 593 tax withholding documentation',
        'Email evidence of tax form discussions',
        'Franchise Tax Board correspondence',
        'Respondent&apos;s estimated tax obligation'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Tax Analysis'
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disputed': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'conceded': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default: return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disputed': return 'bg-red-100 text-red-800 border-red-200';
      case 'conceded': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const TabButton = ({ tab, icon: Icon, label }: { tab: TabType; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        activeTab === tab
          ? tab === 'petitioner' ? 'bg-red-50 text-red-700 border-b-2 border-red-500'
            : tab === 'respondent' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
            : 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  const DocumentInfo = ({ title, data, bgColor, borderColor, textColor }: any) => (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-8`}>
      <h3 className={`text-2xl font-bold ${textColor} mb-6 flex items-center`}>
        {title === 'PETITIONER' ? <AlertCircle className="h-6 w-6 mr-3" /> : <CheckCircle2 className="h-6 w-6 mr-3" />}
        {title}&apos;S {title === 'PETITIONER' ? 'REQUEST FOR ORDER' : 'FL-320 RESPONSE'}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className={`bg-white p-6 rounded-lg border ${borderColor}`}>
          <h4 className={`text-lg font-semibold ${textColor} mb-4`}>DOCUMENT INFORMATION</h4>
          <div className="text-sm text-slate-700 space-y-2">
            {Object.entries(data.info).map(([key, value]) => (
              <div key={key}><strong>{key}:</strong> {value as string}</div>
            ))}
          </div>
        </div>

        <div className={`bg-white p-6 rounded-lg border ${borderColor}`}>
          <h4 className={`text-lg font-semibold ${textColor} mb-4`}>{data.listTitle}</h4>
          <div className="text-sm text-slate-700 space-y-2">
            {data.list.map((item: string, i: number) => (
              <div key={i}>• {item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className={`bg-white p-6 rounded-lg border ${borderColor} mb-6`}>
        <h4 className={`text-lg font-semibold ${textColor} mb-4`}>{data.calcTitle}</h4>
        <div className="text-sm text-slate-700 space-y-3">
          {data.calcSteps.map((step: any, i: number) => (
            <div key={i} className={`${bgColor} p-4 rounded border ${borderColor}`}>
              <strong>Step {i + 1}:</strong> {step.label}<br/>
              {step.details.map((detail: string, j: number) => (
                <span key={j} className="ml-4 block">{detail}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={`bg-white p-6 rounded-lg border ${borderColor}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-lg font-semibold ${textColor}`}>{data.pageViewTitle}</h4>
          {data.showNav && (
            <div className="flex items-center gap-2 no-print">
              <button className="text-xs px-2 py-1 border rounded" onClick={()=>setPageIndex(Math.max(0, pageIndex-1))}>Prev</button>
              <div className="text-xs">{(pageIndex+1)} / {(rfoPages.length||1)}</div>
              <button className="text-xs px-2 py-1 border rounded" onClick={()=>setPageIndex(Math.min((rfoPages.length||1)-1, pageIndex+1))}>Next</button>
            </div>
          )}
        </div>
        <PageView pages={data.pages} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center text-slate-700">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading RFO comparison...</p>
        </div>
      </div>
    );
  }

  const petitionerData = {
    info: {
      Filed: 'June 26, 2025',
      Pages: petitionerRFO?.pages || 101,
      Attorney: 'Selam Gezahegn, Simon Law',
      Hearing: 'August 28, 2025',
      'Case No': 'FDI-21-794666'
    },
    listTitle: 'KEY REQUESTS',
    list: [
      'Property division with add-back of mortgage arrears',
      'Additional Watts charges with interest',
      'Tax withholding credit allocation',
      'Attorney\'s fees and costs',
      'Cleanup and repair cost reimbursement'
    ],
    calcTitle: 'PETITIONER\'S CALCULATION METHODOLOGY',
    calcSteps: [
      {
        label: 'Add back mortgage arrears to net proceeds',
        details: ['$280,355.83 + $77,779.88 = $358,155.71']
      },
      {
        label: 'Divide 65/35 per Statement of Decision',
        details: [
          'Petitioner (35%): $358,155.71 × 0.35 = $125,354.50',
          'Respondent (65%): $358,155.71 × 0.65 = $232,801.21'
        ]
      },
      {
        label: 'Apply tax withholding credit',
        details: [
          'Petitioner: $125,354.50 - $8,910.50 = $116,453.00',
          'Respondent: $232,801.21 - $77,779.88 + $8,901.50 = $163,902.83'
        ]
      }
    ],
    pageViewTitle: 'RFO — Page View',
    showNav: true,
    pages: rfoPages.slice(pageIndex, pageIndex+1)
  };

  const respondentData = {
    info: {
      Filed: new Date().toLocaleDateString(),
      Pages: respondentFL320?.pages || 'TBD',
      Attorney: 'Thomas J. Rotert',
      Hearing: 'August 28, 2025',
      'Case No': 'FDI-21-794666'
    },
    listTitle: 'KEY REBUTTALS',
    list: [
      'Correct net proceeds calculation',
      'Statement of Decision compliance',
      'Tax obligation symmetry',
      'Watts charges already calculated',
      'Furniture division completed'
    ],
    calcTitle: 'RESPONDENT\'S CORRECT CALCULATION',
    calcSteps: [
      {
        label: 'Use actual net proceeds from closing statement',
        details: ['Net proceeds: $280,355.83 (per closing statement)']
      },
      {
        label: 'Divide 65/35 per Statement of Decision',
        details: [
          'Petitioner (35%): $280,355.83 × 0.35 = $98,124.54',
          'Respondent (65%): $280,355.83 × 0.65 = $182,231.29'
        ]
      },
      {
        label: 'Apply Statement of Decision adjustments',
        details: ['Watts charges, furniture, rental income offsets']
      },
      {
        label: 'Account for tax obligations',
        details: [
          'Petitioner\'s withholding: $13,694.62',
          'Respondent\'s estimated tax: $25,432.88'
        ]
      }
    ],
    pageViewTitle: 'FL‑320 — Page View (Computed Outline)',
    showNav: false,
    pages: buildRespondentPages()
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .bg-gradient-to-br { background: white !important; }
          .shadow-lg, .shadow-xl, .shadow-2xl { box-shadow: none !important; }
          .court-document { box-shadow: none !important; margin: 0 !important; max-width: none !important; }
          .side-by-side-container { display: block !important; }
          .side-by-side-container > div { width: 100% !important; margin-bottom: 2rem !important; }
          .collapsible-section { display: block !important; }
          .page-layout-component { max-height: none !important; overflow: visible !important; }
          .page-layout-component .space-y-4 > div { page-break-inside: avoid; }
        }
      `}</style>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="fixed top-4 right-4 z-50 no-print">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print / Save as PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Print comparison or save as PDF</p></TooltipContent>
            </Tooltip>
          </div>

          <div className="fixed top-4 left-4 z-50 no-print">
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
              <div className="flex">
                <TabButton tab="petitioner" icon={AlertCircle} label="Petitioner's Proposal" />
                <TabButton tab="respondent" icon={CheckCircle2} label="Respondent's Proposal" />
                <TabButton tab="comparison" icon={GitCompare} label="Side-by-Side Comparison" />
              </div>
            </div>
          </div>

          <div className="court-document bg-white shadow-2xl mx-auto my-8 max-w-7xl rounded-lg" ref={printRef}>
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none rounded-t-lg"></div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none rounded-b-lg"></div>
              <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none rounded-l-lg"></div>
              <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none rounded-r-lg"></div>

              <div className="court-page relative z-10 bg-white min-h-[11in] p-16 rounded-lg">
                <div className="text-center mb-8 border-b-2 border-slate-300 pb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">SUPERIOR COURT OF CALIFORNIA</h1>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4">COUNTY OF SAN FRANCISCO</h2>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>PETITIONER: Rosanna Claire Alvero</div>
                    <div>RESPONDENT: Mathieu Christian Yves Wauters</div>
                    <div>Case No. FDI-21-794666</div>
                  </div>
                </div>

                <div className="text-center mb-12">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">REQUEST FOR ORDER vs RESPONSIVE DECLARATION</h1>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-2">
                    {activeTab === 'petitioner' && 'PETITIONER\'S PROPOSAL'}
                    {activeTab === 'respondent' && 'RESPONDENT\'S PROPOSAL'}
                    {activeTab === 'comparison' && 'SIDE-BY-SIDE COMPARISON AND REBUTTAL'}
                  </h2>
                  <p className="text-sm text-slate-600">Filed: {new Date().toLocaleDateString()} | Hearing: August 28, 2025</p>
                </div>

                {activeTab === 'petitioner' && (
                  <div className="mb-12">
                    <DocumentInfo
                      title="PETITIONER"
                      data={petitionerData}
                      bgColor="bg-red-50"
                      borderColor="border-red-200"
                      textColor="text-red-800"
                    />
                  </div>
                )}

                {activeTab === 'respondent' && (
                  <div className="mb-12">
                    <DocumentInfo
                      title="RESPONDENT"
                      data={respondentData}
                      bgColor="bg-blue-50"
                      borderColor="border-blue-200"
                      textColor="text-blue-800"
                    />
                  </div>
                )}

                {activeTab === 'comparison' && (
                  <>
                    <div className="mb-12">
                      <div className="flex items-center justify-between cursor-pointer mb-4 no-print" onClick={() => toggleSection('overview')}>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center">
                          <ScaleIcon className="h-6 w-6 mr-3 text-blue-600" />
                          EXECUTIVE SUMMARY
                        </h3>
                        {expandedSections.has('overview') ?
                          <ChevronDown className="h-6 w-6 text-slate-600" /> :
                          <ChevronRight className="h-6 w-6 text-slate-600" />
                        }
                      </div>

                      <div className={`bg-slate-50 p-6 rounded-lg border border-slate-200 collapsible-section ${!expandedSections.has('overview') ? 'hidden' : ''}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-red-700 mb-3">PETITIONER&apos;S POSITION</h4>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                              Petitioner claims Respondent owes additional amounts by adding back $77,779.88 mortgage
                              arrears to net proceeds ($280,355.83 + $77,779.88 = $358,155.71) before dividing 65/35.
                            </p>
                            <div className="text-xs text-slate-600 bg-red-100 p-3 rounded">
                              <strong>Petitioner&apos;s Calculation:</strong><br/>
                              • Net proceeds: $358,155.71 (with add-back)<br/>
                              • Petitioner (35%): $116,453.00<br/>
                              • Respondent (65%): $163,902.83<br/>
                              • Plus additional Watts charges and interest
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-blue-700 mb-3">RESPONDENT&apos;S REBUTTAL</h4>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                              Respondent demonstrates that Petitioner&apos;s calculation double-counts mortgage arrears
                              that were already paid from sale proceeds. The correct calculation uses actual net
                              proceeds of $280,355.83 per the closing statement.
                            </p>
                            <div className="text-xs text-slate-600 bg-blue-100 p-3 rounded">
                              <strong>Respondent&apos;s Correct Calculation:</strong><br/>
                              • Net proceeds: $280,355.83 (actual closing)<br/>
                              • Petitioner (35%): $98,124.54<br/>
                              • Respondent (65%): $182,231.29<br/>
                              • Plus Statement of Decision adjustments
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-12">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center">
                        <ScrollText className="h-6 w-6 mr-3 text-blue-600" />
                        DETAILED COMPARISON BY ISSUE
                      </h3>

                      <div className="space-y-8">
                        {comparisonPoints.map((point) => (
                          <Card key={point.id} className="border border-slate-200">
                            <CardHeader className="bg-slate-50">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-slate-800">{point.title}</CardTitle>
                                <Badge className={`${getStatusColor(point.status)} border`}>
                                  {getStatusIcon(point.status)}
                                  <span className="ml-2 capitalize">{point.status}</span>
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="border-r border-slate-200 pr-6">
                                  <h4 className="text-md font-semibold text-red-700 mb-3 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    PETITIONER&apos;S CLAIM
                                  </h4>
                                  <p className="text-sm text-slate-700 leading-relaxed mb-4">{point.petitionerClaim}</p>
                                  <div className="text-xs text-slate-500">Reference: {point.pageRefs.petitioner}</div>
                                </div>

                                <div className="pl-6">
                                  <h4 className="text-md font-semibold text-blue-700 mb-3 flex items-center">
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    RESPONDENT&apos;S REBUTTAL
                                  </h4>
                                  <p className="text-sm text-slate-700 leading-relaxed mb-4">{point.respondentRebuttal}</p>
                                  <div className="text-xs text-slate-500">Reference: {point.pageRefs.respondent}</div>
                                </div>
                              </div>

                              <div className="mt-6 pt-4 border-t border-slate-200">
                                <h5 className="text-sm font-semibold text-slate-700 mb-3">SUPPORTING EVIDENCE</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {point.evidence.map((evidence, index) => (
                                    <div key={index} className="flex items-center text-xs text-slate-600">
                                      <FileText className="h-3 w-3 mr-2 text-blue-500" />
                                      {evidence}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="mb-12">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center">
                        <GitCompare className="h-6 w-6 mr-3 text-purple-600" />
                        PAGE VIEW (SIDE‑BY‑SIDE)
                      </h3>
                      <div className="side-by-side-container grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm text-slate-600 mb-2">Petitioner — RFO (Page {pageIndex+1}/{rfoPages.length || 1})</div>
                          <PageView pages={rfoPages.slice(pageIndex, pageIndex+1)} />
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 mb-2">Respondent — FL‑320 Outline</div>
                          <PageView pages={buildRespondentPages().slice(0,1)} />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 no-print">
                        <button className="text-xs px-2 py-1 border rounded" onClick={()=>setPageIndex(Math.max(0, pageIndex-1))}>Prev page</button>
                        <div className="text-xs">{pageIndex+1} / {rfoPages.length||1}</div>
                        <button className="text-xs px-2 py-1 border rounded" onClick={()=>setPageIndex(Math.min((rfoPages.length||1)-1, pageIndex+1))}>Next page</button>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-16 pt-8 border-t-2 border-slate-300">
                  <div className="text-center text-xs text-slate-500 space-y-2">
                    <div>This comparison demonstrates the factual inaccuracies in Petitioner&apos;s RFO</div>
                    <div>Respondent&apos;s FL-320 will provide comprehensive rebuttals with supporting evidence</div>
                    <div>Filed: {new Date().toLocaleDateString()} | Case No. FDI-21-794666</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default RFOComparisonPage;
