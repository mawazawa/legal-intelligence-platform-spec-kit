'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  FolderOpen,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Filings',
    icon: <FileText className="h-5 w-5" />,
    children: [
      { name: 'Court Filing Hub', href: '/court-filings' },
      { name: 'RFO Opposition Filing', href: '/rfo-opposition' },
      { name: 'Final Distribution', href: '/final-distribution' },
    ],
  },
  {
    name: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    children: [
      { name: 'Evidence Matrix', href: '/analytics/evidence-matrix' },
      { name: 'Continuances', href: '/analytics/continuances' },
      { name: 'Communications', href: '/analytics/communications' },
      { name: 'Scorecards', href: '/scorecards' },
    ],
  },
  {
    name: 'Evidence & Intake',
    icon: <FolderOpen className="h-5 w-5" />,
    children: [
      { name: 'Document Evidence', href: '/documents' },
      { name: 'Exhibit Packet', href: '/exhibits/packet' },
      { name: 'Intake (Dropzone)', href: '/intake' },
      { name: 'Case Financials', href: '/case-financials' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const initialOpenGroups = useMemo(() => {
    const open = new Set<string>();
    navigation.forEach((item) => {
      if (item.children?.some((child) => child.href && pathname.startsWith(child.href))) {
        open.add(item.name);
      }
    });
    return open;
  }, [pathname]);

  const [openGroups, setOpenGroups] = useState<Set<string>>(initialOpenGroups);

  React.useEffect(() => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      navigation.forEach((item) => {
        if (item.children?.some((child) => child.href && pathname.startsWith(child.href))) {
          next.add(item.name);
        }
      });
      return next;
    });
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const renderLink = (item: NavItem, depth = 0) => {
    const isActive = item.href ? pathname === item.href : false;
    return (
      <Link
        key={item.name}
        href={item.href ?? '#'}
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          'flex items-center justify-between px-4 py-2 rounded-lg text-sm transition',
          depth > 0 ? 'ml-6' : '',
          isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        )}
      >
        <span className="flex items-center gap-3">
          {depth === 0 && item.icon}
          <span>{item.name}</span>
        </span>
        {item.badge && (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const renderItem = (item: NavItem) => {
    if (!item.children?.length) {
      return renderLink(item);
    }

    const isOpen = openGroups.has(item.name);
    const isParentActive = item.children.some((child) => child.href && pathname.startsWith(child.href ?? ''));

    return (
      <div key={item.name} className="border border-slate-700/40 rounded-lg">
        <button
          onClick={() => toggleGroup(item.name)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left transition',
            isParentActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          )}
        >
          <span className="flex items-center gap-3">
            {item.icon}
            {item.name}
          </span>
          <span className={cn('text-xs transition-transform', isOpen ? 'rotate-90' : '')}>›</span>
        </button>
        {isOpen && (
          <div className="flex flex-col py-2">
            {item.children.map((child) => renderLink(child, 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
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

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen transition-transform duration-300',
          'w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Legal Intel</h1>
                <p className="text-slate-400 text-xs">FDI-21-794666</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map(renderItem)}
          </nav>
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
