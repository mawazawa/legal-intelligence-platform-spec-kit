import { NextRequest, NextResponse } from 'next/server';
import { getVoyageClient } from '@/lib/embeddings/voyage';
import { getSupabaseClient } from '@/lib/search/supabase';
import { generateOpposition } from '@/lib/ai/opposition-generator';
import type { OppositionResult, Evidence, CaseContext } from '@/types/opposition';

interface GenerateRequest {
  claim: string;
  caseContext?: CaseContext;
  maxEvidence?: number;
  threshold?: number;
}

/**
 * POST /api/opposition/generate
 * Generate opposition for a single claim
 */
export async function POST(request: NextRequest) {
  try {
    const { claim, caseContext, maxEvidence = 10, threshold = 0.6 } = await request.json() as GenerateRequest;

    if (!claim || claim.length < 10 || claim.length > 2000) {
      return NextResponse.json(
        { error: 'Claim must be between 10-2000 characters' },
        { status: 400 }
      );
    }

    const result = await processOpposition(claim, caseContext, maxEvidence, threshold);
    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/opposition/generate
 * Batch generate oppositions for multiple claims
 */
export async function PUT(request: NextRequest) {
  try {
    const { claims, caseContext } = await request.json() as { claims: string[]; caseContext?: CaseContext };

    if (!Array.isArray(claims) || claims.length === 0 || claims.length > 20) {
      return NextResponse.json(
        { error: 'Provide 1-20 claims' },
        { status: 400 }
      );
    }

    const results: OppositionResult[] = [];
    for (const claim of claims) {
      const result = await processOpposition(claim, caseContext);
      results.push(result);

      // Rate limiting
      if (results.length < claims.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    return NextResponse.json({ results });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/opposition/generate
 * Health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoints: {
      POST: 'Generate single opposition',
      PUT: 'Batch generate (max 20)'
    }
  });
}

/**
 * Core logic - DRY principle
 * Shared by both POST and PUT handlers
 */
async function processOpposition(
  claim: string,
  caseContext?: CaseContext,
  maxEvidence = 10,
  threshold = 0.6
): Promise<OppositionResult> {
  const startTime = Date.now();

  // 1. Embed claim
  const voyageClient = getVoyageClient();
  const embedding = await voyageClient.embedText(claim, 'query');

  // 2. Search evidence
  const supabaseClient = getSupabaseClient();
  const keywords = claim.split(' ').filter(w => w.length > 3);
  const searchResults = await supabaseClient.hybridSearch(embedding, keywords, maxEvidence, threshold);

  // 3. Format evidence
  const evidence: Evidence[] = searchResults.map(r => ({
    id: r.id,
    content: r.content,
    source: r.metadata.source as string,
    similarity: r.similarity,
    metadata: r.metadata
  }));

  // 4. Generate opposition
  const opposition = await generateOpposition({ claim, evidence, caseContext });

  return {
    claim,
    opposition,
    evidence,
    metadata: {
      processingTime: Date.now() - startTime,
      evidenceCount: evidence.length,
      model: 'claude-sonnet-4-20250514'
    }
  };
}
