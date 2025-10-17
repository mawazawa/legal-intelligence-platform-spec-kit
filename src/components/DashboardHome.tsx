'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calculator,
  Receipt,
  FileText,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Building,
  Calendar,
  DollarSign,
  Users,
  Clock,
  BarChart3,
  FileCheck,
  Scale,
  GitCompare
} from 'lucide-react';

export function DashboardHome() {
  const caseMetrics = [
    {
      title: 'Property Value',
      value: '$280,355.83',
      subtitle: 'Total Escrow Proceeds',
      icon: <Building className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Your Distribution',
      value: '$182,231.29',
      subtitle: '65% Court-Ordered',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Withholding Issue',
      value: '$13,694.62',
      subtitle: 'Rosanna FTB Withholding',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Days Since Close',
      value: '141',
      subtitle: 'Closed May 30, 2025',
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const quickActions = [
    {
      title: 'RFO Opposition Filing',
      description: 'Step-by-step guide to file your FL-320 response in plain English',
      href: '/rfo-opposition',
      icon: <FileCheck className="h-8 w-8" />,
      color: 'from-red-500 to-rose-600',
      badge: 'NEW'
    },
    {
      title: 'RFO Comparison',
      description: 'Side-by-side comparison of petitioner\'s RFO vs our FL-320 response',
      href: '/rfo-comparison',
      icon: <GitCompare className="h-8 w-8" />,
      color: 'from-orange-500 to-red-600',
      badge: 'NEW'
    },
    {
      title: 'Final Distribution Calculation',
      description: 'Court-ready property division calculation with Statement of Decision',
      href: '/final-distribution',
      icon: <Scale className="h-8 w-8" />,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Featured'
    },
    {
      title: 'Tax Withholding Analysis',
      description: 'Form 593 failure impact and FTB withholding breakdown',
      href: '/tax-withholding',
      icon: <Receipt className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Case Financials',
      description: 'Comprehensive financial breakdown and distribution scenarios',
      href: '/case-financials',
      icon: <FileText className="h-8 w-8" />,
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  const recentActivity = [
    {
      date: 'May 30, 2025',
      title: 'Property Sale Closed',
      description: '3525 8th Avenue - Escrow completed',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      date: 'May 30, 2025',
      title: 'FTB Withholding Applied',
      description: '$13,694.62 withheld from Rosanna&apos;s proceeds',
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />
    },
    {
      date: 'May 24, 2025',
      title: 'Form 593 Warning',
      description: 'Final notice from Melinda Cook about missing Form 593',
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />
    },
    {
      date: 'May 16, 2025',
      title: 'Document Requirements Sent',
      description: 'Mathieu documented Form 593 wet signature requirement',
      icon: <FileText className="h-5 w-5 text-blue-600" />
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Case Dashboard</h1>
          <p className="text-slate-600 mt-1">Mathieu Wauters v. Rosanna Alvero (FDI-21-794666)</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Clock className="h-4 w-4 mr-2" />
          Active
        </Badge>
      </div>

      {/* Critical Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Critical Finding:</strong> $13,694.62 withheld due to incomplete Form 593.
          <Link href="/tax-withholding" className="underline ml-2 font-semibold">
            View Analysis →
          </Link>
        </AlertDescription>
      </Alert>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {caseMetrics.map((metric, index) => (
          <Card key={index} className="shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900">{metric.value}</h3>
              <p className="text-sm font-semibold text-slate-700">{metric.title}</p>
              <p className="text-xs text-slate-500 mt-1">{metric.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="shadow-sm border-0 bg-white hover:shadow-lg transition-all duration-200 h-full cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    {action.badge && (
                      <Badge className="bg-green-500 text-white">{action.badge}</Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">{action.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Open Tool <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Case Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 pb-4 border-b border-slate-100 last:border-0">
                    <div className="mt-0.5">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900">{activity.title}</p>
                        <Badge variant="outline" className="text-xs">{activity.date}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/timeline"
                className="flex items-center justify-center mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                View Full Timeline <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Case Summary */}
        <div className="space-y-4">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center text-base">
                <Users className="h-4 w-4 mr-2" />
                Distribution Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Mathieu Wauters</span>
                  <span className="text-xs font-semibold text-green-600">65%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[65%]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">$182,231.29 received</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Rosanna Alvero</span>
                  <span className="text-xs font-semibold text-orange-600">35%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[35%]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">$84,429.92 after withholding</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-900">Form 593 Status</h3>
              </div>
              <p className="text-sm text-green-800 mb-2">
                ✓ Your Form 593 properly completed
              </p>
              <p className="text-sm text-green-800">
                ✓ No withholding on your proceeds
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="font-semibold text-red-900">Respondent Issue</h3>
              </div>
              <p className="text-sm text-red-800 mb-2">
                ✗ Rosanna&apos;s Form 593 incomplete
              </p>
              <p className="text-sm text-red-800">
                ✗ $13,694.62 withheld by FTB
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
