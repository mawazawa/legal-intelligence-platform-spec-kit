/**
 * Type definitions for Tax Withholding Analysis
 * Single source of truth for tax-related types
 */

export interface TimelineEvent {
  date: string
  title: string
  description: string
  critical?: boolean
  icon: string // Icon name as string for data separation
  details?: string[]
}

export interface FinancialInputs {
  totalProceeds: number
  mathieuPercentage: number
  rosannaPercentage: number
  rosannaWithholding: number
  caWithholdingRate: number
}

export interface FinancialBreakdown {
  totalProceeds: number
  mathieuPercentage: number
  rosannaPercentage: number
  mathieuBase: number
  rosannaBase: number
  mathieuWithholding: number
  rosannaWithholding: number
  mathieuNet: number
  rosannaNet: number
  withholdingRate: number
}
