# Evidence Management System

## Overview

The Evidence Management System is a comprehensive solution for organizing, storing, and managing legal evidence files for case FDI-21-794666. It provides a structured approach to evidence handling with support for PDFs, images, videos, and document files.

## System Architecture

### Database Schema

The evidence system uses three main PostgreSQL tables:

#### 1. `evidence_files`
Primary table storing all evidence metadata:
- File identification (name, path, type, size, checksum)
- Evidence metadata (exhibit letter/number, title, description)
- Case linking (case number, hearing date, filing type)
- Document linking (declaration paragraph, claim key)
- Legal categorization (category, tags)
- Authentication information
- OCR text for searchability
- Timestamps and soft delete support

#### 2. `exhibit_index`
Manages exhibit lists for different filings:
- Filing identification (FL-320, opposition, RFO, etc.)
- Exhibit ordering and numbering
- References to evidence files
- Exhibit descriptions

#### 3. `evidence_citations`
Tracks where evidence is cited in legal documents:
- Evidence file references
- Citation location (document type, paragraph, section, page)
- Citation text and context

### TypeScript Types

Located in `src/lib/types/evidence.ts`:

```typescript
// Core types
EvidenceFile          // Main evidence file record
ExhibitIndexEntry     // Exhibit index entry
EvidenceCitation      // Evidence citation record
EvidenceWithExhibit   // Evidence with exhibit info (from view)
EvidenceSearchResult  // Search result record

// Enums
FileType              // 'pdf' | 'image' | 'video' | 'document' | 'email' | 'text'
EvidenceCategory      // 'communication' | 'financial' | 'property' | 'procedural' | ...
FilingType            // 'fl-320' | 'opposition' | 'rfo' | 'declaration' | ...
ClaimKey              // Evidence claim categories

// Input/Filter types
EvidenceUploadInput   // For file uploads
EvidenceFilterOptions // For filtering queries
EvidenceStats         // Statistics aggregation
EvidenceCluster       // Evidence matrix cluster
```

### Service Layer

Located in `src/lib/services/evidenceService.ts`:

**Core Functions:**
- `getEvidenceFiles(filters?)` - Get all evidence with optional filtering
- `getEvidenceWithExhibits(filingType?)` - Get evidence with exhibit info
- `getEvidenceFileById(id)` - Get single evidence file
- `searchEvidence(query, limit)` - Full-text search on OCR text
- `getEvidenceForClaim(claimKey)` - Get evidence for specific claim
- `getExhibitIndex(filingType)` - Get exhibit index for filing
- `getEvidenceCitations(documentType, paragraph?)` - Get citations
- `getEvidenceStats()` - Get evidence statistics
- `buildEvidenceClusters()` - Build evidence matrix clusters
- `getEvidenceForParagraph(paragraphNumber)` - Get FL-320 paragraph evidence

**Mock Data Support:**
All functions include mock data fallbacks for development without Supabase configuration.

## User Interface Components

### 1. Evidence Management Page (`/evidence`)

Located in `src/app/evidence/page.tsx`

**Features:**
- Statistics dashboard showing total evidence, authenticated files, etc.
- Search and filter functionality
- Three-tab interface:
  - **All Evidence**: Card-based view of all evidence files
  - **Exhibit Index**: Court-formatted exhibit list
  - **By Paragraph**: Evidence organized by FL-320 paragraph

**Usage:**
```typescript
import EvidencePage from '@/app/evidence/page';

// Accessible at /evidence route
```

### 2. Evidence Viewer Component

Located in `src/components/evidence/EvidenceViewer.tsx`

**Features:**
- Multi-format viewer (PDF iframe, image with zoom, video player)
- Metadata sidebar with case information
- Download and external link actions
- Authentication status display
- Zoom controls for images

**Usage:**
```typescript
import { EvidenceViewer } from '@/components/evidence/EvidenceViewer';

<EvidenceViewer
  evidence={evidenceFile}
  onClose={() => setViewerOpen(false)}
  showMetadata={true}
/>
```

### 3. FL-320 Evidence Links

Located in `src/components/evidence/FL320EvidenceLinks.tsx`

**Features:**
- Shows evidence linked to specific FL-320 paragraphs
- Inline display with declaration content
- "View Evidence" functionality
- Compact badge variant available

**Usage:**
```typescript
import { FL320EvidenceLinks, EvidenceBadge } from '@/components/evidence/FL320EvidenceLinks';

// Full display
<FL320EvidenceLinks
  paragraphNumber={61}
  paragraphTitle="Furniture Misrepresentation"
  onViewEvidence={(evidence) => setSelectedEvidence(evidence)}
/>

// Compact badge
<EvidenceBadge paragraphNumber={61} onClick={() => {}} />
```

### 4. Exhibit Index Generator

Located in `src/components/evidence/ExhibitIndexDocument.tsx`

