/**
 * Status and Priority Helper Functions
 * DRY: Reusable utilities for checklist status management
 */

import { RFOChecklistItem } from '@/types/checklist';

/**
 * Get priority badge color classes
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

/**
 * Get next status in cycle
 */
export function getNextStatus(currentStatus: RFOChecklistItem['status']): RFOChecklistItem['status'] {
  if (currentStatus === 'not-started') return 'in-progress';
  if (currentStatus === 'in-progress') return 'completed';
  return 'not-started';
}

/**
 * Get border color class based on status
 */
export function getStatusBorderColor(status: RFOChecklistItem['status']): string {
  switch (status) {
    case 'completed':
      return 'border-l-green-500 bg-green-50';
    case 'in-progress':
      return 'border-l-yellow-500 bg-yellow-50';
    default:
      return 'border-l-red-500 bg-white';
  }
}

/**
 * Get border color for optional items
 */
export function getOptionalBorderColor(): string {
  return 'border-l-gray-300 bg-white';
}

/**
 * Calculate progress statistics
 */
export function calculateProgress(items: RFOChecklistItem[]) {
  const completedCount = items.filter(item => item.status === 'completed').length;
  const totalRequired = items.filter(item => item.required).length;
  const requiredCompleted = items.filter(item => item.required && item.status === 'completed').length;
  const progressPercentage = totalRequired > 0 ? (requiredCompleted / totalRequired) * 100 : 0;

  const notStartedCount = items.filter(i => i.status === 'not-started').length;
  const inProgressCount = items.filter(i => i.status === 'in-progress').length;

  return {
    completedCount,
    totalRequired,
    requiredCompleted,
    progressPercentage,
    notStartedCount,
    inProgressCount
  };
}

/**
 * Calculate total estimated time for required items
 */
export function calculateEstimatedTime(items: RFOChecklistItem[]): number {
  return Math.ceil(
    items.filter(i => i.required).reduce((sum, i) => sum + i.estimatedMinutes, 0) / 60
  );
}

/**
 * Group items by category
 */
export function groupByCategory(items: RFOChecklistItem[]): Record<string, RFOChecklistItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, RFOChecklistItem[]>);
}
