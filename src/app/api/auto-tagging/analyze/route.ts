import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logging/logger';
import AutoTaggingService, { DocumentMetadata } from '@/lib/services/autoTaggingService';

/**
 * Analyze documents for automatic tagging
 * POST /api/auto-tagging/analyze
 * Body: { documents: DocumentMetadata[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documents }: { documents: DocumentMetadata[] } = body;

    if (!documents || !Array.isArray(documents)) {
      logger.warn('Invalid auto-tagging request', { documentsType: typeof documents });
      return NextResponse.json(
        { error: 'Invalid request. Expected documents array.' },
        { status: 400 }
      );
    }

    logger.debug('Analyzing documents for auto-tagging', { documentCount: documents.length });

    const autoTaggingService = AutoTaggingService.getInstance();
    const results = autoTaggingService.batchAnalyze(documents);

    logger.info('Auto-tagging analysis completed', {
      documentCount: documents.length,
      processedCount: results.length
    });

    return NextResponse.json({
      success: true,
      results,
      processedCount: results.length
    });

  } catch (error) {
    logger.error('Auto-tagging analysis error', error as Error);
    return NextResponse.json(
      { error: 'Internal server error during auto-tagging analysis' },
      { status: 500 }
    );
  }
}

/**
 * Get all available tags
 * GET /api/auto-tagging/analyze
 */
export async function GET() {
  try {
    logger.debug('Fetching available tags');

    const autoTaggingService = AutoTaggingService.getInstance();
    const availableTags = autoTaggingService.getAllAvailableTags();

    logger.info('Retrieved available tags', { tagCount: availableTags.length });

    return NextResponse.json({
      success: true,
      availableTags,
      tagCount: availableTags.length
    });

  } catch (error) {
    logger.error('Error retrieving available tags', error as Error);
    return NextResponse.json(
      { error: 'Internal server error retrieving available tags' },
      { status: 500 }
    );
  }
}
