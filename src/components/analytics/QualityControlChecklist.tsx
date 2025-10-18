// Re-export from the refactored module for backward compatibility
export { default, default as QualityControlChecklist } from './quality-control';
export type {
  QualityCheckItem,
  QualityControlChecklistProps,
  QualitySeverity,
  QualityCategory,
  ChecklistStats
} from './quality-control/types';
