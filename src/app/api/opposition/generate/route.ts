import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logging/logger';
import { validators } from '@/lib/validation/validator';
import { getVoyageClient } from '@/lib/embeddings/voyage';
import { getSupabaseClient } from '@/lib/search/supabase';
import { getOppositionGenerator } from '@/lib/ai/opposition-generator';

export interface OppositionGenerateRequest {
  claim: string;
  caseContext?: {
    caseNumber?: string;
    respondentName?: string;
    petitionerName?: string;
    courtName?: string;
  };
  maxEvidence?: number;
  threshold?: number;
}

export interface OppositionGenerateResponse {
  claim: string;
  opposition: {
    paragraphs: string[];
    citations: string[];
    exhibits: Array<{
      label: string;
      description: string;
      sourceId: string;
    }>;
    legalStandards: string[];
  };
  evidence: Array<{
    id: string;
    content: string;
    source: string;
    similarity: number;
    metadata: Record<string, unknown>;
  }>;
  metadata: {
    processingTime: number;
    evidenceCount: number;
    model: string;
  };
}

/**
 * Opposition Generation endpoint
 * POST /api/opposition/generate
 *
 * Workflow:
 * 1. User submits opposing party's claim
 * 2. System generates embedding for claim
 * 3. RAG retrieves relevant evidence from vector DB
 * 4. AI generates opposition paragraph with citations
 * 5. Returns formatted opposition ready for filing
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: OppositionGenerateRequest = await request.json();
    const {
      claim,
      caseContext,
      maxEvidence = 10,
      threshold = 0.6 // Lower threshold for broader evidence search
    } = body;

    // Validate claim parameter
    const claimValidator = validators.string().min(10).max(2000);
    const claimValidation = claimValidator.validate(claim);

    if (!claimValidation.success) {
      logger.warn('Invalid opposition generation request', {
        errors: claimValidation.errors
      });
      return NextResponse.json(
        {
          error: 'Claim is required and must be between 10-2000 characters'
        },
        { status: 400 }
      );
    }

    logger.info('Processing opposition generation request', {
      claimLength: claim.length,
      hasCaseContext: !!caseContext
    });

    // Step 1: Generate embedding for the claim
    const voyageClient = getVoyageClient();
    const claimEmbedding = await voyageClient.embedText(claim);

    // Step 2: Search for evidence in vector database
    const supabaseClient = getSupabaseClient();
    const searchResults = await supabaseClient.hybridSearch(
      claimEmbedding,
      claim.split(' ').filter(word => word.length > 3), // Extract keywords
      maxEvidence,
      threshold
    );

    logger.info('Evidence retrieval completed', {
      resultsFound: searchResults.length,
      topSimilarity: searchResults[0]?.similarity || 0
    });

    // Step 3: Prepare evidence for AI generation
    const evidence = searchResults.map(result => ({
      id: result.id,
      content: result.content,
      source: result.metadata.source as string,
      similarity: result.similarity,
      metadata: result.metadata
    }));

    // Step 4: Generate opposition paragraph using AI
    const oppositionGenerator = getOppositionGenerator();
    const oppositionResult = await oppositionGenerator.generateOpposition({
      claim,
      evidence,
      caseContext
    });

    // Step 5: Build response
    const response: OppositionGenerateResponse = {
      claim,
      opposition: oppositionResult,
      evidence,
      metadata: {
        processingTime: Date.now() - startTime,
        evidenceCount: evidence.length,
        model: 'claude-sonnet-4-20250514'
      }
    };

    logger.info('Opposition generation completed successfully', {
      processingTime: response.metadata.processingTime,
      paragraphCount: oppositionResult.paragraphs.length,
      evidenceCount: evidence.length
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Opposition generation error', error as Error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Batch Opposition Generation endpoint
 * POST /api/opposition/generate/batch
 */
export async function PUT(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: { claims: string[]; caseContext?: OppositionGenerateRequest['caseContext'] } =
      await request.json();

    if (!Array.isArray(body.claims) || body.claims.length === 0) {
      return NextResponse.json(
        { error: 'claims array is required' },
        { status: 400 }
      );
    }

    if (body.claims.length > 20) {
      return NextResponse.json(
        { error: 'Maximum 20 claims per batch request' },
        { status: 400 }
      );
    }

    logger.info('Processing batch opposition generation', {
      claimCount: body.claims.length
    });

    const results: OppositionGenerateResponse[] = [];

    for (const claim of body.claims) {
      // Reuse the POST logic for each claim
      const claimRequest = new NextRequest('http://localhost/api/opposition/generate', {
        method: 'POST',
        body: JSON.stringify({
          claim,
          caseContext: body.caseContext
        })
      });

      const claimResponse = await POST(claimRequest);
      const claimData = await claimResponse.json();

      results.push(claimData);

      // Rate limiting between requests
      if (results.length < body.claims.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      results,
      metadata: {
        totalClaims: body.claims.length,
        processingTime: Date.now() - startTime
      }
    });

  } catch (error) {
    logger.error('Batch opposition generation error', error as Error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: '/api/opposition/generate - Generate opposition for a single claim',
      PUT: '/api/opposition/generate - Batch generate oppositions for multiple claims'
    }
  });
}
