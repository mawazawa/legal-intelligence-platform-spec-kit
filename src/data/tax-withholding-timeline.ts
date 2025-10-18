/**
 * Tax Withholding Timeline Data
 * Chronological events related to Form 593 failure and FTB withholding
 */

import { TimelineEvent } from '@/types/tax-withholding'

export const TAX_TIMELINE: TimelineEvent[] = [
  {
    date: 'May 15, 2025',
    title: 'Escrow Package Initiated',
    description: 'Tom Rotert sent initial escrow package for signatures',
    icon: 'FileText',
    details: ['Melinda Cook initiated seller opening package via DocuSign']
  },
  {
    date: 'May 16, 2025',
    title: 'CRITICAL: Form 593 Requirements Documented',
    description: 'Mathieu sent urgent email listing all required documents',
    critical: true,
    icon: 'AlertTriangle',
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
    icon: 'Mail',
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
    icon: 'FileCheck',
    details: ['References to FTB withholding requirements in escrow amendments']
  },
  {
    date: 'May 24, 2025',
    title: 'Final Warning on Form 593',
    description: 'Melinda Cook stressed importance of corrected Form 593',
    critical: true,
    icon: 'AlertTriangle',
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
    icon: 'Building',
    details: [
      'Jenny Jantzen confirmed closing',
      '$13,694.62 withheld from Rosanna&apos;s proceeds',
      'Withholding sent to California FTB'
    ]
  }
]

export const DEFAULT_FINANCIAL_INPUTS = {
  totalProceeds: 280355.83,
  mathieuPercentage: 65,
  rosannaPercentage: 35,
  rosannaWithholding: 13694.62,
  caWithholdingRate: 3.33
}

export const PERSONNEL = [
  {
    name: 'Melinda Cook',
    role: 'Escrow Officer',
    organization: 'Chartwell Escrow',
    email: 'mcook@chartwellescrow.com',
    icon: 'UserCheck',
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  {
    name: 'Cheri Bonilla',
    role: 'Escrow Support',
    organization: 'Chartwell Escrow',
    email: 'cherib@chartwellescrow.com',
    icon: 'UserCheck',
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  {
    name: 'Tom Rotert',
    role: 'Real Estate Agent',
    organization: 'Independent',
    email: 'tjrotert@gmail.com',
    icon: 'Building',
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  {
    name: 'Ron Melendez',
    role: 'Real Estate Agent',
    organization: 'Stephanie Younger Group',
    email: 'N/A',
    icon: 'Building',
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  {
    name: 'Jenny Jantzen',
    role: 'Escrow Manager',
    organization: 'Chartwell Escrow',
    email: 'jantzen@chartwellescrow.com',
    icon: 'UserCheck',
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  {
    name: 'Mathieu Wauters',
    role: 'Respondent / Pro Se',
    organization: 'Self-Represented Litigant',
    email: 'mawazawa@gmail.com',
    icon: 'User',
    color: 'bg-purple-50 border-purple-200 text-purple-800'
  },
  {
    name: 'Rosanna Alvero',
    role: 'Petitioner',
    organization: 'Represented by Counsel',
    email: 'N/A',
    icon: 'User',
    color: 'bg-orange-50 border-orange-200 text-orange-800'
  }
]
