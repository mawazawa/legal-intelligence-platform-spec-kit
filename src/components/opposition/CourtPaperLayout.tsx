'use client';

import React, { ReactNode } from 'react';

interface CourtPaperLayoutProps {
  children: ReactNode;
  className?: string;
  pageNumber?: number;
  totalPages?: number;
}

export default function CourtPaperLayout({
  children,
  className = '',
  pageNumber,
  totalPages
}: CourtPaperLayoutProps) {
  return (
    <div className={`court-paper-sheet bg-white shadow-2xl mx-auto my-8 max-w-[8.5in] relative ${className}`}>
      {/* Sophisticated Page Edge Shading - Paper Appearance */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none rounded-t-lg"></div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none rounded-b-lg"></div>
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none rounded-l-lg"></div>
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none rounded-r-lg"></div>

      {/* Court Page Content */}
      <div className="court-page relative z-10 bg-white min-h-[11in] p-12 md:p-16">
        {children}
      </div>

      {/* Page Number Footer */}
      {pageNumber && (
        <div className="absolute bottom-4 right-0 left-0 text-center text-xs text-slate-500 pointer-events-none">
          Page {pageNumber}{totalPages && ` of ${totalPages}`}
        </div>
      )}
    </div>
  );
}

interface CourtPageProps {
  children: ReactNode;
  className?: string;
  pageBreakBefore?: boolean;
  pageBreakAfter?: boolean;
}

export function CourtPage({ children, className = '', pageBreakBefore = false, pageBreakAfter = false }: CourtPageProps) {
  return (
    <div className={`
      ${pageBreakBefore ? 'page-break-before' : ''}
      ${pageBreakAfter ? 'page-break-after' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
