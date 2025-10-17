'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calculator,
  Receipt,
  FileText,
  Clock,
  BarChart3,
  Menu,
  X,
  Home,
  FolderOpen,
  Scale,
  FileCheck,
  GitCompare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'RFO Opposition Filing', href: '/rfo-opposition', icon: <FileCheck className="h-5 w-5" />, badge: 'NEW' },
  { name: 'RFO Comparison', href: '/rfo-comparison', icon: <GitCompare className="h-5 w-5" />, badge: 'NEW' },
  { name: 'Final Distribution', href: '/final-distribution', icon: <Scale className="h-5 w-5" /> },
  { name: 'FL-320 Checklist', href: '/fl320-checklist', icon: <FileText className="h-5 w-5" /> },
  { name: 'Housing Costs', href: '/housing-costs', icon: <Calculator className="h-5 w-5" /> },
  { name: 'Tax Withholding', href: '/tax-withholding', icon: <Receipt className="h-5 w-5" /> },
  { name: 'Case Financials', href: '/case-financials', icon: <FileText className="h-5 w-5" /> },
  { name: 'Case Timeline', href: '/timeline', icon: <Clock className="h-5 w-5" /> },
  { name: 'Document Evidence', href: '/documents', icon: <FolderOpen className="h-5 w-5" /> },
  { name: 'Scorecards', href: '/scorecards', icon: <BarChart3 className="h-5 w-5" /> },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-slate-200"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-slate-700" />
        ) : (
          <Menu className="h-6 w-6 text-slate-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform duration-300",
          "w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Legal Intel</h1>
                <p className="text-slate-400 text-xs">FDI-21-794666</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-300 text-xs font-semibold mb-1">Case Status</p>
              <p className="text-slate-400 text-[11px]">Property Sale Closed</p>
              <p className="text-slate-400 text-[11px]">May 30, 2025</p>
              <div className="mt-2 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
