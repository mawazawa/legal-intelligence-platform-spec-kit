import {
  LayoutDashboard,
  FileText,
  BarChart3,
  FolderOpen,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href?: string;
  icon?: LucideIcon;
  badge?: string;
  children?: NavItem[];
}

/**
 * Single source of truth for all navigation in the app.
 * Used by Sidebar, breadcrumbs, and any navigation UI.
 */
export const navigationConfig: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Filings',
    icon: FileText,
    children: [
      { name: 'Court Filing Hub', href: '/court-filings' },
      { name: 'RFO Opposition Filing', href: '/rfo-opposition', badge: 'URGENT' },
      { name: 'Opposition Assistant', href: '/opposition-assistant', badge: 'NEW' },
      { name: 'Final Distribution', href: '/final-distribution' },
      { name: 'Responsive Declaration', href: '/responsive-declaration' },
      { name: 'Integrated FL-320 Pleading', href: '/pleadings/fl320-pleading' },
      { name: 'RFO Comparison', href: '/rfo-comparison' },
    ],
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    children: [
      { name: 'Evidence Matrix', href: '/analytics/evidence-matrix' },
      { name: 'Continuances', href: '/analytics/continuances' },
      { name: 'Communications', href: '/analytics/communications' },
      { name: 'Claims Analysis', href: '/analytics/claims' },
      { name: 'RFO Analysis', href: '/analytics/rfo-analysis' },
      { name: 'Scorecards', href: '/scorecards' },
    ],
  },
  {
    name: 'Evidence & Intake',
    icon: FolderOpen,
    children: [
      { name: 'Evidence Management', href: '/evidence', badge: 'NEW' },
      { name: 'Document Evidence', href: '/documents' },
      { name: 'Exhibit Packet', href: '/exhibits/packet' },
      { name: 'Intake (Dropzone)', href: '/intake' },
      { name: 'Case Financials', href: '/case-financials' },
      { name: 'Tax Withholding', href: '/tax-withholding' },
    ],
  },
];

export const APP_NAME = 'Legal Intelligence Platform';
export const CASE_NUMBER = 'FDI-21-794666';
export const CASE_TITLE = 'Wauters v. Alvero';
