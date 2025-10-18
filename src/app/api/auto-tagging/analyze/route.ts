import { NextRequest, NextResponse } from 'next/server';
import AutoTaggingService, { DocumentMetadata } from '@/lib/services/autoTaggingService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documents }: { documents: DocumentMetadata[] } = body;

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected documents array.' },
        { status: 400 }
      );
    }

    const autoTaggingService = AutoTaggingService.getInstance();
    const results = autoTaggingService.batchAnalyze(documents);

    return NextResponse.json({
      success: true,
      results,
      processedCount: results.length
    });

  } catch (error) {
    console.error('Auto-tagging analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error during auto-tagging analysis' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const autoTaggingService = AutoTaggingService.getInstance();
    const availableTags = autoTaggingService.getAllAvailableTags();

    return NextResponse.json({
      success: true,
      availableTags,
      tagCount: availableTags.length
    });

  } catch (error) {
    console.error('Get available tags error:', error);
    return NextResponse.json(
      { error: 'Internal server error retrieving available tags' },
      { status: 500 }
    );
  }
}
