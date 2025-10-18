'use client'

/**
 * Tax Withholding Analysis Component (Refactored)
 *
 * KISS Refactoring: Extracted data, logic, and UI into separate modules
 * Before: 765 lines monolith
 * After: ~100 lines orchestration component
 *
 * Principles Applied:
 * - SOLID (Single Responsibility): Each module has one job
 * - DRY (Don't Repeat Yourself): Shared utilities for formatting
 * - KISS (Keep It Simple): Main component is just composition
 * - Separation of Concerns: Data / Logic / UI cleanly separated
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Calculator,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Users,
  Building
} from 'lucide-react'

// Imported data (DRY - single source of truth)
import { TAX_TIMELINE, DEFAULT_FINANCIAL_INPUTS, PERSONNEL } from '@/data/tax-withholding-timeline'

// Imported logic (SOLID - pure functions)
import { calculateFinancialBreakdown, formatCurrency, formatPercentage } from '@/lib/calculations/tax-withholding'

// Type imports
import type { FinancialInputs } from '@/types/tax-withholding'

export default function TaxWithholdingAnalysis() {
  const [inputs, setInputs] = useState<FinancialInputs>(DEFAULT_FINANCIAL_INPUTS)
  const breakdown = calculateFinancialBreakdown(inputs)

  const updateInput = (field: keyof FinancialInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tax Withholding Analysis</h1>
          <p className="text-sm text-slate-600 mt-1">
            Form 593 Failure Impact & FTB Withholding Breakdown
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-2">
          <FileText className="h-4 w-4 mr-2" />
          Evidence Analysis
        </Badge>
      </div>

      {/* Critical Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-sm text-red-800">
          <strong>Critical Finding:</strong> {formatCurrency(breakdown.rosannaWithholding)} withheld
          from Rosanna&apos;s proceeds due to incomplete Form 593. Escrow officer provided multiple
          warnings that were not addressed.
        </AlertDescription>
      </Alert>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total Proceeds</div>
              <div className="text-2xl font-semibold text-blue-900">
                {formatCurrency(breakdown.totalProceeds)}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 font-medium">
                Mathieu Net ({formatPercentage(breakdown.mathieuPercentage)})
              </div>
              <div className="text-2xl font-semibold text-green-900">
                {formatCurrency(breakdown.mathieuNet)}
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600 font-medium">
                Rosanna Net ({formatPercentage(breakdown.rosannaPercentage)})
              </div>
              <div className="text-2xl font-semibold text-red-900">
                {formatCurrency(breakdown.rosannaNet)}
              </div>
              <div className="text-xs text-red-600 mt-1">
                After {formatCurrency(breakdown.rosannaWithholding)} FTB withholding
              </div>
            </div>
          </div>

          {/* Editable Inputs */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Total Proceeds</Label>
              <Input
                type="number"
                value={inputs.totalProceeds}
                onChange={(e) => updateInput('totalProceeds', parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Rosanna FTB Withholding</Label>
              <Input
                type="number"
                value={inputs.rosannaWithholding}
                onChange={(e) => updateInput('rosannaWithholding', parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Evidence Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TAX_TIMELINE.map((event, idx) => (
              <div
                key={idx}
                className={`flex gap-4 p-4 rounded-lg border ${
                  event.critical
                    ? 'bg-red-50 border-red-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {event.critical ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-slate-600">{event.description}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.date}
                    </Badge>
                  </div>
                  {event.details && (
                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                      {event.details.map((detail, i) => (
                        <li key={i} className="ml-4">
                          • {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Key Personnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERSONNEL.map((person, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${person.color}`}>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm">{person.role}</div>
                    <div className="text-xs opacity-70">{person.organization}</div>
                    {person.email !== 'N/A' && (
                      <div className="text-xs mt-1 font-mono">{person.email}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
