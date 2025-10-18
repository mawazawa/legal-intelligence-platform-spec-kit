# FL-320 Evidence Integration Guide

## Overview

This guide shows how to integrate the evidence management system with the FL-320 Responsive Declaration, linking specific evidence files to declaration paragraphs.

## Quick Start

### 1. View Evidence Linked to FL-320

Navigate to `/evidence` and select the "By Paragraph" tab to see all evidence organized by FL-320 paragraph number.

### 2. Add Evidence Links to Declaration Component

```typescript
'use client';

import { FL320EvidenceLinks } from '@/components/evidence/FL320EvidenceLinks';
import { EvidenceViewer } from '@/components/evidence/EvidenceViewer';
import { useState } from 'react';
import type { EvidenceFile } from '@/lib/types/evidence';

export function FL320Declaration() {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceFile | null>(null);

  return (
    <div>
      {/* Paragraph 61 - Furniture Misrepresentation */}
      <div className="mb-6">
        <h3 className="font-semibold">Paragraph 61: Furniture Issue</h3>
        <p>
          The furniture and furnishings remaining in the Property in May 2025 were items
          that Petitioner had explicitly told my wife, Piya Wauters, should remain in the
          Property and would not need to be removed.
        </p>

        {/* Linked Evidence */}
        <FL320EvidenceLinks
          paragraphNumber={61}
          paragraphTitle="Furniture Misrepresentation"
          onViewEvidence={(evidence) => setSelectedEvidence(evidence)}
        />
      </div>

      {/* Evidence Viewer Modal */}
      {selectedEvidence && (
        <EvidenceViewer
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      )}
    </div>
  );
}
```

## Evidence Mapping to FL-320 Paragraphs

### Current Evidence Links

| Paragraph | Topic | Evidence | Exhibit |
|-----------|-------|----------|---------|
| **¶8-22** | Foreclosure Timeline | Flagstar transcripts (Exhibits 1-3) | A, B, C |
| **¶34** | Property Access/Video | November 2, 2024 video | E |
| **¶40** | Property Retrieval | Email communications | C |
| **¶61-65** | Furniture Misrepresentation | Text message to Piya | B |
| **¶68** | Final Closing Statement | Mortgage final statement | D |

### Adding New Evidence Links

**Step 1: Update Database**

```sql
-- Link evidence to paragraph
UPDATE evidence_files
SET declaration_paragraph = 61
WHERE exhibit_letter = 'B';

-- Or insert new evidence
INSERT INTO evidence_files (
  file_name,
  file_path,
  file_type,
  mime_type,
  file_size,
  exhibit_letter,
  title,
  description,
  filing_type,
  declaration_paragraph,
  evidence_category,
  authenticated
) VALUES (
  'new_evidence.pdf',
  'path/to/file.pdf',
  'pdf',
  'application/pdf',
  123456,
  'G',
  'Evidence Title',
  'True and correct copy of...',
  'fl-320',
  72,  -- Paragraph number
  'communication',
  true
);
```

**Step 2: Add Citation Record**

```sql
INSERT INTO evidence_citations (
  evidence_file_id,
  document_type,
  paragraph_number,
  citation_text,
  context
) VALUES (
  'evidence-uuid-here',
  'fl-320',
  72,
  'Attached as Exhibit G is a true and correct copy of...',
  'This evidence demonstrates that...'
);
```

## Display Patterns

### Pattern 1: Inline Evidence Cards

Shows full evidence cards inline with paragraph text:

```typescript
<div className="space-y-6">
  <p className="paragraph-text">Paragraph content...</p>

  <FL320EvidenceLinks
    paragraphNumber={61}
    paragraphTitle="Furniture Misrepresentation"
    onViewEvidence={(evidence) => console.log('View:', evidence)}
  />
</div>
```

**Result:**
```
┌──────────────────────────────────────────────────────────┐
│ Evidence for Paragraph 61 - Furniture Misrepresentation │
├──────────────────────────────────────────────────────────┤
│ 📄 Text Message: Leave Furniture            [Ex. B]     │
│    True and correct copy of text message...             │
│    pdf | Authenticated                                   │
│    → View Evidence                                       │
└──────────────────────────────────────────────────────────┘
```

