"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Calculator } from 'lucide-react';
import { SECTIONS, FINANCIAL_DATA } from '../constants';

export const FinancialSection = React.memo(() => {
  return (
    <section id={SECTIONS.FINANCIAL} className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          Financial Analysis
        </h2>
        <p className="text-slate-600">Comprehensive breakdown of property division and financial claims</p>
      </div>

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
                  Critical Error: {FINANCIAL_DATA.mortgageAddBack} Double-Counting
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
                    <div>Net Proceeds: {FINANCIAL_DATA.netProceeds}</div>
                    <div className="text-red-700">+ Add Back: {FINANCIAL_DATA.mortgageAddBack}</div>
                    <div className="border-t border-red-300 pt-2 font-bold">
                      Fictional Total: {FINANCIAL_DATA.incorrectTotal}
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
                      Net Proceeds: {FINANCIAL_DATA.netProceeds}
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
                    <td className="p-3 text-right font-mono">{FINANCIAL_DATA.netProceeds}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Verified</span>
                    </td>
                    <td className="p-3 text-slate-600">Per settlement statement</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3">Petitioner&apos;s Share (35%)</td>
                    <td className="p-3 text-right font-mono">{FINANCIAL_DATA.petitionerShare35}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Calculated</span>
                    </td>
                    <td className="p-3 text-slate-600">Per Statement of Decision</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3">Respondent&apos;s Share (65%)</td>
                    <td className="p-3 text-right font-mono">{FINANCIAL_DATA.respondentShare65}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Calculated</span>
                    </td>
                    <td className="p-3 text-slate-600">Per Statement of Decision</td>
                  </tr>
                  <tr className="bg-red-50 hover:bg-red-100">
                    <td className="p-3 font-semibold">Mortgage &quot;Add Back&quot;</td>
                    <td className="p-3 text-right font-mono text-red-700">{FINANCIAL_DATA.mortgageAddBack}</td>
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
  );
});

FinancialSection.displayName = 'FinancialSection';