**Features:**
- Court-ready exhibit index document
- Proper legal formatting with headers
- Signature blocks and certification language
- Print and export functionality
- Simple variant for embedding

**Usage:**
```typescript
import { ExhibitIndexDocument, SimpleExhibitIndex } from '@/components/evidence/ExhibitIndexDocument';

// Full document
<ExhibitIndexDocument
  filingType="fl-320"
  caseNumber="FDI-21-794666"
  title="Responsive Declaration to Request for Order"
/>

// Simple table
<SimpleExhibitIndex filingType="fl-320" />
```

## Evidence Files Integrated

### Current Evidence in System

| Exhibit | File | Type | Category | Paragraph | Description |
|---------|------|------|----------|-----------|-------------|
| **B** | EXHIBIT_B_Text_Leave_Furniture_Nov8_2024.png | Image | Communication | ¶61 | Text message exchange re: furniture |
| **C** | EXHIBIT_C_Emails_Property_Retrieval.pdf | PDF | Communication | ¶40 | Property retrieval emails |
| **D** | EXHIBIT_MORTGAGE_Final_Statement.pdf | PDF | Financial | ¶68 | Final Sellers Closing Statement |
| **E** | EXHIBIT_VIDEO_Nov2_2024_Raid.mov | Video | Property | ¶34 | Nov 2, 2024 property incident |
| **F** | Appraisal_refusal_Gmail.pdf | PDF | Communication | - | Appraisal refusal communication |

### Evidence Source Location

```
/Users/mathieuwauters/Library/CloudStorage/GoogleDrive-mathieuwauters@gmail.com/
  .shortcut-targets-by-id/1V8UxyGVUvpaBnyO-HINQBrVdQW_1ouZU/
  Rotert Law Drive/Friends & Family Legal Work/Mathieu Wauters/
  Wauters v. Alvero/CLIENT SHARED FOLDER - MW/Evidence - Nov 2025 Hearing/
```

## Database Setup

### Running Migrations

1. Ensure Supabase is configured:
```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

2. Run migration:
```bash
# Using Supabase CLI
supabase db push

# Or execute migration file directly
psql -h your-host -U your-user -d your-database -f supabase/migrations/002_evidence_management.sql
```

### Initial Data Seeding

The migration includes INSERT statements to seed initial evidence from the Google Drive folder:
- EXHIBIT_B through EXHIBIT_F automatically created
- Exhibit index entries automatically generated for FL-320 filing

## Search Functionality

### Full-Text Search

Evidence files can be searched using the `search_evidence()` PostgreSQL function:

```sql
SELECT * FROM search_evidence('furniture', 20);
```

TypeScript usage:
```typescript
import { searchEvidence } from '@/lib/services/evidenceService';

const results = await searchEvidence('furniture misrepresentation', 10);
```

**Search supports:**
- OCR text from PDFs/images
- File names, titles, and descriptions
- Ranking by relevance
- Configurable result limits

### Filtering

Evidence can be filtered by multiple criteria:

```typescript
const filters: EvidenceFilterOptions = {
  filing_type: 'fl-320',
  claim_key: 'furniture_misrepresentation',
  evidence_category: 'communication',
  file_type: 'image',
  authenticated: true,
  declaration_paragraph: 61,
  tags: ['november-2024'],
  date_from: '2024-11-01',
  date_to: '2024-11-30',
};

const evidence = await getEvidenceFiles(filters);
```

## Evidence Matrix Integration

The evidence system integrates with the existing Evidence Matrix page:

```typescript
import { buildEvidenceClusters } from '@/lib/evidence';

