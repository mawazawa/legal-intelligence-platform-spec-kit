# Testing the Opposition Assistant

## Quick Test Scenarios

### Scenario 1: Tax Form Preservation
**Claim**: "Respondent did not preserve tax forms as required by California Family Code §2621"

**Expected Evidence** (if data ingested):
- Email from Drafts.mbox (line 460788) showing 1099-K filing
- March 20, 2025 communication with tax documentation
- Evidence of proactive tax form management

**Expected Opposition Output**:
- Counter-claim stating respondent DID preserve tax forms
- Citation to CA Family Code §2621
- Reference to specific email evidence with dates
- Exhibit label (e.g., "Exhibit A: Tax Filing Correspondence")

---

### Scenario 2: Property Sale Proceeds
**Claim**: "The house sale proceeds were only $280,000"

**Expected Evidence** (if data ingested):
- Closing statement documentation
- Email references to actual proceeds of $293,695
- Communications showing property sale details

**Expected Opposition Output**:
- Counter-claim with exact proceeds amount ($293,695)
- Citation to closing documents
- Mathematical breakdown showing discrepancy
- Exhibit references to seller's closing statement

---

### Scenario 3: Tax Obligation Payment
**Claim**: "Petitioner paid her own tax obligations"

**Expected Evidence** (if data ingested):
- FTB liability attribution emails
- Add-back methodology documentation
- Tax withholding calculations

**Expected Opposition Output**:
- Counter-claim with evidence of payment responsibility
- Legal standard for tax obligation allocation
- Specific email citations showing payment arrangements
- Exhibit references to tax correspondence

---

## Test Without API Keys (UI Only)

1. Navigate to http://localhost:3000/opposition-assistant
2. Enter a test claim in the textarea
3. Click "Generate Opposition"
4. **Expected**: Error message "ANTHROPIC_API_KEY is required" or "Supabase client not configured"
5. **Result**: UI works, API integration needs keys

---

## Test With Anthropic API Only (No Evidence)

**Setup**:
```bash
# Add to .env.local
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Test**:
1. Navigate to http://localhost:3000/opposition-assistant
2. Enter claim: "Respondent did not preserve tax forms"
3. Click "Generate Opposition"
4. **Expected**: Opposition generated but with note "No supporting evidence found"
5. **Result**: AI generation works, evidence retrieval needs Supabase

---

## Full Integration Test

**Prerequisites**:
- [x] Anthropic API key in `.env.local`
- [x] Supabase database configured
- [x] Email data ingested into Supabase
- [x] Voyage AI API key in `.env.local`

**Test Steps**:
1. Navigate to http://localhost:3000/opposition-assistant
2. Fill in case details:
   - Case Number: FDI-21-794666
   - Respondent: Mathieu Wauters
   - Petitioner: [opposing party name]
3. Enter claim: "Respondent did not preserve tax forms as required by California Family Code §2621"
4. Click "Generate Opposition"
5. **Expected Results**:
   - Processing completes in 3-6 seconds
   - "Opposition Generated Successfully" banner appears
   - Evidence section shows 5-10 relevant documents
   - Each document has:
     - Source (e.g., "Drafts.mbox")
     - Relevance score (e.g., "92.3% match")
     - Content preview
     - Date metadata
   - Opposition paragraph is professional and factual
   - Citations include CA Family Code references
   - Exhibits are labeled (Exhibit A, B, C...)
   - Legal standards section populated
6. Click "Copy" button - text copied to clipboard
7. Click "Export" button - downloads .txt file

---

## API Testing (cURL)

### Test Health Endpoint
```bash
curl http://localhost:3000/api/opposition/generate
```

**Expected**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-18T06:00:00.000Z",
  "endpoints": {
    "POST": "/api/opposition/generate - Generate opposition for a single claim",
    "PUT": "/api/opposition/generate - Batch generate oppositions for multiple claims"
  }
}
```

### Test Single Claim Generation
```bash
curl -X POST http://localhost:3000/api/opposition/generate \
  -H "Content-Type: application/json" \
  -d '{
    "claim": "Respondent did not preserve tax forms",
    "caseContext": {
      "caseNumber": "FDI-21-794666",
      "respondentName": "Mathieu Wauters",
      "courtName": "San Francisco Superior Court"
    }
  }'
```

**Expected** (with full setup):
- Status: 200 OK
- Response time: 3-6 seconds
- JSON with opposition, evidence, metadata

**Expected** (without API keys):
- Status: 500 Internal Server Error
- Error message about missing API keys

### Test Batch Generation
```bash
curl -X PUT http://localhost:3000/api/opposition/generate \
  -H "Content-Type: application/json" \
  -d '{
    "claims": [
      "Respondent did not preserve tax forms",
      "The house sale proceeds were only $280,000",
      "Petitioner paid her own tax obligations"
    ],
    "caseContext": {
      "caseNumber": "FDI-21-794666"
    }
  }'
```

---

## Performance Benchmarks

### Expected Timings (Full Setup)
- Evidence retrieval: ~50ms
- Voyage AI embedding: ~200ms
- Anthropic generation: ~2-5 seconds
- **Total**: ~3-6 seconds per claim

### Batch Processing
- 3 claims: ~15-20 seconds
- Rate limiting: 1 second between requests
- Max: 20 claims per batch

---

## Error Scenarios

### 1. Missing Anthropic API Key
**Error**: "Anthropic API key is required"
**Fix**: Add ANTHROPIC_API_KEY to .env.local

### 2. Missing Voyage API Key
**Error**: "Voyage API key is required"
**Fix**: Add VOYAGE_API_KEY to .env.local

### 3. Missing Supabase Credentials
**Error**: "Supabase client not configured"
**Fix**: Add Supabase URLs and keys to .env.local

### 4. No Evidence Found
**Result**: Opposition generated with note about lack of evidence
**Fix**:
- Verify email data has been ingested
- Lower similarity threshold (0.5 instead of 0.7)
- Check Supabase table has data: `SELECT COUNT(*) FROM legal_evidence;`

### 5. Slow Response
**Symptoms**: >10 second response time
**Fix**:
- Check Supabase has ivfflat index
- Verify not hitting API rate limits
- Check Anthropic API status

---

## Success Criteria

✅ UI loads without errors
✅ Can enter claims and case details
✅ API call completes without crashes
✅ Evidence retrieved (if data available)
✅ Opposition paragraph is coherent
✅ Citations formatted correctly
✅ Can copy/export results
✅ Processing time < 10 seconds
✅ Mobile responsive design works

---

## Real Case Test Claims

Use these actual claims from your case:

1. "Respondent failed to preserve tax forms in violation of California Family Code §2621"
2. "The sale proceeds from the property were $280,000"
3. "Petitioner properly paid all tax withholding obligations"
4. "Respondent concealed the 1099-K filing from the court"
5. "The closing statement shows only $280,000 in proceeds"

These should match evidence in your mbox files if data has been ingested.

---

## Next Steps After Testing

1. **If UI works but no API keys**: Get Anthropic API key first
2. **If AI works but no evidence**: Set up Supabase and ingest data
3. **If everything works**: Start using for real case preparation
4. **If ready for production**: Deploy to Vercel with environment variables

---

**Test Status**: Ready to test UI immediately, full test requires API keys + database
**Last Updated**: October 17, 2025
