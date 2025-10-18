# Evidence Heatmap Component

This directory contains the refactored Evidence Heatmap component, broken down from a 570 LOC monolith into a modular, maintainable structure.

## Structure

```
evidence-heatmap/
├── types.ts                    # TypeScript interfaces and types (64 LOC)
├── constants.ts                # Color schemes and configuration (55 LOC)
├── dataUtils.ts                # Data processing utilities (68 LOC)
├── colorUtils.ts               # Color calculation utilities (60 LOC)
├── exportUtils.ts              # Canvas export functionality (56 LOC)
├── Controls.tsx                # Control panel component (141 LOC)
├── HeatmapGrid.tsx             # Main grid visualization (97 LOC)
├── Legend.tsx                  # Legend display component (77 LOC)
├── SelectedCellDetails.tsx     # Cell detail view (50 LOC)
├── index.ts                    # Public exports
└── README.md                   # This file
```

## Main Component

**EvidenceHeatmap.tsx** - Main orchestrator component (104 LOC)
- Previously: 570 LOC monolith
- Now: Clean orchestrator delegating to specialized components
- Uses React.memo() for all subcomponents
- Implements useMemo() and useCallback() for performance

## Principles Applied

### SOLID
- **Single Responsibility**: Each file has one clear purpose
- **Open/Closed**: Easy to extend with new view modes or color schemes
- **Liskov Substitution**: Components are interchangeable via interfaces
- **Interface Segregation**: Props interfaces are minimal and focused
- **Dependency Inversion**: Components depend on abstractions (types)

### DRY (Don't Repeat Yourself)
- Color logic centralized in `colorUtils.ts`
- Data transformations in `dataUtils.ts`
- Constants defined once in `constants.ts`

### KISS (Keep It Simple, Stupid)
- Each component does one thing well
- Clear naming conventions
- Minimal prop drilling

## Component Details

### Controls.tsx
Renders all user controls:
- View mode toggle buttons (strength/category/timeline/verified)
- Display toggles (labels/values)
- Filter dropdowns
- Search input
- Export button

Props: `ControlsProps`

### HeatmapGrid.tsx
Renders the main heatmap visualization:
- Category and subcategory headers
- Color-coded cells with dynamic opacity
- Hover effects
- Click handlers

Props: `HeatmapGridProps`

### Legend.tsx
Displays color legend based on current view mode:
- Different legends for each view mode
- Automatically updates with view mode changes

Props: `LegendProps`

### SelectedCellDetails.tsx
Shows detailed information for selected cell:
- Cell metadata (category, strength, etc.)
- Tags display
- Conditionally rendered (only when cell selected)

Props: `SelectedCellDetailsProps`

## Utilities

### dataUtils.ts
- `transformEvidenceData()` - Convert raw evidence to HeatmapData
- `filterHeatmapData()` - Apply search and filter criteria
- `groupHeatmapData()` - Group data by category/subcategory
- `extractCategories()` - Get unique categories
- `extractSubcategories()` - Get unique subcategories

### colorUtils.ts
- `getCellColor()` - Calculate cell color based on view mode
- `getCellIntensity()` - Calculate cell opacity
- `getStrengthColor()` - Color for strength values
- `getCategoryColor()` - Color for categories
- `getTimelineColor()` - Color based on age
- `getVerifiedColor()` - Color based on verification status

### exportUtils.ts
- `exportHeatmapToCanvas()` - Export heatmap as PNG image

## Performance Optimizations

1. **React.memo()** on all components to prevent unnecessary re-renders
2. **useMemo()** for expensive computations (filtering, grouping)
3. **useCallback()** for event handlers to maintain referential equality
4. Extracted constants to prevent recreation on each render

## Type Safety

All components and utilities are fully typed with TypeScript:
- Strict prop types
- Type-safe utility functions
- Discriminated unions for view modes
- Const assertions for constants

## Testing Strategy

Each module can be tested independently:
- **Utils**: Pure functions - easy to unit test
- **Components**: React Testing Library for component tests
- **Integration**: Test main orchestrator with mocked data

## Future Enhancements

Easy to add:
- New view modes (add to ViewMode type + colorUtils)
- New color schemes (add to constants)
- Additional filters (add to ControlsProps)
- Export formats (extend exportUtils)

## Migration Notes

The refactored component is a drop-in replacement:
- Same external API (EvidenceHeatmapProps)
- Same behavior
- Zero functionality lost
- Improved maintainability and testability
