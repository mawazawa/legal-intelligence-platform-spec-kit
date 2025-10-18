"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Home,
  DollarSign,
  FileText,
  BarChart,
  ChevronRight,
  Calculator,
  Scale,
  Calendar,
  TrendingUp,
  Gavel
} from 'lucide-react';

// Section IDs for smooth scrolling
const SECTIONS = {
  OVERVIEW: 'overview',
  FINANCIAL: 'financial',
  RFO_ANALYSIS: 'rfo-analysis',
  COST_BREAKDOWN: 'cost-breakdown',
  LEGAL_DOCS: 'legal-documents',
  RESPONSIVE_DECLARATION: 'responsive-declaration',
  ROTERT_DECLARATION: 'rotert-declaration',
  ANALYTICS: 'analytics',
  CLAIMS: 'claims-analysis',
  CONTINUANCES: 'continuances',
  TIMELINE: 'timeline',
} as const;

const ConsolidatedCasePage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-slate-900">Case FDI-21-794666</h1>

              <div className="hidden md:flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(SECTIONS.OVERVIEW)}
                  className="text-slate-700 hover:text-blue-600"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Overview
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(SECTIONS.FINANCIAL)}
                  className="text-slate-700 hover:text-blue-600"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financial
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(SECTIONS.LEGAL_DOCS)}
                  className="text-slate-700 hover:text-blue-600"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Legal Docs
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(SECTIONS.ANALYTICS)}
                  className="text-slate-700 hover:text-blue-600"
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>

            <Button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Print Case File
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

        {/* SECTION: Overview */}
        <section id={SECTIONS.OVERVIEW} className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              In Re Marriage of Alvero & Wauters
            </h2>
            <p className="text-xl text-slate-600">
              Case No. FDI-21-794666 | San Francisco Superior Court
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Hearing: August 28, 2025 | Department 403
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => scrollToSection(SECTIONS.RFO_ANALYSIS)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-red-600" />
                  RFO Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Mathematical error analysis of Petitioner&apos;s $77,779.88 double-counting claim</p>
                <ChevronRight className="h-4 w-4 text-blue-600 mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => scrollToSection(SECTIONS.COST_BREAKDOWN)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Detailed financial calculations and distribution proposals</p>
                <ChevronRight className="h-4 w-4 text-blue-600 mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => scrollToSection(SECTIONS.RESPONSIVE_DECLARATION)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Responsive Declaration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">FL-320 responsive declaration with exhibits</p>
                <ChevronRight className="h-4 w-4 text-blue-600 mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => scrollToSection(SECTIONS.CLAIMS)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Claims Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Breakdown of valid, invalid, and disputed claims</p>
                <ChevronRight className="h-4 w-4 text-blue-600 mt-2" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION: Financial Analysis */}
        <section id={SECTIONS.FINANCIAL} className="scroll-mt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              Financial Analysis
            </h2>
            <p className="text-slate-600">Comprehensive breakdown of property division and financial claims</p>
          </div>

          {/* RFO Analysis Subsection */}
          <div id={SECTIONS.RFO_ANALYSIS} className="mb-12 scroll-mt-24">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-red-600" />
                  RFO Mathematical Error Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 exhibit cost-breakdown">
                  <div className="bg-red-50 border-l-4 border-red-600 p-6">
                    <h3 className="font-bold text-lg text-red-900 mb-2">
                      Critical Error: $77,779.88 Double-Counting
                    </h3>
                    <p className="text-red-800">
                      Petitioner attempts to both deduct the mortgage payoff from sale proceeds AND add it back as a separate community debt.
                      This is mathematically impossible and constitutes double-counting.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-100 p-6 rounded-lg">
                      <h4 className="font-bold text-red-900 mb-3">❌ Petitioner&apos;s Incorrect Math</h4>
                      <div className="space-y-2 font-mono text-sm">
                        <div>Net Proceeds: $280,355.83</div>
                        <div className="text-red-700">+ Add Back: $77,779.88</div>
                        <div className="border-t border-red-300 pt-2 font-bold">
                          Fictional Total: $358,155.71
                        </div>
                      </div>
                      <p className="text-xs text-red-700 mt-3">
                        Cannot create money by adding it back on paper
                      </p>
                    </div>

                    <div className="bg-green-100 p-6 rounded-lg">
                      <h4 className="font-bold text-green-900 mb-3">✓ Correct Calculation</h4>
                      <div className="space-y-2 font-mono text-sm">
                        <div>Sale Price: $1,175,000.00</div>
                        <div>- Mortgage: $759,364.32</div>
                        <div>- Closing: $135,279.85</div>
                        <div className="border-t border-green-300 pt-2 font-bold text-green-700">
                          Net Proceeds: $280,355.83
                        </div>
                      </div>
                      <p className="text-xs text-green-700 mt-3">
                        Based on actual settlement statement
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown Subsection */}
          <div id={SECTIONS.COST_BREAKDOWN} className="mb-12 scroll-mt-24">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  Detailed Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="exhibit cost-breakdown">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="text-left p-3 font-semibold">Item</th>
                        <th className="text-right p-3 font-semibold">Amount</th>
                        <th className="text-center p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3">Net Sale Proceeds</td>
                        <td className="p-3 text-right font-mono">$280,355.83</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Verified</span>
                        </td>
                        <td className="p-3 text-slate-600">Per settlement statement</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3">Petitioner&apos;s Share (35%)</td>
                        <td className="p-3 text-right font-mono">$98,124.54</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Calculated</span>
                        </td>
                        <td className="p-3 text-slate-600">Per Statement of Decision</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3">Respondent&apos;s Share (65%)</td>
                        <td className="p-3 text-right font-mono">$182,231.29</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Calculated</span>
                        </td>
                        <td className="p-3 text-slate-600">Per Statement of Decision</td>
                      </tr>
                      <tr className="bg-red-50 hover:bg-red-100">
                        <td className="p-3 font-semibold">Mortgage &quot;Add Back&quot;</td>
                        <td className="p-3 text-right font-mono text-red-700">$77,779.88</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">Invalid</span>
                        </td>
                        <td className="p-3 text-red-700">Double-counting error</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION: Legal Documents */}
        <section id={SECTIONS.LEGAL_DOCS} className="scroll-mt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-600" />
              Legal Documents
            </h2>
            <p className="text-slate-600">Court-ready pleadings and declarations</p>
          </div>

          {/* Responsive Declaration */}
          <div id={SECTIONS.RESPONSIVE_DECLARATION} className="mb-12 scroll-mt-24">
            <Card className="bg-white/80 backdrop-blur-sm legal-document">
              <CardHeader>
                <CardTitle className="text-2xl">FL-320 Responsive Declaration</CardTitle>
              </CardHeader>
              <CardContent className="print-pleading">
                  <p className="text-sm text-slate-600 mb-4">Respondent&apos;s responsive declaration to Petitioner&apos;s RFO regarding property division</p>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Declaration
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Rotert Declaration */}
          <div id={SECTIONS.ROTERT_DECLARATION} className="mb-12 scroll-mt-24">
            <Card className="bg-white/80 backdrop-blur-sm legal-document">
              <CardHeader>
                <CardTitle className="text-2xl">Thomas J. Rotert Declaration</CardTitle>
              </CardHeader>
              <CardContent className="print-pleading">
                <p className="text-sm text-slate-600 mb-4">Attorney declaration in support of Respondent&apos;s opposition</p>
                <Button variant="outline" size="sm">
                  <Gavel className="h-4 w-4 mr-2" />
                  View Attorney Declaration
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION: Analytics */}
        <section id={SECTIONS.ANALYTICS} className="scroll-mt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <BarChart className="h-8 w-8 text-blue-600" />
              Case Analytics
            </h2>
            <p className="text-slate-600">Data-driven insights and pattern analysis</p>
          </div>

          {/* Claims Analysis */}
          <div id={SECTIONS.CLAIMS} className="mb-12 scroll-mt-24">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Scale className="h-6 w-6 text-blue-600" />
                  Claims Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="exhibit">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-red-700">$145,780</div>
                    <div className="text-sm text-red-600">Invalid Claims (69%)</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-700">$65,317</div>
                    <div className="text-sm text-green-600">Valid Claims (31%)</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-700">$280,356</div>
                    <div className="text-sm text-blue-600">Net Proceeds</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Continuances */}
          <div id={SECTIONS.CONTINUANCES} className="mb-12 scroll-mt-24">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  Continuances & Delays
                </CardTitle>
              </CardHeader>
              <CardContent className="exhibit">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700">12</div>
                    <div className="text-sm text-purple-600">Total Continuances</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-orange-700">8/12</div>
                    <div className="text-sm text-orange-600">Petitioner Requests (67%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div id={SECTIONS.TIMELINE} className="mb-12 scroll-mt-24">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                  Case Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="exhibit">
                <p className="text-sm text-slate-600">Key events and milestones throughout the case</p>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          nav { display: none !important; }
          .no-print { display: none !important; }
          section { page-break-before: always; }
          section:first-of-type { page-break-before: avoid; }
        }
      `}</style>
    </div>
  );
};

export default ConsolidatedCasePage;