### Pattern 2: Compact Evidence Badges

Shows just exhibit letters as clickable badges:

```typescript
<p className="paragraph-text">
  Paragraph content...
  <EvidenceBadge
    paragraphNumber={61}
    onClick={() => setShowEvidence(true)}
  />
</p>
```

**Result:**
```
Paragraph content... [📎 Ex. B]
```

### Pattern 3: Sidebar Evidence List

Shows evidence in a sidebar alongside the declaration:

```typescript
<div className="grid grid-cols-3 gap-6">
  {/* Declaration */}
  <div className="col-span-2">
    <FL320Declaration />
  </div>

  {/* Evidence Sidebar */}
  <div className="col-span-1">
    <h3>Linked Evidence</h3>
    {paragraphs.map(para => (
      <FL320EvidenceLinks key={para} paragraphNumber={para} />
    ))}
  </div>
</div>
```

## Citation Language Templates

### Standard Citation Format

```typescript
const citationTemplates = {
  pdf: (exhibit: string) =>
    `Attached as Exhibit ${exhibit} is a true and correct copy of [document description].`,

  image: (exhibit: string) =>
    `Attached as Exhibit ${exhibit} is a true and correct copy of [image description].`,

  video: (exhibit: string) =>
    `Attached as Exhibit ${exhibit} is a true and correct copy of video recording from [date/event].`,

  email: (exhibit: string) =>
    `Attached as Exhibit ${exhibit} is a true and correct copy of email correspondence dated [date].`,
};
```

### Usage in Declaration

```typescript
<p>
  {citationTemplates.pdf('B')}
</p>
// "Attached as Exhibit B is a true and correct copy of [document description]."
```

## Exhibit Index Integration

### Generate Exhibit Index for FL-320

```typescript
import { ExhibitIndexDocument } from '@/components/evidence/ExhibitIndexDocument';

function FL320ExhibitIndex() {
  return (
    <ExhibitIndexDocument
      filingType="fl-320"
      caseNumber="FDI-21-794666"
      title="Responsive Declaration to Request for Order (FL-320)"
    />
  );
}
```

### Embed Simple Index in Declaration

```typescript
import { SimpleExhibitIndex } from '@/components/evidence/ExhibitIndexDocument';

function FL320WithIndex() {
  return (
    <div>
      <h1>RESPONSIVE DECLARATION</h1>

      {/* Declaration content */}
      <div className="declaration-body">...</div>

      {/* Exhibit Index */}
      <div className="mt-12">
        <SimpleExhibitIndex filingType="fl-320" />
      </div>
    </div>
  );
}
```

## Evidence Viewer Integration

### Full-Screen Evidence Modal

```typescript
'use client';

import { useState } from 'react';
import { EvidenceViewer } from '@/components/evidence/EvidenceViewer';
import { getEvidenceFileById } from '@/lib/services/evidenceService';
import type { EvidenceFile } from '@/lib/types/evidence';

export function DeclarationWithViewer() {
  const [viewingEvidence, setViewingEvidence] = useState<EvidenceFile | null>(null);

  const handleViewEvidence = async (evidenceId: string) => {
    const evidence = await getEvidenceFileById(evidenceId);
    if (evidence) {
      setViewingEvidence(evidence);
    }
  };

  return (
    <>
      {/* Declaration with clickable evidence references */}
      <div>
        <button onClick={() => handleViewEvidence('evidence-id')}>
          View Exhibit B
        </button>
      </div>

      {/* Evidence Viewer Modal */}
      {viewingEvidence && (
        <EvidenceViewer
          evidence={viewingEvidence}
          onClose={() => setViewingEvidence(null)}
          showMetadata={true}
        />
      )}
    </>
  );
}
```

## Automated Evidence Suggestions

### Suggest Missing Evidence

