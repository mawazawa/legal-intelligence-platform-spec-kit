# RFO Opposition - Quick Reference Guide

## Component Map

### Step Flow
1. **RFOTypeSelector** → User selects RFO type
2. **DeadlineCalculator** → User enters hearing date
3. **ProgressDashboard + ChecklistTabs** → User tracks checklist

### Component Responsibility Matrix

| Component | Responsibility | Props |
|-----------|---------------|-------|
| **PageHeader** | Display title/subtitle | None |
| **RFOTypeSelector** | RFO type selection UI | selectedRFOType, onSelectRFOType, onContinue |
| **DeadlineCalculator** | Date input & deadline display | hearingDate, onHearingDateChange, filingDeadline, daysUntilDeadline, checklistItems, onBack, onContinue |
| **ProgressDashboard** | Progress metrics & warnings | checklistItems, daysUntilDeadline, filingDeadline |
| **ChecklistTabs** | Tab organization | checklistItems, onToggleItemStatus |
| **ChecklistItemCard** | Full checklist item | item, onToggleStatus |
| **OptionalItemCard** | Simplified optional item | item, onToggleStatus |
| **HelpfulResources** | Resource links | None |
| **ChecklistNavigation** | Footer navigation | requiredCompleted, totalRequired, onBack |
| **StatusIcon** | Status indicator | status |

## Data Flow

```
User Action
    ↓
page.tsx (orchestrator)
    ↓
useRFOOpposition (hook)
    ↓
buildChecklistForRFOType (data builder)
    ↓
Component (presentation)
```

## Adding a New RFO Type

1. Update `/data/rfo-types.ts` with new type definition
2. Add forms to `/app/rfo-opposition/data/checklist-items.ts`
3. Update `buildChecklistForRFOType()` function

Example:
```typescript
if (rfoType === 'new-type') {
  items.push(...NEW_TYPE_FORMS);
}
```

## Common Tasks

### Modify Checklist Item
Edit: `data/checklist-items.ts`

### Change Status Logic
Edit: `utils/status-helpers.ts`

### Update UI Component
Edit: `components/[ComponentName].tsx`

### Add New Calculation
Edit: `hooks/useRFOOpposition.ts`

### Modify Styles
Edit component directly (Tailwind classes)

## Testing Checklist

- [ ] RFO type selection works
- [ ] Date input calculates deadline correctly
- [ ] Checklist items toggle through statuses
- [ ] Progress bar updates
- [ ] Tabs switch correctly
- [ ] All links work
- [ ] Print function works
- [ ] Responsive on mobile
- [ ] TypeScript compiles without errors

## Performance Notes

All components are memoized with `React.memo()` to prevent unnecessary re-renders.

## Import Pattern

```typescript
import { ComponentName } from './components';
import { buildChecklistForRFOType } from './data/checklist-items';
import { useRFOOpposition } from './hooks/useRFOOpposition';
import { calculateProgress } from './utils/status-helpers';
```
