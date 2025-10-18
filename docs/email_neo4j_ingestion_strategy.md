# Email Knowledge Graph Ingestion Strategy (October 2025)

_Last updated: 18 October 2025 (US/Pacific)._

## Objectives

1. **Maximize structured signal** from the historical email corpus (mbox files) by extracting entities, events, and relationships aligned with our litigation domain.
2. **Adhere to modern Neo4j guidance (2024–2025)** on schema-first knowledge-graph construction, vector-linked lexical graphs, and LLM/heuristic hybrid extraction.citeturn0search0turn0search1turn0search2turn0search3turn0search6
3. **Ensure replayable, lossless ingestion** so every graph element preserves provenance back to the original email message.

## Target Graph Schema

### Core Labels

| Label | Purpose | Key Properties |
|-------|---------|----------------|
| `EmailMessage` | Canonical node per ingested email | `messageId`, `date`, `subject`, `snippet`, `sourcePath`, `ingestedAt` |
| `Person` | Distinct people mentioned or acting in the corpus | `name`, `primaryEmail`, `role`, `confidence` |
| `Organization` | Companies, law firms, agencies (e.g., FTB, Chartwell Escrow) | `name`, `domain`, `kind`, `confidence` |
| `DocumentArtifact` | Referenced documents (Form 593, FLARPL release, etc.) | `title`, `docType`, `effectiveDate`, `uri` |
| `FinancialTransaction` | Monetary obligations/events (withholding, lien releases) | `amount`, `currency`, `transactionType`, `confidence` |
| `LegalAction` | Motions, liens, subpoenas, TROs | `actionType`, `status`, `filedDate`, `confidence` |
| `TaxWithholding` (sub-type of `FinancialTransaction`) | Explicit FTB tax events | `percentage`, `statute`, `dueDate` |

### Relationship Types

| Relationship | Start → End | Notes |
|--------------|-------------|-------|
| `SENT` | `Person` → `EmailMessage` | From parsed headers |
| `RECEIVED` | `EmailMessage` → `Person` | To/CC recipients |
| `MENTIONS` | `EmailMessage` → (`Person` \| `Organization` \| `DocumentArtifact`) | Captures mentions with `confidence`, `extractedText` |
| `AUTHORED` | `Person` → `DocumentArtifact` | When a person is author/signatory |
| `RELATES_TO` | `EmailMessage` → (`FinancialTransaction` \| `LegalAction`) | Derived from entity extraction |
| `INVOLVES` | (`FinancialTransaction` \| `LegalAction`) → (`Person` \| `Organization`) | Participants with roles (`role` property) |
| `DERIVES_FROM` | `FinancialTransaction` → `DocumentArtifact` | e.g., “Tax withholding per Form 593” |
| `HAS_COUNTERPARTY` | `FinancialTransaction` → `Organization` | E.g., Franchise Tax Board |

### Taxonomy & Ontology

We adopt a **hybrid schema-first approach** (Neo4j GraphRAG 2025 guidance) where entity classes and relationship types are declared in code and stored as JSON schema to keep ingestion deterministic. This enables consistent prompts when we later incorporate LLM extraction.citeturn0search1turn0search2

## Extraction Pipeline

1. **Header Normalization**
   - Parse `From`, `To`, `Cc`, `Bcc`, produce normalized `Person` nodes.
   - Derive `Organization` from email domains (e.g., `@chartwellescrow.com` → Chartwell Escrow).

2. **Body Segmentation**
   - Strip quoted blocks, signatures, embedded tracking footers.
   - Chunk into paragraphs (≤ 750 chars) to feed heuristic + optional LLM extractor.

3. **Entity & Event Extraction**
   - **Rule-based heuristics (Phase 1)**:
     - Monetary regex (`$13,694.62`, `USD`, `%`).
     - Legal artifact keywords (`Form 593`, `FLARPL`, `substitution of attorney`, `Request for Order`).
     - Temporal cues (`May 16, 2025`, `close of escrow`, `deadline`).
   - **LLM-backed augmentation (Phase 2, optional)** using structured Pydantic schemas reinforced by recent Neo4j KG builder prompts.citeturn0search1turn0search2turn0search3

4. **Confidence Scoring & Deduplication**
   - Assign heuristic confidence (0–1). Merge duplicates via canonical keys (lowercase email, normalized organization name).
   - Maintain `:Alias` nodes if alternative spellings encountered.

5. **Graph Upserts**
   - Use transactional Cypher with MERGE patterns matching the above schema.
   - Store provenance (`sourceMessageId`, `extractedSpanStart`, `extractedSpanEnd`) on relationships.

6. **Vector Linking (Phase 2)**
   - Index email paragraph embeddings and link with `HAS_CHUNK` to enable lexical + domain retrieval (per Neo4j blog guidance).citeturn0search1turn0search6

## Implementation Plan

1. **Update Parser Interfaces**
   - Extend `EmailEvent` to include `entities`, `relationships`, `tags`.
   - Add TypeScript definitions for taxonomy.

2. **Entity Extraction Module**
   - New `email-entity-extractor.ts` providing deterministic heuristics plus pluggable LLM hook.
   - Unit tests covering monetary & legal artifact extraction.

3. **Ingestion Workflow**
   - Modify `ingest-data.js` to call extractor, persist structured nodes/relationships.
   - Batch writes per message to reduce round-trips; use `UNWIND` for upserts.

4. **Documentation & Strategy Tracking**
   - Maintain this document, record progress, update with future enhancements (Phase 2 LLM integration, vector graph alignment).

5. **Monitoring**
   - Log ingestion metrics (`emailsProcessed`, `entitiesCreated`, `relationshipsCreated`, error counts) and export to CSV for auditing.

## Verification & References

Key external references (queried 18 Oct 2025 via open web search):

- Neo4j APOC NLP & Ontologies tutorial.citeturn0search0
- Neo4j developer blogs on knowledge graph generation and extraction challenges (2025).citeturn0search1turn0search2turn0search3turn0search6
- APOC NLP entity extraction documentation (2025).citeturn0search4

These sources collectively emphasize schema-first pipelines, hybrid LLM/heuristic extraction, and linking lexical + domain subgraphs—principles applied above.