```typescript
import { getEvidenceForParagraph } from '@/lib/services/evidenceService';

async function checkParagraphEvidence(paragraphNumber: number) {
  const evidence = await getEvidenceForParagraph(paragraphNumber);

  if (evidence.length === 0) {
    return {
      status: 'missing',
      message: `No evidence linked to paragraph ${paragraphNumber}`,
      suggestion: 'Consider adding supporting evidence to strengthen this claim.',
    };
  }

  const authenticated = evidence.filter(e => e.authenticated).length;
  if (authenticated < evidence.length) {
    return {
      status: 'incomplete',
      message: `${evidence.length - authenticated} evidence file(s) not authenticated`,
      suggestion: 'Authenticate all evidence before filing.',
    };
  }

  return {
    status: 'complete',
    message: `${evidence.length} evidence file(s) properly linked and authenticated`,
  };
}
```

### Evidence Completeness Report

```typescript
async function generateEvidenceReport(paragraphNumbers: number[]) {
  const report = await Promise.all(
    paragraphNumbers.map(async (para) => {
      const check = await checkParagraphEvidence(para);
      return {
        paragraph: para,
        ...check,
      };
    })
  );

  return {
    total: report.length,
    complete: report.filter(r => r.status === 'complete').length,
    missing: report.filter(r => r.status === 'missing').length,
    incomplete: report.filter(r => r.status === 'incomplete').length,
    details: report,
  };
}

// Usage
const report = await generateEvidenceReport([8, 22, 34, 40, 61, 65, 68]);
console.log(`Evidence completeness: ${report.complete}/${report.total} paragraphs`);
```

## Print/Export Integration

### Include Evidence References in PDF

```typescript
import { getExhibitIndex } from '@/lib/services/evidenceService';

async function generateFL320PDF() {
  const exhibitIndex = await getExhibitIndex('fl-320');

  return {
    declaration: FL320Content,
    exhibits: exhibitIndex,
    format: 'pdf',
    includeThumbnails: true,
  };
}
```

## Best Practices

### 1. Always Link Evidence to Paragraphs

```typescript
// ✅ GOOD: Evidence linked to specific paragraph
{
  declaration_paragraph: 61,
  claim_key: 'furniture_misrepresentation',
}

// ❌ BAD: No paragraph link
{
  declaration_paragraph: null,
  claim_key: 'furniture_misrepresentation',
}
```

### 2. Use Proper Citation Language

```typescript
// ✅ GOOD: Legal citation format
"Attached as Exhibit B is a true and correct copy of text message exchange..."

// ❌ BAD: Informal reference
"See text message in Exhibit B"
```

### 3. Authenticate All Evidence

```typescript
// ✅ GOOD: Properly authenticated
{
  authenticated: true,
  authentication_method: 'penalty_of_perjury',
}

// ❌ BAD: Not authenticated
{
  authenticated: false,
  authentication_method: null,
}
```

### 4. Provide Descriptive Titles

```typescript
// ✅ GOOD: Clear, specific title
"Text Message: Leave Furniture (November 8, 2024)"

// ❌ BAD: Vague title
"Text Message"
```

## Troubleshooting

### Evidence Not Showing for Paragraph

**Check:**
1. Is `declaration_paragraph` set correctly?
2. Is `filing_type` set to 'fl-320'?
3. Is `deleted_at` NULL?

```sql
SELECT id, title, declaration_paragraph, filing_type, deleted_at
FROM evidence_files
WHERE declaration_paragraph = 61;
```

### Wrong Exhibit Order

**Fix:**
Update `sort_order` in exhibit_index:

```sql
UPDATE exhibit_index
SET sort_order = 1
WHERE exhibit_letter = 'A' AND filing_type = 'fl-320';
```

### Evidence Viewer Not Opening

**Check:**
1. Is `storage_url` or `file_path` valid?
2. Is evidence viewer component imported?
3. Are file permissions correct?

## Next Steps

1. **Add Remaining Flagstar Transcripts** (Exhibits 1-3) to database
2. **Link Evidence to All FL-320 Paragraphs** (8-22, 34, 40, 61-65, 68)
3. **Generate Complete Exhibit Index** for filing
4. **Authenticate All Evidence** before court filing
5. **Test Print/Export** functionality

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
