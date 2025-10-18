'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Calculator,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Info,
  Scale,
  Receipt,
  TrendingUp,
  Users,
  Building,
  CreditCard,
  FileCheck,
  HelpCircle,
  Calendar,
  Mail,
  UserCheck,
  XCircle
} from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  critical?: boolean;
  icon: React.ReactNode;
  details?: string[];
}

interface FinancialBreakdown {
  totalProceeds: number;
  mathieuPercentage: number;
  rosannaPercentage: number;
  mathieuBase: number;
  rosannaBase: number;
  mathieuWithholding: number;
  rosannaWithholding: number;
  mathieuNet: number;
  rosannaNet: number;
  withholdingRate: number;
}

const TaxWithholdingAnalysis: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    executive: true,
    timeline: false,
    financial: true,
    personnel: false,
    legal: false,
    evidence: false
  });

  const [financialInputs, setFinancialInputs] = useState({
    totalProceeds: 280355.83,
    mathieuPercentage: 65,
    rosannaPercentage: 35,
    rosannaWithholding: 13694.62,
    caWithholdingRate: 3.33
  });

  const financialBreakdown = useMemo((): FinancialBreakdown => {
    const mathieuBase = financialInputs.totalProceeds * (financialInputs.mathieuPercentage / 100);
    const rosannaBase = financialInputs.totalProceeds * (financialInputs.rosannaPercentage / 100);

    // Mathieu's franchise tax reversal: Rosanna took hers out ($8,901.50 - 65% of $13,694.62),
    // so Mathieu does the same with his matching share
    const mathieuFranchiseTaxReversal = 8901.50;

    return {
      totalProceeds: financialInputs.totalProceeds,
      mathieuPercentage: financialInputs.mathieuPercentage,
      rosannaPercentage: financialInputs.rosannaPercentage,
      mathieuBase,
      rosannaBase,
      mathieuWithholding: 0,
      rosannaWithholding: financialInputs.rosannaWithholding,
      mathieuNet: mathieuBase + mathieuFranchiseTaxReversal,
      rosannaNet: rosannaBase - financialInputs.rosannaWithholding,
      withholdingRate: financialInputs.caWithholdingRate
    };
  }, [financialInputs]);

  const timeline: TimelineEvent[] = [
    {
      date: 'May 15, 2025',
      title: 'Escrow Package Initiated',
      description: 'Tom Rotert sent initial escrow package for signatures',
      icon: <FileText className="h-5 w-5" />,
      details: ['Melinda Cook initiated seller opening package via DocuSign']
    },
    {
      date: 'May 16, 2025',
      title: 'CRITICAL: Form 593 Requirements Documented',
      description: 'Mathieu sent urgent email listing all required documents',
      critical: true,
      icon: <AlertTriangle className="h-5 w-5" />,
      details: [
        'Documents requiring notarization: Grant Deed, Disbursement Instructions',
        'Documents requiring wet signature: E-Signature Authorization',
        '⚠️ CA Form 593 (Real Estate Withholding Statement) - WET SIGNATURE REQUIRED'
      ]
    },
    {
      date: 'May 20, 2025',
      title: 'Form 593 Issues Identified',
      description: 'Melinda Cook noted missing information on Mathieu&apos;s Form 593',
      icon: <Mail className="h-5 w-5" />,
      details: [
        'SSN was redacted on form',
        'Would be sent to California FTB unless corrected',
        'Withholding would apply if not properly completed'
      ]
    },
    {
      date: 'May 22-24, 2025',
      title: 'Multiple Amendment Requests',
      description: 'DocuSign requests for Estimate & Final Amendment',
      icon: <FileCheck className="h-5 w-5" />,
      details: ['References to FTB withholding requirements in escrow amendments']
    },
    {
      date: 'May 24, 2025',
      title: 'Final Warning on Form 593',
      description: 'Melinda Cook stressed importance of corrected Form 593',
      critical: true,
      icon: <AlertTriangle className="h-5 w-5" />,
      details: [
        'Needed "appropriate perjury statement selected"',
        'Could not revise estimates without proper Form 593',
        'Withholding would be mandatory without corrected form'
      ]
    },
    {
      date: 'May 30, 2025',
      title: 'ESCROW CLOSED',
      description: 'Property sale completed - 3525 8th Avenue',
      critical: true,
      icon: <Building className="h-5 w-5" />,
      details: [
        'Jenny Jantzen confirmed closing',
        '$13,694.62 withheld from Rosanna&apos;s proceeds',
        'Withholding sent to California FTB'
      ]
    }
  ];

  const personnel = [
    {
      name: 'Melinda Cook',
      role: 'Escrow Officer',
      organization: 'Chartwell Escrow',
      email: 'mcook@chartwellescrow.com',
      icon: <UserCheck className="h-4 w-4" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      name: 'Cheri Bonilla',
      role: 'Escrow Support',
      organization: 'Chartwell Escrow',
      email: 'cherib@chartwellescrow.com',
      icon: <UserCheck className="h-4 w-4" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      name: 'Tom Rotert',
      role: 'Real Estate Agent',
      organization: 'Independent',
      email: 'tjrotert@gmail.com',
      icon: <Building className="h-4 w-4" />,
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      name: 'Ron Melendez',
      role: 'Real Estate Agent',
      organization: 'Stephanie Younger Group',
      email: 'N/A',
      icon: <Building className="h-4 w-4" />,
      color: 'bg-green-50 border-green-200 text-green-800'
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: string, value: number) => {
    setFinancialInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Receipt className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800">Tax Withholding Analysis</h1>
                <p className="text-lg text-slate-600">3525 8th Avenue Property Sale</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              Case: Mathieu Wauters v. Rosanna Alvero (FDI-21-794666)
            </Badge>
          </div>

          {/* Executive Summary */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg cursor-pointer"
              onClick={() => toggleSection('executive')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Executive Summary - Critical Finding
                </div>
                {expandedSections.executive ?
                  <ChevronDown className="h-5 w-5" /> :
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
            {expandedSections.executive && (
              <CardContent className="p-6">
                <Alert className="border-red-200 bg-red-50 mb-4">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>KEY FINDING:</strong> Rosanna Alvero failed to complete her Form 593 (California Real Estate Withholding Statement),
                    resulting in <strong>$13,694.62</strong> being withheld from her proceeds and sent to the California Franchise Tax Board (FTB).
                    Mathieu Wauters completed his Form 593, avoiding tax withholding on his portion.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-green-900">Mathieu Wauters</h3>
                    </div>
                    <p className="text-sm text-green-800">
                      ✓ Completed Form 593 properly<br />
                      ✓ No withholding applied<br />
                      ✓ Received full 65% distribution
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="font-semibold text-red-900">Rosanna Alvero</h3>
                    </div>
                    <p className="text-sm text-red-800">
                      ✗ Failed to complete Form 593<br />
                      ✗ $13,694.62 withheld by FTB<br />
                      ✗ Received reduced distribution
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Financial Breakdown */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg cursor-pointer"
              onClick={() => toggleSection('financial')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Financial Impact Analysis
                </div>
                {expandedSections.financial ?
                  <ChevronDown className="h-5 w-5" /> :
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
              <p className="text-emerald-100 text-sm">Interactive calculator with real-time updates</p>
            </CardHeader>
            {expandedSections.financial && (
              <CardContent className="p-6">
                {/* Input Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-slate-800 mb-4">Escrow Parameters</h3>

                    <div className="space-y-2">
                      <Label htmlFor="totalProceeds" className="text-sm font-medium text-slate-700">
                        Total Escrow Proceeds
                      </Label>
                      <div className="relative">
                        <Input
                          id="totalProceeds"
                          type="number"
                          value={financialInputs.totalProceeds}
                          onChange={(e) => handleInputChange('totalProceeds', parseFloat(e.target.value) || 0)}
                          className="pl-8 text-lg font-bold"
                        />
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mathieuPct" className="text-sm font-medium text-slate-700">
                          Mathieu %
                        </Label>
                        <Input
                          id="mathieuPct"
                          type="number"
                          value={financialInputs.mathieuPercentage}
                          onChange={(e) => handleInputChange('mathieuPercentage', parseFloat(e.target.value) || 0)}
                          className="text-lg font-bold"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rosannaPct" className="text-sm font-medium text-slate-700">
                          Rosanna %
                        </Label>
                        <Input
                          id="rosannaPct"
                          type="number"
                          value={financialInputs.rosannaPercentage}
                          onChange={(e) => handleInputChange('rosannaPercentage', parseFloat(e.target.value) || 0)}
                          className="text-lg font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rosannaWithholding" className="text-sm font-medium text-slate-700">
                        Rosanna&apos;s FTB Withholding
                      </Label>
                      <div className="relative">
                        <Input
                          id="rosannaWithholding"
                          type="number"
                          value={financialInputs.rosannaWithholding}
                          onChange={(e) => handleInputChange('rosannaWithholding', parseFloat(e.target.value) || 0)}
                          className="pl-8 text-lg font-bold bg-red-50 border-red-300"
                        />
                        <AlertTriangle className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                      </div>
                    </div>
                  </div>

                  {/* Results Panel */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-slate-800 mb-4">Distribution Results</h3>

                    {/* Total */}
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">Total Escrow Proceeds</p>
                      <p className="text-3xl font-black text-slate-800">
                        ${financialBreakdown.totalProceeds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Mathieu */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="font-semibold text-green-900">Mathieu Wauters</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{financialInputs.mathieuPercentage}%</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Base Distribution:</span>
                          <span className="font-mono font-bold text-green-900">
                            ${financialBreakdown.mathieuBase.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Tax Withholding:</span>
                          <span className="font-mono font-bold text-green-900">$0.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Franchise Tax Reversal:</span>
                          <span className="font-mono font-bold text-green-600">
                            +$8,901.50
                          </span>
                        </div>
                        <div className="border-t border-green-300 pt-1 mt-1"></div>
                        <div className="flex justify-between">
                          <span className="text-green-700 font-semibold">Net Received:</span>
                          <span className="font-mono font-bold text-green-900 text-lg">
                            ${financialBreakdown.mathieuNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rosanna */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                          <span className="font-semibold text-red-900">Rosanna Alvero</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{financialInputs.rosannaPercentage}%</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-red-700">Base Distribution:</span>
                          <span className="font-mono font-bold text-red-900">
                            ${financialBreakdown.rosannaBase.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700">Tax Withholding:</span>
                          <span className="font-mono font-bold text-red-600">
                            -${financialBreakdown.rosannaWithholding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="border-t border-red-300 pt-1 mt-1"></div>
                        <div className="flex justify-between">
                          <span className="text-red-700 font-semibold">Net Received:</span>
                          <span className="font-mono font-bold text-red-900 text-lg">
                            ${financialBreakdown.rosannaNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Withholding Rate Info */}
                    <Alert className="border-purple-200 bg-purple-50">
                      <Info className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-800 text-xs">
                        California requires {financialInputs.caWithholdingRate}% withholding on real estate sales unless Form 593 exemption is filed
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Financial Impact Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-orange-700 mb-1">Total Withheld by FTB:</p>
                      <p className="text-2xl font-black text-orange-900">
                        ${financialBreakdown.rosannaWithholding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-orange-700 mb-1">Effective Withholding Rate:</p>
                      <p className="text-2xl font-black text-orange-900">
                        {((financialBreakdown.rosannaWithholding / financialBreakdown.rosannaBase) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-orange-700 mb-1">Potential Tax Credit:</p>
                      <p className="text-2xl font-black text-orange-900">
                        ${financialBreakdown.rosannaWithholding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Timeline */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg cursor-pointer"
              onClick={() => toggleSection('timeline')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Timeline of Events
                </div>
                {expandedSections.timeline ?
                  <ChevronDown className="h-5 w-5" /> :
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
              <p className="text-blue-100 text-sm">Chronological documentation of Form 593 issues</p>
            </CardHeader>
            {expandedSections.timeline && (
              <CardContent className="p-6">
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div
                      key={index}
                      className={`border rounded-xl p-4 ${
                        event.critical
                          ? 'bg-red-50 border-red-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg mr-4 ${
                          event.critical ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {event.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-semibold ${
                              event.critical ? 'text-red-900' : 'text-blue-900'
                            }`}>
                              {event.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {event.date}
                            </Badge>
                          </div>
                          <p className={`text-sm mb-2 ${
                            event.critical ? 'text-red-800' : 'text-blue-800'
                          }`}>
                            {event.description}
                          </p>
                          {event.details && (
                            <ul className={`text-xs space-y-1 ${
                              event.critical ? 'text-red-700' : 'text-blue-700'
                            }`}>
                              {event.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Personnel */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader
              className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg cursor-pointer"
              onClick={() => toggleSection('personnel')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Key Personnel Involved
                </div>
                {expandedSections.personnel ?
                  <ChevronDown className="h-5 w-5" /> :
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
            {expandedSections.personnel && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personnel.map((person, index) => (
                    <div key={index} className={`border rounded-xl p-4 ${person.color}`}>
                      <div className="flex items-center mb-2">
                        {person.icon}
                        <h4 className="font-semibold ml-2">{person.name}</h4>
                      </div>
                      <p className="text-sm font-medium">{person.role}</p>
                      <p className="text-sm opacity-75">{person.organization}</p>
                      <p className="text-xs font-mono mt-2">{person.email}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Legal Implications */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg cursor-pointer"
              onClick={() => toggleSection('legal')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Scale className="h-5 w-5 mr-2" />
                  Legal Implications & Requirements
                </div>
                {expandedSections.legal ?
                  <ChevronDown className="h-5 w-5" /> :
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
            {expandedSections.legal && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-3">California Real Estate Withholding Requirements</h4>
                    <ul className="text-sm text-purple-800 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>California law requires 3⅓% withholding on real estate sales</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Sellers can avoid withholding by completing Form 593 and certifying exemptions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Common exemptions: principal residence, loss on sale, exchange property</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-900 mb-3">Distribution Accounting Considerations</h4>
                    <p className="text-sm text-orange-800 mb-3">
                      The $13,694.62 withheld from Rosanna&apos;s proceeds must be considered when calculating final distributions:
                    </p>
                    <ul className="text-sm text-orange-800 space-y-2">
                      <li className="flex items-start">
                        <span className="font-bold mr-2">1.</span>
                        <span>Tax payment made on her behalf to California FTB</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">2.</span>
                        <span>Reduction in her net cash proceeds</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">3.</span>
                        <span>Potential credit on her 2025 California tax return</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-semibold text-green-900">Mathieu&apos;s Status</h4>
                      </div>
                      <p className="text-sm text-green-800">
                        Properly completed Form 593, avoiding withholding. Full distribution received as allocated by court order.
                      </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                        <h4 className="font-semibold text-red-900">Rosanna&apos;s Status</h4>
                      </div>
                      <p className="text-sm text-red-800">
                        Failed to complete/submit Form 593, triggering mandatory withholding. Reduced net proceeds received.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Evidence & Recommendations */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg cursor-pointer"
              onClick={() => toggleSection('evidence')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2" />
                  Supporting Evidence & Recommendations
                </div>
                {expandedSections.evidence ?
                  <ChevronDown className="h-5 w-5" /> :
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
            {expandedSections.evidence && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-teal-900 mb-3">Email Evidence</h4>
                    <div className="space-y-2">
                      {[
                        { date: 'May 16, 2025', content: 'Mathieu&apos;s email listing Form 593 as requiring wet signature' },
                        { date: 'May 20, 2025', content: 'Melinda Cook&apos;s email about completing missing fields on Form 593' },
                        { date: 'May 24, 2025', content: 'Melinda Cook&apos;s email about needing corrected Form 593 with perjury statement' },
                        { date: 'Multiple dates', content: 'Draft emails referencing "$13,694.62" as Rosanna&apos;s tax withholding amount' }
                      ].map((evidence, index) => (
                        <div key={index} className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <Mail className="h-4 w-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-teal-900">{evidence.date}</p>
                              <p className="text-sm text-teal-800">{evidence.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-teal-900 mb-3">Key Phrases from Emails</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <ul className="text-sm text-slate-700 space-y-2 font-mono">
                        <li>&quot;CA Form 593 (Real Estate Withholding Statement)&quot;</li>
                        <li>&quot;Tax Withholding (Rosanna): $13,694.62&quot;</li>
                        <li>&quot;I&apos;ll need to revise the estimate...unless I receive your corrected 593&quot;</li>
                        <li>&quot;send to California FTB, along with the withholding check, at close of escrow&quot;</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-orange-900 mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {[
                        { title: 'Verify with FTB', desc: 'Confirm the $13,694.62 payment was received and credited to Rosanna&apos;s tax account' },
                        { title: 'Document Trail', desc: 'Maintain all emails and Form 593 documentation for tax and legal records' },
                        { title: 'Tax Planning', desc: 'Rosanna should consult tax advisor about claiming the withholding credit on 2025 return' },
                        { title: 'Final Accounting', desc: 'Ensure any settlement calculations properly reflect this withholding' }
                      ].map((rec, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-orange-900">{rec.title}</p>
                              <p className="text-sm text-orange-800">{rec.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Footer */}
          <div className="text-center p-6 bg-white/50 rounded-xl">
            <p className="text-slate-600 text-sm mb-2">
              Analysis based on email review from Mail/*.mbox files in Google Takeout archive
            </p>
            <p className="text-slate-500 text-xs">
              Case: FDI-21-794666 | Property: 3525 8th Avenue | Closing Date: May 30, 2025
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TaxWithholdingAnalysis;
