# JusticeOS™ Migration Guide

## Overview

This guide explains how to migrate existing code to use the new infrastructure systems created in Phase 1.

## Quick Migration Examples

### 1. Replace Fetch Calls with safeFetch

#### Before
```typescript
fetch('/api/case-financials/source?file=petitioner_rfo')
  .then(r => r.ok ? r.json() : null)
  .then(d => setPetitionerRFO(d?.text || ''))
  .catch(() => setPetitionerRFO(''));
```

#### After
```typescript
import { safeFetch } from '@/lib/api/fetch';

const { data, error } = await safeFetch<SourceData>(
  '/api/case-financials/source?file=petitioner_rfo',
  { timeout: 5000, retries: 2 }
);

if (error) {
  logger.error('Failed to fetch source', error);
  setPetitionerRFO('');
  return;
}

setPetitionerRFO(data?.text || '');
```

### 2. Replace console.log with logger

#### Before
```typescript
console.log('Connection established');
console.error('Failed to connect:', error);
```

#### After
```typescript
import { logger } from '@/lib/logging/logger';

logger.info('Connection established');
logger.error('Failed to connect', error);
```

### 3. Add Validation to User Input

#### Before
```typescript
const handleSubmit = (formData: any) => {
  if (!formData.email || !formData.email.includes('@')) {
    alert('Invalid email');
    return;
  }
  // Process...
};
```

#### After
```typescript
import { validators } from '@/lib/validation/validator';

const emailValidator = validators.string()
  .email()
  .min(5)
  .max(255);

const handleSubmit = (formData: Record<string, unknown>) => {
  const result = emailValidator.validate(formData.email);

  if (!result.success) {
    logger.warn('Validation failed', { errors: result.errors });
    setErrors(result.errors);
    return;
  }

  // Process...
};
```

### 4. Handle Async Operations

#### Before
```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState<Data | null>(null);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  setLoading(true);
  fetchData()
    .then(data => {
      setData(data);
      setError(null);
    })
    .catch(err => {
      setError(err.message);
      setData(null);
    })
    .finally(() => setLoading(false));
}, []);
```

#### After
```typescript
import { useAsync } from '@/lib/react/useAsync';

const { data, error, isLoading } = useAsync(
  async () => fetchData(),
  { immediate: true }
);
```

### 5. Wrap Component with Error Boundary

#### Before
```typescript
export default function Page() {
  return <Component />;
}
```

#### After
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Page() {
  return (
    <ErrorBoundary
      onError={(error) => logger.error('Component error', error)}
    >
      <Component />
    </ErrorBoundary>
  );
}
```

### 6. Type-Safe Object Manipulation

#### Before
```typescript
const result: any = obj;
const filtered = {
  id: result.id,
  name: result.name,
  email: result.email,
};
```

#### After
```typescript
import { pick, formatCurrency, deepClone } from '@/lib/transforms/dataTransform';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

const filtered = pick<User, 'id' | 'name' | 'email'>(
  user,
  'id',
  'name',
  'email'
);

// Also available:
const clone = deepClone(user);
const grouped = groupBy(users, u => u.department);
const page = paginate(users, 1, 10);
```

### 7. Format Data for Display

#### Before
```typescript
<div>${value.toLocaleString()}</div>
<div>{new Date(date).toLocaleDateString()}</div>
<div>{(percentage * 100).toFixed(2)}%</div>
```

#### After
```typescript
import { formatCurrency, formatDate, formatPercentage } from '@/lib/transforms/dataTransform';

