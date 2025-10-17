# Graph RAG + Visual Evidence System

A comprehensive legal intelligence platform that transforms opposing party claims into visual evidence using Neo4j graph databases, Voyage 3 Large embeddings, and Supabase vectors.

## 🎯 Legal Jiu-Jitsu Capabilities

This system enables **legal jiu-jitsu** - turning opposing party claims against them through:

- **Visual Attribution**: Color-coded continuances by actor (red=petitioner, blue=court, purple=respondent)
- **Data Storytelling**: Charts that replace lengthy text arguments with compelling visual evidence
- **Traceable Sources**: Every chart element links back to source documents with citations
- **Claims vs Reality**: Automated comparison panels that expose discrepancies
- **Print-Ready**: Court-ready formatting with sophisticated edge shading

## 🏗️ Architecture

### Core Components

1. **Neo4j Graph Database**: Stores events, continuances, people, and documents with relationships
2. **Voyage 3 Large Embeddings**: Generates 1024-dimensional vectors for semantic search
3. **Supabase Vector Store**: PostgreSQL with pgvector extension for hybrid search
4. **Visual Analytics**: Interactive charts and timelines for evidence presentation
5. **Graph RAG Pipeline**: Combines vector search with graph context for intelligent responses

### Data Flow

```
Raw Data (Emails, ROA) → Parsers → Neo4j Graph + Supabase Vectors → Visual Analytics → Court Evidence
```

## 📊 Visual Evidence Pages

### 1. Continuances Analysis (`/analytics/continuances`)

- **Top-line Summary**: Total continuances, delay days, actor breakdown
- **Attribution Charts**: Visual breakdown by petitioner/respondent/court
- **Timeline View**: Chronological events with colored dots and tooltips
- **Claims vs Reality**: Automated comparison panels
- **CSV Export**: Downloadable data for court filings

### 2. Claims Analysis (`/analytics/claims`)

- **Claim Input**: Analyze any opposing party claim
- **Evidence Storyboard**: Automated evidence compilation with citations
- **Graph Context**: Related documents and events from Neo4j
- **Similarity Scoring**: Relevance ranking of evidence
- **Export Functionality**: JSON export for legal briefs

## 🔧 Technical Implementation

### Neo4j Schema

```cypher
(:Person {name, role, email, phone})
(:Document {path, type, title, date, checksum, externalId})
(:Event {type, date, description, actor, externalId})
(:Continuance {date, reason, requestedBy, durationDays, externalId})

(Event)-[:EVIDENCES]->(Document)
(Continuance)-[:REQUESTED_BY]->(Person)
(Continuance)-[:REFERENCED_IN]->(Document)
(Person)-[:FILED]->(Document)
```

### Supabase Schema

```sql
-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document chunks with vector embeddings
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id),
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1024), -- Voyage 3 Large dimensions
    external_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints

- `POST /api/rag/query` - Graph RAG query with vector search + graph expansion
- `POST /api/ingest/emails` - Ingest email data (parse, embed, upsert)
- `POST /api/ingest/roa` - Ingest ROA data (parse, embed, upsert)
- `GET /api/verification/integrity` - System integrity checks
- `POST /api/verification/integrity` - Generate provenance reports

## 🚀 Getting Started

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Configure Neo4j Aura DB
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password

# Configure Voyage AI
VOYAGE_API_KEY=your-voyage-api-key
VOYAGE_MODEL=voyage-3-large

# Configure Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Database Setup

```bash
# Run Supabase migration
psql -h your-db-host -U postgres -d postgres -f supabase-migration.sql
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Test Connections

```bash
# Test Neo4j, Voyage, and email parser
node test-neo4j-connection.js
```

### 5. Ingest Data

```bash
# Ingest emails and ROA data
node scripts/ingest-data.js
```

### 6. Run Tests

```bash
# Run comprehensive test suite
npm test
```

## 📈 Usage Examples

### Analyzing a Claim

```javascript
// POST /api/rag/query
{
  "query": "Respondent prolonged the legal proceedings through multiple continuances",
  "maxResults": 10,
  "threshold": 0.7,
  "includeGraph": true,
  "graphHops": 2
}
```

### Ingesting Email Data

```javascript
// POST /api/ingest/emails
{
  "action": "upsert" // parse, embed, or upsert
}
```

### Checking System Integrity

```javascript
// GET /api/verification/integrity
// Returns comprehensive system health report
```

## 🎨 Visual Design

