import { FilingTask } from '../types';

export const filingTasks: FilingTask[] = [
  {
    id: 'fl320-form',
    title: 'Complete FL-320 Responsive Declaration',
    description: 'Fill out the official court form with all required information',
    status: 'completed',
    priority: 'high',
    category: 'document',
    dueDate: '2025-01-15',
    completedDate: '2025-01-10',
    estimatedTime: '2 hours',
    documents: ['FL-320.pdf', 'Responsive_Declaration_Final.md']
  },
  {
    id: 'mathematical-analysis',
    title: 'Mathematical Error Analysis',
    description: 'Document the $77,779.88 double-counting error in Petitioner\'s RFO',
    status: 'completed',
    priority: 'high',
    category: 'calculation',
    dueDate: '2025-01-15',
    completedDate: '2025-01-10',
    estimatedTime: '1 hour',
    documents: ['RFO_ANALYSIS.md', 'DATA_VISUALIZATIONS.md']
  },
  {
    id: 'timeline-analysis',
    title: 'Timeline and Possession Analysis',
    description: 'Establish November 16, 2024 as possession transfer date',
    status: 'completed',
    priority: 'high',
    category: 'evidence',
    dueDate: '2025-01-15',
    completedDate: '2025-01-10',
    estimatedTime: '1 hour',
    documents: ['Timeline_Analysis.md']
  },
  {
    id: 'evidence-gathering',
    title: 'Evidence Gathering and Organization',
    description: 'Collect all supporting documents and organize by category',
    status: 'in_progress',
    priority: 'high',
    category: 'evidence',
    dueDate: '2025-01-15',
    estimatedTime: '3 hours',
    documents: ['Escrow_Statement.pdf', 'Court_Orders.pdf', 'Email_Records.pdf']
  },
  {
    id: 'legal-research',
    title: 'Legal Research and Citations',
    description: 'Research relevant case law and statutory authorities',
    status: 'pending',
    priority: 'medium',
    category: 'legal',
    dueDate: '2025-01-15',
    estimatedTime: '2 hours',
    documents: ['Legal_Authorities.md']
  },
  {
    id: 'exhibits-preparation',
    title: 'Exhibits Preparation',
    description: 'Prepare and index all exhibits for filing',
    status: 'pending',
    priority: 'high',
    category: 'document',
    dueDate: '2025-01-15',
    estimatedTime: '2 hours',
    documents: ['Exhibit_Index.md']
  },
  {
    id: 'proofreading',
    title: 'Proofreading and Review',
    description: 'Final review of all documents for accuracy and completeness',
    status: 'pending',
    priority: 'high',
    category: 'document',
    dueDate: '2025-01-15',
    estimatedTime: '1 hour',
    dependencies: ['fl320-form', 'mathematical-analysis', 'timeline-analysis']
  },
  {
    id: 'filing-submission',
    title: 'Court Filing Submission',
    description: 'Submit all documents to the court and serve on opposing counsel',
    status: 'pending',
    priority: 'high',
    category: 'filing',
    dueDate: '2025-01-15',
    estimatedTime: '30 minutes',
    dependencies: ['proofreading', 'exhibits-preparation']
  }
];
