/**
 * RFO (Request for Order) Type Configuration
 * DRY: Single source of truth for RFO types across the application
 */

import { RFOType } from '@/types/checklist'

export const RFO_TYPES: RFOType[] = [
  {
    id: 'child-support',
    name: 'Child Support',
    icon: 'Baby', // Store as string, render as component in UI
    description: 'Response to requests about child support payments',
    commonIn: 'Divorce, separation, or paternity cases',
    requiredForms: ['FL-320', 'FL-150']
  },
  {
    id: 'spousal-support',
    name: 'Spousal Support',
    icon: 'Users',
    description: 'Response to requests about spousal/partner support',
    commonIn: 'Divorce or domestic partnership dissolution',
    requiredForms: ['FL-320', 'FL-150']
  },
  {
    id: 'property-division',
    name: 'Property Division',
    icon: 'Home',
    description: 'Response to requests about dividing property or assets',
    commonIn: 'Divorce, legal separation',
    requiredForms: ['FL-320', 'FL-150', 'Detailed Financials']
  },
  {
    id: 'custody-visitation',
    name: 'Child Custody/Visitation',
    icon: 'Baby',
    description: 'Response to requests about custody or parenting time',
    commonIn: 'Divorce, separation, paternity, modification cases',
    requiredForms: ['FL-320', 'FL-105', 'FL-311']
  },
  {
    id: 'attorney-fees',
    name: 'Attorney Fees',
    icon: 'Briefcase',
    description: 'Response to requests for attorney fee payments',
    commonIn: 'Any family law case',
    requiredForms: ['FL-320', 'FL-150', 'FL-319']
  }
]