<div>{formatCurrency(value, 'USD')}</div>
<div>{formatDate(date)}</div>
<div>{formatPercentage(percentage, 2)}</div>
```

## Migration Priorities

### Priority 1: High Impact (Start Here)
These changes have the most impact on code quality and user experience:

1. **Replace fetch calls in pages** (1-2 days)
   - `src/app/final-distribution/page.tsx`
   - `src/app/rfo-comparison/page.tsx`
   - `src/app/analytics/continuances/page.tsx`

2. **Replace console.log with logger** (0.5 days)
   - Global search and replace
   - 40 instances across codebase

3. **Wrap large components in ErrorBoundary** (1 day)
   - `src/components/HousingCostCalculator.tsx`
   - `src/app/final-distribution/page.tsx`

### Priority 2: Medium Impact (Next)
1. Add validation to API endpoints
2. Replace async/await patterns with useAsync
3. Update API error handling

### Priority 3: Lower Impact (Polish)
1. Add JSDoc comments
2. Replace `any` types
3. Optimize data transformations

## Testing Your Migrations

### 1. Test Fetch Calls
```typescript
// Test successful request
const { data, error } = await safeFetch('/api/data');
expect(data).toBeDefined();
expect(error).toBeNull();

// Test error handling
const { data, error } = await safeFetch('/api/invalid');
expect(data).toBeNull();
expect(error).toBeDefined();
```

### 2. Test Validation
```typescript
const validator = validators.string().email();
const result = validator.validate('test@example.com');
expect(result.success).toBe(true);

const result2 = validator.validate('invalid');
expect(result2.success).toBe(false);
```

### 3. Test Error Boundaries
```typescript
// Wrap test in error boundary
render(
  <ErrorBoundary>
    <ComponentThatThrows />
  </ErrorBoundary>
);

// Verify error UI renders
expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
```

## Common Patterns

### Pattern 1: Loading & Error States
```typescript
const { data, error, isLoading, execute } = useAsync(
  async () => API.fetchData(),
  { immediate: true }
);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

### Pattern 2: Form Submission with Validation
```typescript
const formValidator = validators.object<FormData>()
  .field('email', validators.string().email())
  .field('name', validators.string().min(2).max(100))
  .field('age', validators.number().minimum(18).maximum(120));

const handleSubmit = async (formData: unknown) => {
  const result = formValidator.validate(formData);

  if (!result.success) {
    setErrors(result.errors);
    return;
  }

  const { data, error } = await safeFetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(result.data),
  });

  if (error) {
    logger.error('Submission failed', error);
    return;
  }

  logger.info('Submission successful');
};
```

### Pattern 3: Data Transformation Pipeline
```typescript
import { mapObjects, pick, formatCurrency } from '@/lib/transforms/dataTransform';

// Transform API response
const processedData = mapObjects(apiResponse.items, item => ({
  ...pick(item, 'id', 'name', 'amount'),
  formattedAmount: formatCurrency(item.amount),
}));

// Paginate results
const { items, page, totalPages } = paginate(processedData, 1, 10);
```

## Checklist for Each File

When migrating a file, use this checklist:

- [ ] Replace all `fetch()` with `safeFetch()`
- [ ] Replace all `console.log()` with `logger.info()`
- [ ] Replace all `console.error()` with `logger.error()`
- [ ] Update error handling to use `AppError`
- [ ] Add type-safe validation for inputs
- [ ] Wrap components in `ErrorBoundary` if needed
- [ ] Update async patterns to use `useAsync` hooks
- [ ] Replace `any` types with proper types
- [ ] Add JSDoc comments to functions
- [ ] Run TypeScript check: `npm run typecheck`
- [ ] Run tests: `npm test`

## Frequently Asked Questions

### Q: Should I migrate everything at once?
**A:** No. Follow the priority order. Start with high-impact changes like fetch and logging.

### Q: Can I mix old and new patterns?
**A:** Yes, for backward compatibility. But migrate incrementally to new patterns.

### Q: What if I need to support older code?
**A:** Both patterns can coexist. Migrate as you refactor each component.

### Q: How do I test migration?
**A:** Test each component with Playwright E2E tests to ensure functionality is preserved.

### Q: What about performance impact?
**A:** New utilities are optimized and should be faster than old patterns.

## Getting Help

If you encounter issues during migration:

1. Check `ENHANCEMENT_ROADMAP.md` for context
2. Review example patterns in this guide
3. Look at implemented infrastructure in `src/lib/`
4. Review logs with `logger` for debugging

---

**Generated:** 2025-10-17
**Framework:** JusticeOS™
**Status:** Phase 1 Complete