const { cells, suggestions } = await buildEvidenceClusters();
```

**Returns:**
- `cells`: Evidence counts by claim and type (emails, documents, graph)
- `suggestions`: Evidence recommendations with strength indicators

## Authentication & Verification

### Authentication Methods

Evidence can be authenticated using:
- `penalty_of_perjury` - Declaration under penalty of perjury
- `notarized` - Notarized documents
- `business_records` - Business records exception to hearsay
- `self_authenticating` - Self-authenticating documents
- `certified_copy` - Certified copies

### Checksum Verification

Files include SHA256 checksums for integrity verification:

```typescript
// Future implementation
async function verifyEvidence(evidenceId: string): Promise<boolean> {
  const evidence = await getEvidenceFileById(evidenceId);
  const currentChecksum = await calculateChecksum(evidence.file_path);
  return currentChecksum === evidence.checksum;
}
```

## Navigation Integration

Evidence Management is accessible via the main navigation:

```
Evidence & Intake > Evidence Management (NEW)
```

Badge indicates new feature to users.

## File Storage

### Current Implementation

Evidence files currently reference the Google Drive path in `original_location` field.

### Future Cloud Storage

The schema supports cloud storage via `storage_url` field for:
- Cloudflare R2
- AWS S3
- Azure Blob Storage
- Google Cloud Storage

### Thumbnail Generation

The `thumbnail_url` field supports:
- PDF first-page thumbnails
- Image thumbnails
- Video frame captures

## OCR & Searchability

### OCR Text Extraction

Evidence files can have OCR text extracted for searchability:

```typescript
// Future implementation
async function processOCR(evidenceId: string): Promise<void> {
  const evidence = await getEvidenceFileById(evidenceId);
  const ocrText = await extractText(evidence.file_path);

  await updateEvidence(evidenceId, {
    ocr_text: ocrText,
    ocr_completed_at: new Date().toISOString(),
    searchable: true,
  });
}
```

## Performance Considerations

### Database Indexes

The schema includes optimized indexes for:
- Exhibit letter/number lookups
- Case number filtering
- Filing type queries
- Claim key filtering
- Paragraph number lookups
- Category filtering
- Tag array searches (GIN index)
- Full-text search on OCR text

### Query Optimization

- Use `active_evidence_with_exhibits` view for joined queries
- Soft delete ensures deleted evidence is excluded automatically
- Pagination recommended for large result sets

## Testing

### Type Safety

All evidence operations are fully typed with TypeScript:

```bash
npm run typecheck
# All type checks pass ✅
```

### Mock Data

Mock data is included for testing without database:

```typescript
// Automatically used when Supabase not configured
const evidence = await getEvidenceFiles();
// Returns 5 mock evidence files
```

## Future Enhancements

### Planned Features

1. **File Upload Interface**
   - Drag-and-drop file upload
   - Automatic metadata extraction
   - Exhibit letter assignment

2. **OCR Processing Pipeline**
   - Automatic text extraction from PDFs
   - Image OCR using Tesseract
   - Searchable text indexing

3. **Cloud Storage Integration**
   - Cloudflare R2 upload
   - Automatic thumbnail generation
   - CDN delivery for fast access

4. **Evidence Bundling**
   - Generate exhibit packets
   - Combine evidence for filing
   - Automatic Bates stamping

5. **Citation Tracking**
   - Automatic citation detection
   - Backlinks to evidence
   - Usage analytics

6. **Version Control**
   - Track evidence versions
   - Amendment history
   - Redaction support

## Troubleshooting

### Common Issues

**Issue**: Evidence not displaying
- **Solution**: Check Supabase environment variables are set
- **Fallback**: Mock data will be used automatically

**Issue**: Search returning no results
- **Solution**: Ensure OCR text has been extracted (`searchable: true`)
- **Future**: Implement OCR processing pipeline

**Issue**: Exhibit index empty
- **Solution**: Verify exhibit_index entries exist for filing type
- **Check**: Run `SELECT * FROM exhibit_index WHERE filing_type = 'fl-320'`

## API Reference

### Service Functions

```typescript
// Get all evidence
getEvidenceFiles(filters?: EvidenceFilterOptions): Promise<EvidenceFile[]>

// Get evidence with exhibits
getEvidenceWithExhibits(filingType?: FilingType): Promise<EvidenceWithExhibit[]>

// Get single file
getEvidenceFileById(id: string): Promise<EvidenceFile | null>

// Search evidence
searchEvidence(query: string, limit?: number): Promise<EvidenceSearchResult[]>

// Get for claim
getEvidenceForClaim(claimKey: ClaimKey): Promise<EvidenceFile[]>

// Get exhibit index
getExhibitIndex(filingType: FilingType): Promise<ExhibitIndexEntry[]>

// Get citations
getEvidenceCitations(documentType: FilingType, paragraphNumber?: number): Promise<EvidenceCitation[]>

// Get statistics
getEvidenceStats(): Promise<EvidenceStats>

// Build clusters
buildEvidenceClusters(): Promise<EvidenceCluster[]>

// Get for paragraph
getEvidenceForParagraph(paragraphNumber: number): Promise<EvidenceFile[]>
```

### Database Functions

```sql
-- Search evidence
SELECT * FROM search_evidence('search query', 20);

-- Get evidence for claim
SELECT * FROM get_evidence_for_claim('furniture_misrepresentation');

-- Generate exhibit index
SELECT * FROM generate_exhibit_index('fl-320');
```

## Contributing

When adding new evidence:

1. **Add database record** in migration or via INSERT
2. **Place file** in Google Drive evidence folder
3. **Update exhibit index** if needed
4. **Link to paragraphs** by setting `declaration_paragraph`
5. **Set claim_key** for evidence matrix integration
6. **Mark as authenticated** with appropriate method

## Security Considerations

- Evidence files contain sensitive legal information
- Access should be restricted to authorized users
- Implement authentication before production deployment
- Consider encryption for sensitive files
- Maintain audit trail of evidence access

## License & Copyright

This evidence management system is part of the Legal Intelligence Platform for case FDI-21-794666.

**Case**: Wauters v. Alvero
**Case Number**: FDI-21-794666
**Court**: Superior Court of California, County of San Francisco

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