The system follows **Apple-inspired design principles**:

- **Progressive Disclosure**: Start with summary, expand to details
- **Large Top-line Numbers**: Immediate visual impact
- **Gentle Shadows**: Subtle depth and hierarchy
- **Accessible Contrast**: WCAG compliant color schemes
- **Print-Ready**: A4/Letter friendly with edge shading

## 🔍 Legal Use Cases

### 1. Continuance Attribution

**Opposing Claim**: "Respondent caused delays through continuances"

**System Response**: Visual chart showing petitioner 12 continuances vs respondent 3 continuances

### 2. Discovery Compliance

**Opposing Claim**: "Respondent failed to provide timely discovery"

**System Response**: Timeline showing actual response dates vs court deadlines

### 3. Financial Disclosure

**Opposing Claim**: "Respondent's financial disclosures were incomplete"

**System Response**: Document trail showing submission dates and completeness

## 🛡️ Verification & Governance

### Integrity Checks

- **Cross-System Consistency**: Neo4j events match Supabase documents
- **Duplicate Detection**: Checksum-based deduplication
- **Orphaned Node Detection**: Identify disconnected graph elements
- **Vector Index Health**: Verify embedding search functionality

### Provenance Tracking

Every piece of evidence includes:
- **Source Document**: Original file path and metadata
- **Extraction Method**: Parser used and confidence score
- **Processing Timestamp**: When data was ingested
- **Graph Path**: How evidence connects to other data points

## 📋 Testing

### Unit Tests

- Email parser functionality
- Voyage embedding generation
- Neo4j client operations
- Supabase vector operations

### Integration Tests

- End-to-end ingestion pipeline
- Graph RAG query processing
- Visual analytics rendering
- API endpoint functionality

### Performance Tests

- Large-scale data ingestion
- Vector search performance
- Graph traversal optimization
- UI rendering benchmarks

## 🔧 Maintenance

### Regular Tasks

1. **Data Backup**: Daily Neo4j and Supabase backups
2. **Index Maintenance**: Rebuild vector indexes monthly
3. **Performance Monitoring**: Track query response times
4. **Integrity Checks**: Weekly system health reports

### Troubleshooting

- **Connection Issues**: Check environment variables and network connectivity
- **Performance Problems**: Review query optimization and index usage
- **Data Inconsistencies**: Run integrity checks and cross-system validation
- **Embedding Failures**: Verify Voyage API key and rate limits

## 📚 Legal Compliance

### Data Privacy

- **Encryption**: All data encrypted in transit and at rest
- **Access Control**: Role-based permissions for sensitive data
- **Audit Logging**: Complete audit trail of all operations
- **Retention Policies**: Configurable data retention periods

### Court Readiness

- **Citation Format**: Standard legal citation format
- **Evidence Chain**: Complete chain of custody documentation
- **Expert Testimony**: Technical documentation for expert witnesses
- **Print Quality**: High-resolution output for court filings

## 🎯 Success Metrics

### Technical Metrics

- **Query Response Time**: < 2 seconds for Graph RAG queries
- **System Uptime**: > 99.9% availability
- **Data Accuracy**: > 95% cross-system consistency
- **User Satisfaction**: > 4.5/5 UX score

### Legal Impact

- **Case Preparation Time**: 70% reduction in document review time
- **Evidence Quality**: 90% of evidence accepted by court
- **Client Satisfaction**: 95% client approval rating
- **Win Rate**: Measurable improvement in case outcomes

## 🤝 Contributing

### Development Workflow

1. **Feature Branch**: Create branch from main
2. **Implementation**: Follow YAGNI, SOLID, KISS, DRY principles
3. **Testing**: Add comprehensive tests for new functionality
4. **Documentation**: Update README and API documentation
5. **Code Review**: Peer review before merging
6. **Deployment**: Automated deployment to staging/production

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Automated code quality checks
- **Prettier**: Consistent code formatting
- **Jest**: Comprehensive test coverage
- **Git**: Conventional commit messages

## 📞 Support

### Documentation

- **API Reference**: Complete endpoint documentation
- **User Guide**: Step-by-step usage instructions
- **Developer Guide**: Technical implementation details
- **Troubleshooting**: Common issues and solutions

### Community

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Technical questions and best practices
- **Contributions**: Pull requests and code improvements
- **Feedback**: User experience and feature suggestions

---

**Built with ❤️ for legal professionals who demand the highest quality evidence presentation tools.**
