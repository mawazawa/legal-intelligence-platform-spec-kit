/**
 * Shared type definitions for checklist and RFO opposition features
 * DRY: Single source of truth for checklist-related types
 */

// RFO Opposition checklist item (comprehensive version)
export interface RFOChecklistItem {
  id: string
  category: string
  title: string
  description: string
  plainEnglish: string
  required: boolean
  conditionalOn?: string[]
  status: 'not-started' | 'in-progress' | 'completed'
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedMinutes: number
  documentUrl?: string
  helpUrl?: string
  attachments?: string[]
}

// FL-320 checklist item (simplified version)
export interface FL320ChecklistItem {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  category: 'form' | 'declaration' | 'exhibit' | 'supporting'
  filePath?: string
  dueDate?: string
  notes?: string
}

export interface RFOType {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  commonIn: string
  requiredForms: string[]
}
