'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  React.useEffect(() => {
    const handler = () => {
      try {
        document.querySelectorAll('details').forEach((d) => (d as HTMLDetailsElement).open = true);
      } catch {}
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeprint', handler);
      return () => window.removeEventListener('beforeprint', handler);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
